import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_ESTIMATE;

// Forwards the estimate-tool lead payload to the n8n Lead Intake (Estimate Tool) workflow.
// Server-side only — never includes roof-type fields (current_roof_type, selected_roof_type,
// project_reason, insurance_claim_status, homeowner_timeline). Those are visualizer-only and
// must stay scoped out here so a resubmission can never overwrite them with null on GHL.
export async function POST(req: NextRequest) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.error('[estimate] N8N_WEBHOOK_ESTIMATE is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await req.json();

    const payload = {
      source: 'estimate',
      timestamp: new Date().toISOString(),
      contact: {
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        email: body.email || '',
        phone: body.phone || '',
        address1: body.address1 ?? body.address ?? '',
      },
      fields: {
        lead_source: 'Estimate Tool',
        property_address: body.address ?? body.address1 ?? '',
        estimated_roof_size: body.estimatedRoofSize ?? null,
        estimate_range: body.estimateRange ?? null,
      },
      tags: ['Estimate Tool'],
    };

    console.log('[estimate] forwarding payload to n8n:', payload);

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const n8nBody = await n8nRes.text();
    console.log('[estimate] n8n response status:', n8nRes.status, 'body:', n8nBody);

    if (!n8nRes.ok) {
      return NextResponse.json({ error: 'Lead intake workflow failed' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[estimate]', err);
    return NextResponse.json({ error: 'Failed to submit estimate lead' }, { status: 500 });
  }
}
