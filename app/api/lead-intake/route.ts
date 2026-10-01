import { NextRequest, NextResponse } from 'next/server';
import { formatFormValue } from '@/lib/formatFormValue';
import { getProductLabel, getProductStyle, getRoofTypeLabel } from '@/lib/roofProducts';
import pricingConfig from '@/config/pricing.json';
import { estimateForLead, type PricedConfig } from '@/lib/estimate';
import { signVisitorToken } from '@/lib/visitorToken';
import { alertAndrew } from '@/lib/alerts';

const VISITOR_COOKIE = 'mmr_visitor';

// Two attempts x N8N_TIMEOUT_MS plus the fallback alert must fit in this.
export const maxDuration = 45;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_VISUALIZER;

// A full lead normally round-trips n8n in ~3-8s. Anything past this is treated
// as a failed attempt rather than letting the visitor stare at a spinner.
const N8N_TIMEOUT_MS = 15_000;
const N8N_RETRY_DELAY_MS = 1_500;

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

type N8nOutcome =
  | { ok: true; status: number; body: string; json: { contactId?: string } | null }
  | { ok: false; retryable: boolean; reason: string; status: number | null; body: string };

// One POST to the n8n lead webhook, classified. n8n answers a failed lead with
// a non-2xx {ok:false,...}, but older/other failure modes (workflow crashed
// before responding) come back as HTTP 200 with an EMPTY body -- that used to
// be indistinguishable from success here, which is how leads vanished.
async function postToN8n(payload: unknown, partial: boolean): Promise<N8nOutcome> {
  let res: Response;
  try {
    res = await fetch(N8N_WEBHOOK_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
    });
  } catch (err) {
    return { ok: false, retryable: true, reason: `network error/timeout: ${err instanceof Error ? err.message : String(err)}`, status: null, body: '' };
  }
  const body = await res.text();
  if (!res.ok) {
    return { ok: false, retryable: res.status >= 500, reason: `n8n returned HTTP ${res.status}`, status: res.status, body };
  }
  let json: { ok?: boolean; contactId?: string } | null = null;
  try { json = body ? JSON.parse(body) : null; } catch { json = null; }
  if (partial) return { ok: true, status: res.status, body, json };
  if (!json) return { ok: false, retryable: true, reason: 'n8n returned an empty or unparseable body', status: res.status, body };
  if (json.ok === false) return { ok: false, retryable: false, reason: 'n8n reported ok:false', status: res.status, body };
  if (!json.contactId || typeof json.contactId !== 'string') return { ok: false, retryable: true, reason: 'n8n response has no contactId', status: res.status, body };
  return { ok: true, status: res.status, body, json };
}

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

function selectedRoofTypeLabel(roofType: string, product?: string | null): string {
  const base = getRoofTypeLabel(roofType);
  if (roofType !== 'synthetic_slate' || !product) return base;
  const productLabel = getProductLabel(roofType, product);
  return productLabel ? `${base} – ${productLabel}` : base;
}

function leadEstimateFields(body: Record<string, unknown>) {
  const roofType = typeof body.selectedRoofType === 'string' ? body.selectedRoofType : undefined;
  const product = typeof body.product === 'string' ? body.product : undefined;
  const est = estimateForLead(pricingConfig.roofTypes as Record<string, PricedConfig>, {
    roofType,
    style: roofType && product ? getProductStyle(roofType, product) : null,
    color: typeof body.color === 'string' ? body.color : undefined,
    netSquares: typeof body.netSquares === 'number' ? body.netSquares : null,
    manualSqFt: typeof body.manualSqFt === 'number' ? body.manualSqFt : null,
    stories: typeof body.stories === 'string' ? body.stories : undefined,
    roofSizeSource: typeof body.roofSizeSource === 'string' ? body.roofSizeSource : undefined,
  });
  return {
    estimateStatus: est.status,
    estimateLow: est.status === 'priced' ? est.low : null,
    estimateHigh: est.status === 'priced' ? est.high : null,
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
    const isPartial = body.partial === true;
    const parsed = parseAddress(body.address || '', body.addressComponents);

    // Partial (abandonment) captures are whitelisted rather than forwarded raw:
    // they come from a sendBeacon with no validation, and n8n treats any
    // contact info on them as best-effort only (never overwrites a full lead).
    const payload = isPartial ? {
      partial: true,
      leadOrigin: 'visualizer_partial',
      address: str(body.address, 300),
      roofType: str(body.roofType, 60) || null,
      colorSelected: str(body.colorSelected, 60) || null,
      timestamp: str(body.timestamp, 40),
      firstName: str(body.firstName, 60),
      lastName: str(body.lastName, 60),
      email: str(body.email, 120),
      phone: str(body.phone, 30),
      utm: {
        source: str(body.utm?.source), medium: str(body.utm?.medium), campaign: str(body.utm?.campaign),
        content: str(body.utm?.content), term: str(body.utm?.term),
      },
    } : {
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
        // Synthetic slate prices differ per Brava profile (slate / shake /
        // Spanish barrel), so the GHL field + alert carry the profile too.
        selected_roof_type: body.selectedRoofType ? selectedRoofTypeLabel(body.selectedRoofType, body.product) : '',
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
        term: body.utm?.term || '',
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
      // Recomputed server-side (lib/estimate.ts) from the roof size + material
      // this lead carries -- never a browser-supplied price. n8n sets the GHL
      // opportunity value from estimateLow and prints the range in the alert.
      // status: priced | none (copper -> "custom quote") | unavailable (omit).
      ...leadEstimateFields(body),
      // Returning contact submitting a NEW property: n8n must not overwrite the
      // old property's opportunity value; /api/create-opportunity values the new one.
      newPropertyOpportunity: body.newPropertyOpportunity === true,
      source: 'visualizer',
      suppressAlert: body.suppressAlert === true,
      smsConsent: body.smsConsent === true,
    };

    console.log('[lead-intake] forwarding payload to n8n:', payload);

    let outcome = await postToN8n(payload, isPartial);
    if (!outcome.ok && outcome.retryable) {
      console.warn('[lead-intake] n8n attempt 1 failed, retrying once:', outcome.reason, outcome.status, outcome.body.slice(0, 300));
      await new Promise((r) => setTimeout(r, N8N_RETRY_DELAY_MS));
      outcome = await postToN8n(payload, isPartial);
    }

    if (!outcome.ok) {
      console.error('[lead-intake] FAILED', {
        reason: outcome.reason, status: outcome.status, n8nBody: outcome.body.slice(0, 500),
        partial: isPartial, leadOrigin: body.leadOrigin ?? null,
      });
      // A partial is best-effort. A full lead that didn't reach GHL is a
      // customer who believes they're in the system: tell Andrew immediately,
      // with enough detail to call them back.
      if (!isPartial) {
        const c = (payload as { contact: { firstName: string; lastName: string; phone: string; email: string } }).contact;
        const f = (payload as { fields: { property_address?: string; selected_roof_type?: string } }).fields;
        await alertAndrew(
          `🚨 LEAD NOT SAVED — visualizer could not reach the CRM (${outcome.reason}). Call/text them back: ` +
          `${c.firstName} ${c.lastName} · ${c.phone} · ${c.email} · ${f.property_address || 'no address'} · ${f.selected_roof_type || 'no roof choice'}`
        );
      }
      return NextResponse.json({ ok: false, error: 'Lead intake failed' }, { status: 502 });
    }

    const res = NextResponse.json({ ok: true, success: true });

    // Issue the returning-visitor cookie on real (non-partial) submissions only.
    // outcome.json.contactId is guaranteed for non-partial by postToN8n.
    if (!isPartial && outcome.json?.contactId) {
      res.cookies.set(VISITOR_COOKIE, signVisitorToken(outcome.json.contactId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 180,
        path: '/',
      });
    }

    return res;
  } catch (err) {
    console.error('[lead-intake]', err);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
