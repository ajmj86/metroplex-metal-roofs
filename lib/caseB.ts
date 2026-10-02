// Case B (returning contact, NEW address): GHL allows only one opportunity per
// contact in the visualizer pipeline and answers a second create with
// OPPORTUNITY_NO_DUPLICATE. That is an expected, handled outcome -- not a
// failure the visitor should ever see -- so it becomes {created:false} plus one
// SMS to Andrew asking him to create the opportunity by hand. The existing
// opportunity (and its value) is never touched.
//
// Import-free on purpose: scripts/test-caseB.mjs runs this file directly under
// Node, with the GHL/alert dependencies injected.

export type CreateOppResult =
  | { ok: true; id: string }
  | { ok: false; duplicate: true; existingId: string | null }
  | { ok: false; duplicate: false }

export type CaseBEstimate = { status: 'priced'; low: number; high: number } | { status: 'none' } | { status: 'unavailable' }

export type CaseBInput = {
  contactId: string
  name: string
  firstName?: string
  lastName?: string
  address?: string
  roofLabel?: string
  estimate: CaseBEstimate
}

export type CaseBDeps = {
  createOpportunity: (p: { contactId: string; name: string; source: string; monetaryValue?: number }) => Promise<CreateOppResult>
  alertAndrew: (message: string) => Promise<boolean>
  getContactPhone: (contactId: string) => Promise<string | null>
}

export type CaseBResponse = { status: number; body: Record<string, unknown> }

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
const MAX_ALERT_CHARS = 300

export function maskPhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D/g, '')
  return digits.length >= 4 ? `***${digits.slice(-4)}` : ''
}

export function buildCaseBAlert(i: {
  firstName?: string; lastName?: string; phone?: string | null; address?: string; roofLabel?: string; estimate: CaseBEstimate
}): string {
  const who = [i.firstName, i.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
  const masked = maskPhone(i.phone)
  const est =
    i.estimate.status === 'priced' ? `${usd(i.estimate.low)} – ${usd(i.estimate.high)}`
    : i.estimate.status === 'none' ? 'none (custom quote)'
    : ''
  const build = (addrMax: number) => [
    'Returning contact entered a new address. GHL blocked a second opportunity. Create it manually.',
    `${who}${masked ? ` ${masked}` : ''}`,
    i.address ? `New address: ${i.address.length > addrMax ? i.address.slice(0, addrMax - 1) + '…' : i.address}` : '',
    i.roofLabel ? `Roof: ${i.roofLabel}` : '',
    est ? `Estimate: ${est}` : '',
  ].filter(Boolean).join('\n')
  let msg = build(70)
  for (let max = 60; msg.length > MAX_ALERT_CHARS && max >= 20; max -= 10) msg = build(max)
  return msg
}

export async function createOpportunityForCaseB(deps: CaseBDeps, input: CaseBInput): Promise<CaseBResponse> {
  const result = await deps.createOpportunity({
    contactId: input.contactId,
    name: input.name,
    source: 'visualizer',
    monetaryValue: input.estimate.status === 'priced' ? input.estimate.low : undefined,
  })
  if (result.ok) return { status: 200, body: { success: true, ok: true, created: true, opportunityId: result.id } }

  if (result.duplicate) {
    let phone: string | null = null
    try { phone = await deps.getContactPhone(input.contactId) } catch { phone = null }
    await deps.alertAndrew(buildCaseBAlert({
      firstName: input.firstName, lastName: input.lastName, phone,
      address: input.address, roofLabel: input.roofLabel, estimate: input.estimate,
    }))
    return { status: 200, body: { ok: true, created: false, reason: 'existing_opportunity', existingOpportunityId: result.existingId } }
  }
  return { status: 502, body: { error: 'Failed to create opportunity' } }
}
