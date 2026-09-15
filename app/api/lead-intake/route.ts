import { NextRequest, NextResponse } from 'next/server';
import { formatFormValue } from '@/lib/formatFormValue';
import { getRoofTypeLabel } from '@/lib/roofProducts';
import { signVisitorToken } from '@/lib/visitorToken';

const VISITOR_COOKIE = 'mmr_visitor';

export const maxDuration = 30;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_VISUALIZER;

type AddressComponents = { streetAddress?: string; city?: string; state?: string; postalCode?: string };

// `components` comes from the visualizer's Google Places selection
// (extractAddressComponents in page.tsx) and is only present when the
// visitor actually picked a suggestion — it's the reliable source and
// always wins when available. The string-split of `full` is a best-effort
// fallback for the few callers that don't have it (e.g. a returning
// visitor's previously-stored address string), and only reliably works for
// Google's own "Street, City, ST ZIP, USA" formatted_address shape — it
// silently produces blank city/state/zip for anything else, including
// free-typed text with no commas at all. That fallback failure is expected
// and handled by the caller (see the Address Needs Verification tag below),
// not something to "fix" here.
function parseAddress(full: string, components?: AddressComponents | null) {
  const parts = full.split(', ');
  const stateZip = (parts[2] || '').split(' ');
  return {
    address1: components?.streetAddress || parts[0] || '',
    city: components?.city || parts[1] || '',
    state: components?.state || stateZip[0] || '',
    postalCode: components?.postalCode || stateZip[1] || '',
  };
}

// Forwards the visualizer lead payload to the n8n Lead Intake workflow.
// Kept server-side so the webhook URL never ships to the browser.
export async function POST(req: NextRequest) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.error('[lead-intake] N8N_WEBHOOK_VISUALIZER is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await req.json();
    const parsed = parseAddress(body.address || '', body.addressComponents);

    const payload = body.partial === true ? body : {
      contact: {
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        phone: body.phone || '',
        email: body.email || '',
        address1: parsed.address1,
        city: parsed.city,
        state: parsed.state,
        postalCode: parsed.postalCode,
      },
      fields: {
        current_roof_type: formatFormValue('roofType', body.currentRoofType),
        project_reason: formatFormValue('reason', body.reason),
        insurance_claim_status: formatFormValue('insuranceClaim', body.insuranceClaim),
        homeowner_timeline: formatFormValue('timeline', body.timeline),
        selected_roof_type: body.selectedRoofType ? getRoofTypeLabel(body.selectedRoofType) : '',
        property_address: body.address || '',
        estimated_roof_size: body.estimatedRoofSize != null
          ? String(Math.round(body.estimatedRoofSize * 10) / 10)
          : undefined,
        estimate_range: body.estimateRange || undefined,
        // ?? (not ||) so an explicit '' (solar succeeded) survives instead of
        // collapsing to undefined like a field that was never sent at all —
        // n8n needs that distinction to clear a stale failure reason on success.
        solar_failure_reason: body.solarFailureReason ?? undefined,
        roof_size_source: body.roofSizeSource || undefined,
      },
      utm: {
        source: body.utm?.source || '',
        medium: body.utm?.medium || '',
        campaign: body.utm?.campaign || '',
        content: body.utm?.content || '',
      },
      tags: [
        ...(body.insuranceClaim && body.insuranceClaim !== 'no_cash' ? ['Insurance Claim'] : []),
        ...(body.roofSizeSource === 'manual' ? ['Manual Roof Size'] : []),
        // Neither a real Places selection nor the string-split fallback
        // produced a city — the visitor typed/edited the address by hand in
        // a shape the fallback can't parse. Surfaces on the pipeline card so
        // it doesn't sit silently blank the way it did for two of the three
        // leads that hit this before the fix (2026-09-15).
        ...(body.address && !parsed.city ? ['Address Needs Verification'] : []),
      ],
      source: 'visualizer',
      suppressAlert: body.suppressAlert === true,
      smsConsent: body.smsConsent === true,
    };

    console.log('[lead-intake] forwarding payload to n8n:', payload);

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const n8nBody = await n8nRes.text();
    console.log('[lead-intake] n8n response status:', n8nRes.status, 'body:', n8nBody);

    if (!n8nRes.ok) {
      return NextResponse.json({ error: 'Lead intake workflow failed' }, { status: 502 });
    }

    const res = NextResponse.json({ success: true });

    // Issue the returning-visitor cookie on real (non-partial) submissions only —
    // partial/beforeunload captures and the visualizer_render email-only calls
    // never reach this branch (see payload.partial above), so this only fires
    // for a completed contact/opportunity submission.
    if (body.partial !== true) {
      try {
        const n8nJson = JSON.parse(n8nBody);
        if (n8nJson?.contactId) {
          res.cookies.set(VISITOR_COOKIE, signVisitorToken(n8nJson.contactId), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 180,
            path: '/',
          });
        }
      } catch (err) {
        console.error('[lead-intake] failed to parse n8n response for cookie issuance:', err);
      }
    }

    return res;
  } catch (err) {
    console.error('[lead-intake]', err);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
