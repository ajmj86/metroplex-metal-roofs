// Pure pricing math for the visualizer estimate. No imports on purpose: the
// config is injected so unit tests (scripts/test-estimate.mjs) can run this
// file directly under Node without the Next.js path aliases.
//
// price_low  = rate * (netSquares * wasteLow)
// price_high = rate * (netSquares * wasteHigh)
// wasteLow/wasteHigh are multipliers (1.2 = 20% extra), not percentages.

export type PricedConfig = {
  label?: string
  retailPerSquare?: number
  retailPerSquareMetallic?: number
  retailPerSquareStandard?: number
  metallicColors?: string[]
  noPriceEstimate?: boolean
  wasteLow?: number
  wasteHigh?: number
  // Material families with several priced styles (Brava synthetic).
  defaultStyle?: string
  styles?: Record<string, PricedConfig>
}

export type EstimateResult =
  | { priced: true; low: number; high: number; grossLow: number; grossHigh: number; rate: number }
  | { priced: false; reason: 'no_estimate' | 'unknown_material' }

function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

export function resolveMaterialConfig(
  roofTypes: Record<string, PricedConfig>,
  roofType: string | undefined,
  style?: string | null
): PricedConfig | null {
  if (!roofType || !(roofType in roofTypes)) return null
  const base = roofTypes[roofType]
  if (!base.styles) return base
  const key = style && style in base.styles ? style : base.defaultStyle
  return key ? base.styles[key] ?? null : null
}

function resolveRate(config: PricedConfig, color?: string): number | null {
  if (isFiniteNumber(config.retailPerSquareMetallic) && isFiniteNumber(config.retailPerSquareStandard)) {
    const isMetallic = !!color && (config.metallicColors ?? []).includes(color)
    return isMetallic ? config.retailPerSquareMetallic : config.retailPerSquareStandard
  }
  return isFiniteNumber(config.retailPerSquare) ? config.retailPerSquare : null
}

export function computeEstimate(
  roofTypes: Record<string, PricedConfig>,
  netSquares: number,
  roofType: string | undefined,
  color?: string,
  style?: string | null
): EstimateResult {
  const config = resolveMaterialConfig(roofTypes, roofType, style)
  if (!config) return { priced: false, reason: 'unknown_material' }
  if (config.noPriceEstimate) return { priced: false, reason: 'no_estimate' }
  const rate = resolveRate(config, color)
  if (rate == null || !isFiniteNumber(config.wasteLow) || !isFiniteNumber(config.wasteHigh) || !isFiniteNumber(netSquares)) {
    return { priced: false, reason: 'unknown_material' }
  }
  const grossLow = netSquares * config.wasteLow
  const grossHigh = netSquares * config.wasteHigh
  return { priced: true, low: rate * grossLow, high: rate * grossHigh, grossLow, grossHigh, rate }
}

// Confidence gate on the corrected roof area: 800 - 8,000 sq ft (74.3 - 743 m²).
export const MIN_AREA_M2 = 74.3
export const MAX_AREA_M2 = 743
export function isAreaInRange(areaM2: number): boolean {
  return areaM2 >= MIN_AREA_M2 && areaM2 <= MAX_AREA_M2
}

// Manual fallback: same story-count-to-footprint heuristic as the old
// (deleted) /api/estimate route — a one-story home's roof is close to its
// full living-space footprint (no stacking), a two-story home's footprint
// is roughly half its living space, "not sure" splits the difference.
export function squaresFromManualSqFt(sqFt: number, stories: string | undefined): number {
  let multiplier = 1.05
  if (stories === 'one') multiplier = 1.30
  else if (stories === 'two') multiplier = 0.80
  return (sqFt * multiplier) / 100
}

// ── Server-side lead estimate ───────────────────────────────────────────────
// /api/lead-intake and /api/update-opportunity-value never trust a price sent
// by the browser: they recompute low/high here from the inputs the lead
// carries (net squares, or manual sqft + stories, plus material/style/color).
// Net squares from the browser are still an input, so they are bounded by the
// same confidence gate /api/roof-size applies (800 - 8,000 sq ft).
export type LeadEstimate =
  | { status: 'priced'; low: number; high: number } // whole dollars
  | { status: 'none' } // material has no dollar estimate (copper) -> "custom quote"
  | { status: 'unavailable' } // missing/invalid inputs -> leave the value unset

export type LeadEstimateInput = {
  roofType?: string
  style?: string | null
  color?: string
  netSquares?: number | null
  manualSqFt?: number | null
  stories?: string
  roofSizeSource?: string
}

const MAX_MANUAL_SQFT = 100_000

export function estimateForLead(roofTypes: Record<string, PricedConfig>, input: LeadEstimateInput): LeadEstimate {
  const config = resolveMaterialConfig(roofTypes, input.roofType, input.style)
  if (!config) return { status: 'unavailable' }
  if (config.noPriceEstimate) return { status: 'none' }

  let squares: number | null = null
  if (input.roofSizeSource === 'manual') {
    const sq = Number(input.manualSqFt)
    if (Number.isFinite(sq) && sq > 0 && sq <= MAX_MANUAL_SQFT) squares = squaresFromManualSqFt(sq, input.stories)
  } else {
    const n = Number(input.netSquares)
    if (input.netSquares != null && Number.isFinite(n) && n > 0 && isAreaInRange((n * 100) / 10.7639)) squares = n
  }
  if (squares == null) return { status: 'unavailable' }

  const r = computeEstimate(roofTypes, squares, input.roofType, input.color, input.style)
  if (!r.priced) return { status: 'unavailable' }
  const low = Math.round(r.low)
  const high = Math.round(r.high)
  if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0) return { status: 'unavailable' }
  return { status: 'priced', low, high }
}
