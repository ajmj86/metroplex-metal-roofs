/*
 * The 40-Point Roof & Structure Assessment — shared source for the
 * Homepage.jsx (full grid) and CityPage.tsx (full grid on city pages too)
 * sections, so the two never drift out of sync. Point count is grounded in
 * a real, itemized checklist, not a marketing-only number — categories sum
 * to 40 (7+8+6+6+6+7). See session notes for the full 40-item breakdown.
 */
export interface AssessmentCategory {
  label: string
  count: number
  example: string
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  { label: 'Structural & Decking',       count: 7, example: 'Decking integrity, rafter/truss condition, slope verification, load capacity for your chosen system.' },
  { label: 'Weatherproofing & Flashing', count: 8, example: 'Valley, chimney, and skylight flashing, drip edge, step flashing, pipe boots, sealant condition.' },
  { label: 'Ventilation & Attic',        count: 6, example: 'Ridge and soffit vent function, attic moisture and insulation, airflow balance.' },
  { label: 'Penetrations & Add-Ons',     count: 6, example: 'Solar mounts, satellite brackets, HVAC lines, electrical mast, plumbing vents, skylights.' },
  { label: 'Drainage & Edges',           count: 6, example: 'Gutters, downspouts, fascia, soffits, roof-to-wall transitions, ponding risk.' },
  { label: 'Measurement & Code',         count: 7, example: 'Satellite aerial measurement, wind/hail rating compliance, HOA material review, permitting.' },
]
