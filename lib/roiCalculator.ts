import type { Stat } from '@/components/StatItem'

/*
 * Single source of truth for the "ROI vs. Asphalt" stat and its "How This Is
 * Calculated" tooltip, shared by components/Homepage.jsx and
 * components/CityPage.tsx -- previously each file hand-maintained an
 * identical, fully hardcoded copy of this stat (same numbers, same tooltip
 * rows, same footnote string), including the derived figures (92% ROI,
 * "$1.92 for every $1") as literal strings that would silently go stale the
 * moment any input changed. Every derived figure below is now computed from
 * these assumptions instead, so a future change to any input (e.g. the
 * replacement cost) automatically keeps the stat-strip number, the tooltip
 * rows, and the footnote in sync with each other.
 */

export const ROI_ASSUMPTIONS = {
  timeSpanYears: 20,
  roofSizeSquares: 30,
  roofSizeSqFtApprox: 2800,
  homeValue: 850000,
  // Cost of one standing seam metal roof replacement -- the "investment"
  // side of the ROI calculation.
  metalRoofReplacementCost: 42000,
  annualUtilities: 3200,
  annualPremiums: 4000,
  // Two asphalt-roof-replacement insurance claims over the 20-year span,
  // each carrying its own deductible (2% then 3% of home value) -- a metal
  // roof's Class 4 impact rating avoids both, so this is the "avoided
  // deductible cost" side of the return.
  deductiblePercents: [2, 3],
  premiumReductionPct: 35,
  utilityReductionPct: 25,
} as const

const currency = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

export function computeRoi(a: typeof ROI_ASSUMPTIONS = ROI_ASSUMPTIONS) {
  const avoidedDeductibles = a.deductiblePercents.reduce((sum, pct) => sum + (pct / 100) * a.homeValue, 0)
  const premiumSavings = (a.premiumReductionPct / 100) * a.annualPremiums * a.timeSpanYears
  const utilitySavings = (a.utilityReductionPct / 100) * a.annualUtilities * a.timeSpanYears
  const totalReturns = avoidedDeductibles + premiumSavings + utilitySavings

  // "$X for every $1 spent" -- total returns per dollar of upfront investment.
  const returnMultiple = totalReturns / a.metalRoofReplacementCost
  // Net-gain ROI: (returns - cost) / cost, expressed as a whole-number percent.
  const roiPercent = Math.round((returnMultiple - 1) * 100)
  // Payback period: years of averaged annual return (total returns spread
  // evenly across the time span) needed to recoup the upfront cost --
  // equivalently, cost x timeSpan / totalReturns.
  const paybackYears = (a.metalRoofReplacementCost * a.timeSpanYears) / totalReturns

  return { avoidedDeductibles, premiumSavings, utilitySavings, totalReturns, returnMultiple, roiPercent, paybackYears }
}

export const ROI_RESULT = computeRoi()

const multipleDescriptor =
  ROI_RESULT.returnMultiple >= 2 ? 'more than double'
  : ROI_RESULT.returnMultiple >= 1.5 ? 'nearly double'
  : `${ROI_RESULT.returnMultiple.toFixed(1)}×`

export const ROI_STAT: Stat = {
  val: ROI_RESULT.roiPercent,
  suffix: '%',
  label: 'ROI vs. Asphalt',
  tooltip: [
    { label: 'Time span', value: `${ROI_ASSUMPTIONS.timeSpanYears} years` },
    { label: 'Roof size', value: `${ROI_ASSUMPTIONS.roofSizeSquares} squares (~${ROI_ASSUMPTIONS.roofSizeSqFtApprox.toLocaleString('en-US')} sf home)` },
    { label: 'Home value', value: currency(ROI_ASSUMPTIONS.homeValue) },
    { label: '1 standing seam metal roof replacement', value: currency(ROI_ASSUMPTIONS.metalRoofReplacementCost) },
    { label: 'Annual utilities', value: currency(ROI_ASSUMPTIONS.annualUtilities) },
    { label: 'Annual premiums', value: currency(ROI_ASSUMPTIONS.annualPremiums) },
    {
      label: `${ROI_ASSUMPTIONS.deductiblePercents.length} roof replacement deductibles (${ROI_ASSUMPTIONS.deductiblePercents.map(p => `${p}%`).join(' + ')})`,
      value: currency(ROI_RESULT.avoidedDeductibles),
    },
    { label: 'Premium reduction', value: `${ROI_ASSUMPTIONS.premiumReductionPct}%` },
    { label: 'Utility reduction', value: `${ROI_ASSUMPTIONS.utilityReductionPct}%` },
    { label: 'Break-Even Point', value: `${ROI_RESULT.paybackYears.toFixed(1)} years` },
  ],
  footnote: `Over ${ROI_ASSUMPTIONS.timeSpanYears} years, avoided replacement costs, insurance savings, and energy savings return about $${ROI_RESULT.returnMultiple.toFixed(2)} for every $1 spent on your metal roof — ${multipleDescriptor} your investment.`,
}
