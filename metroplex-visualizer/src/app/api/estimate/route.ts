import { NextRequest, NextResponse } from 'next/server';
import pricingConfig from '../../../../config/pricing.json';

export const maxDuration = 30;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_ESTIMATE;

type RoofTypeKey = keyof typeof pricingConfig.roofTypes;

type RoofTypeConfig = {
  label: string;
  retailPerSquare: number;
  pitchAdjustment: boolean;
  wasteFactor: number;
  pitchSurchargePerLevel?: number;
};

// Ported from app/api/estimate/route.ts (root app) — keep formula in sync with that file.
function getPriceFingerprint(address: string): number {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = ((hash << 5) - hash) + address.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 85) / 100 + 0.13;
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateEstimate(
  squares: number,
  config: RoofTypeConfig,
  pitchLevel: number,
  fingerprintSeed: string
) {
  let pricePerSquare = config.retailPerSquare;
  if (config.pitchAdjustment && config.pitchSurchargePerLevel != null) {
    pricePerSquare += pitchLevel * config.pitchSurchargePerLevel;
  }

  const adjustedSquares = squares * (1 + config.wasteFactor);
  const grandTotal = adjustedSquares * pricePerSquare;

  const fingerprint = getPriceFingerprint(fingerprintSeed);
  const pointEstimate = Math.round(grandTotal) + fingerprint;

  const low = pointEstimate * pricingConfig.estimateRange.lowMultiplier;
  const high = pointEstimate * pricingConfig.estimateRange.highMultiplier;

  return { low: formatUSD(low), high: formatUSD(high) };
}

// Forwards the estimate-tool lead + computed price range to the n8n Lead
// Intake (Estimate Tool) workflow. Never includes roof-type fields
// (current_roof_type, selected_roof_type, project_reason,
// insurance_claim_status, homeowner_timeline) — those are visualizer-only
// and must stay scoped out here so a resubmission can never overwrite them
// with null on GHL. Non-blocking: a webhook failure must not hide an
// already-computed estimate from the user.
async function postToN8n(payload: Record<string, unknown>): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    console.error('[estimate] N8N_WEBHOOK_ESTIMATE is not set');
    return;
  }
  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[estimate] n8n webhook failed (non-blocking):', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, roofType } = body;
    const fullAddress: string = body.address1 ?? body.address ?? '';

    if (!fullAddress) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    if (!roofType || !(roofType in pricingConfig.roofTypes)) {
      return NextResponse.json({ error: 'Invalid roof type' }, { status: 400 });
    }

    const config = pricingConfig.roofTypes[roofType as RoofTypeKey] as RoofTypeConfig;

    // Manual sqft bypass — skips Solar API entirely
    if (body.manualSqFt && typeof body.manualSqFt === 'number' && body.manualSqFt > 0) {
      const squares = body.manualSqFt / 100;
      const estimate = calculateEstimate(squares, config, 0, fullAddress);
      const estimatedRoofSize = Math.round(squares);
      const estimateRange = `${estimate.low} - ${estimate.high}`;

      await postToN8n({
        source: 'estimate',
        timestamp: new Date().toISOString(),
        contact: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          phone: phone || '',
          address1: fullAddress,
        },
        fields: {
          lead_source: 'Estimate Tool',
          property_address: fullAddress,
          estimated_roof_size: estimatedRoofSize,
          estimate_range: estimateRange,
        },
        tags: ['Estimate Tool'],
      });

      return NextResponse.json({ success: true, estimatedRoofSize, estimateRange });
    }

    // Geocode address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const geoRes = await fetch(geocodeUrl);
    if (!geoRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Could not locate address' },
        { status: 422 }
      );
    }
    const geoData = await geoRes.json();

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      await postToN8n({
        source: 'estimate',
        timestamp: new Date().toISOString(),
        contact: { firstName: firstName || '', lastName: lastName || '', email: email || '', phone: phone || '', address1: fullAddress },
        fields: { lead_source: 'Estimate Tool', property_address: fullAddress },
        tags: ['Estimate Tool'],
      });
      return NextResponse.json({ success: false, error: 'Could not locate address' }, { status: 422 });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // Solar API
    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${process.env.GOOGLE_SOLAR_API_KEY}`;
    const solarRes = await fetch(solarUrl);
    if (!solarRes.ok) {
      const errText = await solarRes.text();
      console.error('[estimate] Solar API error:', solarRes.status, errText);
      return NextResponse.json(
        { success: false, error: 'No roof data available for this address' },
        { status: 422 }
      );
    }
    const solarData = await solarRes.json();

    if (!solarData.solarPotential?.roofSegmentStats?.length) {
      await postToN8n({
        source: 'estimate',
        timestamp: new Date().toISOString(),
        contact: { firstName: firstName || '', lastName: lastName || '', email: email || '', phone: phone || '', address1: fullAddress },
        fields: { lead_source: 'Estimate Tool', property_address: fullAddress },
        tags: ['Estimate Tool'],
      });
      return NextResponse.json({ success: false, error: 'No roof data available for this address' }, { status: 422 });
    }

    type Segment = { stats: { areaMeters2: number }; pitchDegrees?: number };
    const segments: Segment[] = solarData.solarPotential.roofSegmentStats;

    const totalAreaM2 = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0);

    // Confidence check: must be between 800 and 8,000 sq ft
    if (totalAreaM2 < 74.3 || totalAreaM2 > 743) {
      await postToN8n({
        source: 'estimate',
        timestamp: new Date().toISOString(),
        contact: { firstName: firstName || '', lastName: lastName || '', email: email || '', phone: phone || '', address1: fullAddress },
        fields: { lead_source: 'Estimate Tool', property_address: fullAddress },
        tags: ['Estimate Tool'],
      });
      return NextResponse.json({ success: false, error: 'Roof size out of supported range' }, { status: 422 });
    }

    const squares = (totalAreaM2 * 10.7639) / 100;

    const dominant = segments.reduce((best, seg) =>
      seg.stats.areaMeters2 > best.stats.areaMeters2 ? seg : best
    );
    const pitchDegrees = dominant.pitchDegrees ?? 0;
    const pitchLevel = Math.max(0, Math.round(pitchDegrees / 4.76) - 7);

    const estimate = calculateEstimate(squares, config, pitchLevel, fullAddress);
    const estimatedRoofSize = Math.round(squares);
    const estimateRange = `${estimate.low} - ${estimate.high}`;

    await postToN8n({
      source: 'estimate',
      timestamp: new Date().toISOString(),
      contact: {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phone: phone || '',
        address1: fullAddress,
      },
      fields: {
        lead_source: 'Estimate Tool',
        property_address: fullAddress,
        estimated_roof_size: estimatedRoofSize,
        estimate_range: estimateRange,
      },
      tags: ['Estimate Tool'],
    });

    return NextResponse.json({ success: true, estimatedRoofSize, estimateRange });
  } catch (err) {
    console.error('[estimate]', err);
    return NextResponse.json({ success: false, error: 'Failed to submit estimate lead' }, { status: 500 });
  }
}
