import { NextRequest, NextResponse } from 'next/server'
import { createOpportunity } from '@/lib/ghl'
import { formatFormValue } from '@/lib/formatFormValue'

export const maxDuration = 15

// Case B only (returning contact, new property) — called by the client after
// /api/lead-intake resolves. n8n's own opportunity dedupe (contactId-only, not
// address-aware — see n8n-workflows/lead-intake-visualizer.json's
// "Check Existing Opportunity") would otherwise just reuse/update-stage the
// contact's existing opportunity instead of creating a new one for this
// property, so this makes a direct, separate call to force a genuinely new
// opportunity. Sequenced strictly after /api/lead-intake's n8n round-trip
// resolves (that call is awaited client-side before this one fires), so
// n8n's own dedupe search has already completed before this creates anything
// — no race between the two.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { contactId, firstName, lastName, address, reason, timeline } = body as {
      contactId?: string
      firstName?: string
      lastName?: string
      address?: string
      reason?: string
      timeline?: string
    }

    if (!contactId) {
      return NextResponse.json({ error: 'Missing required field: contactId' }, { status: 400 })
    }

    // Bake a per-property snapshot into the opportunity name — this is the
    // only per-opportunity (not per-contact) record of which property/reason
    // this deal is about, since GHL custom fields here are contact-level and
    // get overwritten by whichever submission is most recent.
    const who = [firstName, lastName].filter(Boolean).join(' ') || 'Visualizer Lead'
    const detailParts = [address, formatFormValue('reason', reason), formatFormValue('timeline', timeline)].filter(Boolean)
    const name = detailParts.length ? `${who} - ${detailParts.join(' / ')}` : who

    const opportunity = await createOpportunity({ contactId, name, source: 'visualizer' })
    if (!opportunity) {
      return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 502 })
    }

    return NextResponse.json({ success: true, opportunityId: opportunity.id })
  } catch (err) {
    console.error('[create-opportunity]', err)
    return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 500 })
  }
}
