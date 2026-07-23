import { NextRequest, NextResponse } from 'next/server';
import { formatFormValue } from '@/lib/formatFormValue';
import { getRoofTypeLabel } from '@/lib/roofProducts';
import { signVisitorToken } from '@/lib/visitorToken';

const VISITOR_COOKIE = 'mmr_visitor';

export const maxDuration = 30;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_VISUALIZER;

function parseAddress(full: string) {
  const parts = full.split(', ');
  // "123 Main St, Dallas, TX 75201, USA"
  const stateZip = (parts[2] || '').split(' ');
  return {
    address1: parts[0] || '',
    city: parts[1] || '',
    state: stateZip[0] || '',
    postalCode: stateZip[1] || '',
  };
}

// Ported from the retired app/estimate/page.tsx's getLeadSource() — /visualizer
// is now the sole entry point for all traffic (ads, postcards, GBP, organic),
// not just visualizer-native leads, so this mapping has to live here instead.
//
// Checks both utm_source and utm_medium for the known channel values since
// campaign links aren't finalized yet and may end up populating either field
// depending on how they're eventually built (e.g. utm_source=postcard vs.
// utm_medium=postcard) — whichever field carries it, the mapping still works.
function getLeadSource(utmSource: string | undefined, utmMedium: string | undefined): string {
  const CHANNEL_MAP: Record<string, string> = {
    postcard: 'Direct Mailer',
    cpc: 'Google Ads',
    paid_social: 'Meta Ads',
    video: 'YouTube Ads',
    gbp: 'Google Business Profile',
  };
  if (utmSource && CHANNEL_MAP[utmSource]) return CHANNEL_MAP[utmSource];
  if (utmMedium && CHANNEL_MAP[utmMedium]) return CHANNEL_MAP[utmMedium];
  if (!utmSource && !utmMedium) return 'SEO Organic';
  return 'Other';
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
    const parsed = parseAddress(body.address || '');

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
        lead_source: getLeadSource(body.utm?.source, body.utm?.medium),
        property_address: body.address || '',
        estimated_roof_size: body.estimatedRoofSize != null
          ? String(Math.round(body.estimatedRoofSize * 10) / 10)
          : undefined,
        estimate_range: body.estimateRange || undefined,
        solar_failure_reason: body.solarFailureReason || undefined,
        roof_size_source: body.roofSizeSource || undefined,
      },
      utm: {
        source: body.utm?.source || '',
        medium: body.utm?.medium || '',
        campaign: body.utm?.campaign || '',
      },
      tags: body.insuranceClaim && body.insuranceClaim !== 'no_cash'
        ? ['Insurance Claim']
        : [],
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
