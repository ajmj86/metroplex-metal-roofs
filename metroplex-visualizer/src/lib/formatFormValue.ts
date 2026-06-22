export type FormAnswerField = 'roofType' | 'reason' | 'insuranceClaim' | 'timeline'

const ROOF_TYPE_LABELS: Record<string, string> = {
  asphalt_shingles: 'Asphalt Shingles',
  metal_old: 'Old Metal',
  tile: 'Tile / Clay',
  flat: 'Flat / TPO',
  unknown: 'Unknown',
}

const REASON_LABELS: Record<string, string> = {
  hail_damage: 'Storm Damage',
  age_replace: 'Age',
  upgrade: 'Upgrade',
  selling: 'Selling Home',
  new_build: 'New Construction',
}

const INSURANCE_CLAIM_LABELS: Record<string, string> = {
  yes_approved: 'Approved',
  yes_pending: 'Pending',
  no_but_considering: 'Considering',
  no_cash: 'Paying Out of Pocket',
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: 'ASAP',
  '1_3_months': '1-3 Months',
  '3_6_months': '3-6 Months',
  just_researching: 'Researching',
}

const FORM_ANSWER_LABELS: Record<FormAnswerField, Record<string, string>> = {
  roofType: ROOF_TYPE_LABELS,
  reason: REASON_LABELS,
  insuranceClaim: INSURANCE_CLAIM_LABELS,
  timeline: TIMELINE_LABELS,
}

// Converts raw form values (e.g. "hail_damage") into clean labels (e.g. "Storm Damage")
// for GHL webhook payloads. Unmapped values pass through unchanged.
export function formatFormValue(field: FormAnswerField, value: string | undefined | null): string {
  if (!value) return value ?? ''
  return FORM_ANSWER_LABELS[field][value] ?? value
}
