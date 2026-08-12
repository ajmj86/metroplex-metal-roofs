// Single source of truth for the $/sq ft pricing table shown on city pages
// and material landing pages. Deliberately not city-specific -- these are
// DFW-wide installed-cost ranges; keeping one shared array (rather than
// letting each page define its own numbers) is what keeps the figures
// consistent everywhere they're cited, which matters for the LLM-citation
// use case this table was built for.
export interface RoofingPriceRow {
  material: string
  lowPerSqFt: number
  highPerSqFt: number
  // true if the high end is presented as "$X+" (open-ended) rather than a
  // hard ceiling -- used for materials where cost can climb well past a
  // typical range on complex/premium jobs (premium standing seam, copper).
  highIsPlus: boolean
}

export const ROOFING_PRICING: RoofingPriceRow[] = [
  { material: 'R-Panel / Exposed-Fastener Steel', lowPerSqFt: 7, highPerSqFt: 11, highIsPlus: false },
  { material: 'Stone-Coated Steel', lowPerSqFt: 10, highPerSqFt: 16, highIsPlus: false },
  { material: 'Standing Seam Steel', lowPerSqFt: 12, highPerSqFt: 18, highIsPlus: false },
  { material: 'Premium 24-Gauge Standing Seam', lowPerSqFt: 15, highPerSqFt: 22, highIsPlus: true },
  { material: 'Synthetic Slate (Composite)', lowPerSqFt: 12, highPerSqFt: 20, highIsPlus: false },
  { material: 'Copper', lowPerSqFt: 25, highPerSqFt: 40, highIsPlus: true },
]

// Representative roof size used to compute the sample total-cost column --
// the midpoint of the 3,000-4,000 sq ft range these figures were validated
// against.
export const PRICING_SAMPLE_SQFT = 3500

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}

export function sampleTotalRange(row: RoofingPriceRow, sqft: number = PRICING_SAMPLE_SQFT): string {
  const low = formatCurrency(Math.round(row.lowPerSqFt * sqft))
  const high = formatCurrency(Math.round(row.highPerSqFt * sqft))
  return `${low}–${high}${row.highIsPlus ? '+' : ''}`
}

export function perSqFtRange(row: RoofingPriceRow): string {
  return `$${row.lowPerSqFt}–$${row.highPerSqFt}${row.highIsPlus ? '+' : ''}`
}
