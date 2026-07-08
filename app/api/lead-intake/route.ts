import { NextRequest, NextResponse } from 'next/server';
import { formatFormValue } from '@/lib/formatFormValue';
import { getRoofTypeLabel } from '@/lib/roofProducts';

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
        lead_source: body.utm?.source || 'Organic',
        property_address: body.address || '',
        estimated_roof_size: body.estimatedRoofSize != null
          ? String(Math.round(body.estimatedRoofSize * 10) / 10)
          : undefined,
        estimate_range: body.estimateRange || undefined,
      },
      utm: {
        source: body.utm?.source || '',
        medium: body.utm?.medium || '',
        campaign: body.utm?.campaign || '',
      },
      tags: body.insuranceClaim && body.insuranceClaim !== 'Paying Out of Pocket'
        ? ['Insurance Claim']
        : [],
      source: 'visualizer',
      suppressAlert: body.suppressAlert === true,
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[lead-intake]', err);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
