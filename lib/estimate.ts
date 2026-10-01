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
