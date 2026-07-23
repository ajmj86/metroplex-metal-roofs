// Direct GHL API calls for the returning-visitor feature. Same auth pattern as
// alertAndrewOfRenderFailure() in app/api/render/route.ts (Bearer token + the
// 2021-07-28 API version header) — reused here rather than inventing a new one.
// Endpoint shapes mirror the corresponding nodes in
// n8n-workflows/lead-intake-visualizer.json ("Search Contact By Email",
// "Create Opportunity") so this stays consistent with what n8n already does.

const GHL_BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'

// property_address is the only contact-level custom field this feature needs —
// see lib/visitorToken.ts / app/api/returning-visitor for why roofType/reason/
// insuranceClaim/timeline were deliberately dropped from scope.
const FIELD_ID_PROPERTY_ADDRESS = 'acFCeylcy8uhep3stymL'

function authHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: GHL_VERSION,
    'Content-Type': 'application/json',
  }
}

interface GhlContact {
  id: string
  firstName?: string
  phone?: string
  email?: string
  customFields?: Array<{ id: string; value?: string }>
}

export interface RecognizedContact {
  contactId: string
  firstName: string
  phone: string
  email: string
  address: string
}

function contactToRecognized(contact: GhlContact): RecognizedContact {
  const address = contact.customFields?.find((f) => f.id === FIELD_ID_PROPERTY_ADDRESS)?.value ?? ''
  return {
    contactId: contact.id,
    firstName: contact.firstName ?? '',
    phone: contact.phone ?? '',
    email: contact.email ?? '',
    address,
  }
}

// Mirrors n8n's "Search Contact By Email" node (GET /contacts/search/duplicate).
// Tries email first (if given), then phone — GHL's dedupe endpoint matches on
// one identifier at a time, so "match on email OR phone" means two attempts,
// not one combined query.
export async function searchContactByEmailOrPhone(
  email: string | undefined,
  phone: string | undefined
): Promise<RecognizedContact | null> {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  if (!apiKey || !locationId) {
    console.warn('[ghl] GHL_API_KEY or GHL_LOCATION_ID not set — cannot search contacts')
    return null
  }

  for (const [param, value] of [['email', email], ['phone', phone]] as const) {
    if (!value) continue
    try {
      const url = `${GHL_BASE}/contacts/search/duplicate?locationId=${encodeURIComponent(locationId)}&${param}=${encodeURIComponent(value)}`
      const res = await fetch(url, { headers: authHeaders(apiKey) })
      if (!res.ok) continue
      const data = await res.json()
      const contact: GhlContact | undefined = data?.contact
      if (contact?.id) {
        // search/duplicate returns a thin contact shape — fetch the full
        // record for customFields (property_address).
        const full = await getContact(contact.id)
        if (full) return full
      }
    } catch (err) {
      console.error(`[ghl] searchContactByEmailOrPhone (${param}) failed:`, err)
    }
  }
  return null
}

// Mirrors the contact shape read by "Build Contact Payload (Filter Nulls)" in
// n8n, but as a read (GET /contacts/{id}) rather than a write.
export async function getContact(contactId: string): Promise<RecognizedContact | null> {
  const apiKey = process.env.GHL_API_KEY
  if (!apiKey) {
    console.warn('[ghl] GHL_API_KEY not set — cannot fetch contact')
    return null
  }
  try {
    const res = await fetch(`${GHL_BASE}/contacts/${contactId}`, { headers: authHeaders(apiKey) })
    if (!res.ok) return null
    const data = await res.json()
    const contact: GhlContact | undefined = data?.contact
    if (!contact?.id) return null
    return contactToRecognized(contact)
  } catch (err) {
    console.error('[ghl] getContact failed:', err)
    return null
  }
}

// Mirrors n8n's "Create Opportunity" node (POST /opportunities/) — used only
// for Case B (returning contact, new property), where n8n's own contact-only
// dedupe would otherwise reuse the existing opportunity instead of creating a
// new one. GHL_PIPELINE_ID/GHL_STAGE_ID must match the hardcoded values in
// n8n's "Config – GHL IDs" node exactly.
export async function createOpportunity(params: {
  contactId: string
  name: string
  source: string
}): Promise<{ id: string } | null> {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  const pipelineId = process.env.GHL_PIPELINE_ID
  const stageId = process.env.GHL_STAGE_ID
  if (!apiKey || !locationId || !pipelineId || !stageId) {
    console.warn('[ghl] Missing GHL env vars — cannot create opportunity', {
      hasApiKey: !!apiKey, hasLocationId: !!locationId, hasPipelineId: !!pipelineId, hasStageId: !!stageId,
    })
    return null
  }
  try {
    const res = await fetch(`${GHL_BASE}/opportunities/`, {
      method: 'POST',
      headers: authHeaders(apiKey),
      body: JSON.stringify({
        pipelineId,
        locationId,
        pipelineStageId: stageId,
        name: params.name,
        status: 'open',
        contactId: params.contactId,
        source: params.source,
      }),
    })
    if (!res.ok) {
      console.error('[ghl] createOpportunity got non-OK response:', res.status, await res.text())
      return null
    }
    const data = await res.json()
    return data?.opportunity?.id ? { id: data.opportunity.id } : null
  } catch (err) {
    console.error('[ghl] createOpportunity failed:', err)
    return null
  }
}
