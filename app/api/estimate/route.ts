import { NextRequest, NextResponse } from 'next/server'
import pricingConfig from '@/config/pricing.json'
import { formatFormValue } from '@/lib/formatFormValue'

type RoofTypeKey = keyof typeof pricingConfig.roofTypes

type RoofTypeConfig = {
  label: string
  retailPerSquare: number
  pitchAdjustment: boolean
  wasteFactor: number
  pitchSurchargePerLevel?: number
}

function getPriceFingerprint(address: string): number {
  let hash = 0
  for (let i = 0; i < address.length; i++) {
    hash = ((hash << 5) - hash) + address.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 85) / 100 + 0.13
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function calculateEstimate(
  squares: number,
  config: RoofTypeConfig,
  pitchLevel: number,
  fingerprintSeed: string
) {
  let pricePerSquare = config.retailPerSquare
  if (config.pitchAdjustment && config.pitchSurchargePerLevel != null) {
    pricePerSquare += pitchLevel * config.pitchSurchargePerLevel
  }

  const adjustedSquares = squares * (1 + config.wasteFactor)
  const grandTotal = adjustedSquares * pricePerSquare

  const fingerprint = getPriceFingerprint(fingerprintSeed)
  const pointEstimate = Math.round(grandTotal) + fingerprint

  const low = pointEstimate * pricingConfig.estimateRange.lowMultiplier
  const high = pointEstimate * pricingConfig.estimateRange.highMultiplier

  return { low: formatUSD(low), high: formatUSD(high) }
}

async function fireN8nWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.N8N_WEBHOOK_ESTIMATE
  if (!url) { console.warn('[estimate] N8N_WEBHOOK_ESTIMATE not set'); return }
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[estimate] fireN8nWebhook failed:', err)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    roofType, address, manualSqFt, stories, reason, insuranceClaim, timeline,
    firstName, lastName, phone, email, leadOrigin,
    leadSource: leadSourceFromBody, utmSource, utmMedium, utmCampaign,
    productLabel,
  } = body
  // leadSource is computed upstream (app/estimate/page.tsx) from UTM params /
  // visualizer origin. Fall back to the old leadOrigin check if it's missing.
  const leadSource = leadSourceFromBody || (leadOrigin === 'visualizer' ? 'Visualizer' : 'Estimate Tool')

  if (!roofType || !(roofType in pricingConfig.roofTypes)) {
    return NextResponse.json({ success: false, error: 'Invalid roof type' }, { status: 400 })
  }

  const rt = roofType as RoofTypeKey
  const config = pricingConfig.roofTypes[rt] as RoofTypeConfig
  const roofTypeLabel = config.label
  const selectedRoofLabel = productLabel || roofTypeLabel

  // Manual fallback path
  if (manualSqFt != null) {
    const sqFt = Number(manualSqFt)
    let multiplier = 1.05
    if (stories === 'one') multiplier = 1.30
    else if (stories === 'two') multiplier = 0.80

    const squares = (sqFt * multiplier) / 100
    const estimate = calculateEstimate(squares, config, 0, `manual-${sqFt}`)

    await fireN8nWebhook({
      contact: {
        firstName,
        lastName,
        phone,
        email,
        address1: address,
      },
      fields: {
        lead_source: leadSource,
        property_address: address,
        estimated_roof_size: String(Math.round(squares)),
        estimate_range: `${estimate.low} - ${estimate.high}`,
        selected_roof_type: selectedRoofLabel,
        project_reason: formatFormValue('reason', reason),
        insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
        homeowner_timeline: formatFormValue('timeline', timeline),
      },
      utm: {
        source: utmSource || '',
        medium: utmMedium || '',
        campaign: utmCampaign || '',
      },
      tags: insuranceClaim && insuranceClaim !== 'Paying Out of Pocket'
        ? ['Insurance Claim']
        : [],
      source: 'estimate',
    })

    return NextResponse.json({
      success: true,
      roofType: roofTypeLabel,
      squares: Math.round(squares),
      solarSource: false,
      estimate,
    })
  }

  // Address-based path
  if (!address) {
    return NextResponse.json({ success: false, error: 'Address or manualSqFt required' }, { status: 400 })
  }

  try {
    // Geocode address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const geoRes = await fetch(geocodeUrl)
    const geoData = await geoRes.json()

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      console.error('[estimate] Geocoding failed:', geoData.status, address)
      await fireN8nWebhook({
        contact: { firstName, lastName, phone, email, address1: address },
        fields: {
          lead_source: leadSource,
          property_address: address,
          project_reason: formatFormValue('reason', reason),
          insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
          homeowner_timeline: formatFormValue('timeline', timeline),
        },
        utm: { source: utmSource || '', medium: utmMedium || '', campaign: utmCampaign || '' },
        tags: insuranceClaim && insuranceClaim !== 'Paying Out of Pocket' ? ['Insurance Claim'] : [],
        source: 'estimate',
        solarSuccess: false,
        solar_failure_reason: 'geocode_failed',
      })
      return NextResponse.json({ success: false, solarSuccess: false })
    }

    const { lat, lng } = geoData.results[0].geometry.location

    // Solar API
    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${process.env.GOOGLE_SOLAR_API_KEY}`
    const solarRes = await fetch(solarUrl)
    const solarData = await solarRes.json()

    if (!solarData.solarPotential?.roofSegmentStats?.length) {
      console.error('[estimate] No usable Solar API roof data for address:', address)
      await fireN8nWebhook({
        contact: { firstName, lastName, phone, email, address1: address },
        fields: {
          lead_source: leadSource,
          property_address: address,
          project_reason: formatFormValue('reason', reason),
          insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
          homeowner_timeline: formatFormValue('timeline', timeline),
        },
        utm: { source: utmSource || '', medium: utmMedium || '', campaign: utmCampaign || '' },
        tags: insuranceClaim && insuranceClaim !== 'Paying Out of Pocket' ? ['Insurance Claim'] : [],
        source: 'estimate',
        solarSuccess: false,
        solar_failure_reason: 'no_roof_data',
      })
      return NextResponse.json({ success: false, solarSuccess: false })
    }

    type Segment = { stats: { areaMeters2: number }; pitchDegrees?: number }
    const segments: Segment[] = solarData.solarPotential.roofSegmentStats

    const totalAreaM2 = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0)

    // Confidence check: must be between 800 and 8,000 sq ft
    if (totalAreaM2 < 74.3 || totalAreaM2 > 743) {
      console.error('[estimate] Roof area out of confidence range:', totalAreaM2, address)
      await fireN8nWebhook({
        contact: { firstName, lastName, phone, email, address1: address },
        fields: {
          lead_source: leadSource,
          property_address: address,
          project_reason: formatFormValue('reason', reason),
          insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
          homeowner_timeline: formatFormValue('timeline', timeline),
        },
        utm: { source: utmSource || '', medium: utmMedium || '', campaign: utmCampaign || '' },
        tags: insuranceClaim && insuranceClaim !== 'Paying Out of Pocket' ? ['Insurance Claim'] : [],
        source: 'estimate',
        solarSuccess: false,
        solar_failure_reason: 'area_out_of_range',
      })
      return NextResponse.json({ success: false, solarSuccess: false })
    }

    const squares = (totalAreaM2 * 10.7639) / 100

    const dominant = segments.reduce((best, seg) =>
      seg.stats.areaMeters2 > best.stats.areaMeters2 ? seg : best
    )
    const pitchDegrees = dominant.pitchDegrees ?? 0
    const pitchLevel = Math.max(0, Math.round(pitchDegrees / 4.76) - 7)

    const estimate = calculateEstimate(squares, config, pitchLevel, address)

    await fireN8nWebhook({
      contact: {
        firstName,
        lastName,
        phone,
        email,
        address1: address,
      },
      fields: {
        lead_source: leadSource,
        property_address: address,
        estimated_roof_size: String(Math.round(squares)),
        estimate_range: `${estimate.low} - ${estimate.high}`,
        selected_roof_type: selectedRoofLabel,
        project_reason: formatFormValue('reason', reason),
        insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
        homeowner_timeline: formatFormValue('timeline', timeline),
      },
      utm: {
        source: utmSource || '',
        medium: utmMedium || '',
        campaign: utmCampaign || '',
      },
      tags: insuranceClaim && insuranceClaim !== 'Paying Out of Pocket'
        ? ['Insurance Claim']
        : [],
      source: 'estimate',
    })

    return NextResponse.json({
      success: true,
      roofType: roofTypeLabel,
      squares: Math.round(squares),
      solarSource: true,
      estimate,
    })
  } catch (err) {
    console.error('Estimate error:', err)
    await fireN8nWebhook({
      contact: { firstName, lastName, phone, email, address1: address },
      fields: {
        lead_source: leadSource,
        property_address: address,
        project_reason: formatFormValue('reason', reason),
        insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
        homeowner_timeline: formatFormValue('timeline', timeline),
      },
      utm: { source: utmSource || '', medium: utmMedium || '', campaign: utmCampaign || '' },
      tags: insuranceClaim && insuranceClaim !== 'Paying Out of Pocket' ? ['Insurance Claim'] : [],
      source: 'estimate',
      solarSuccess: false,
      solar_failure_reason: 'exception',
    })
    return NextResponse.json({ success: false, solarSuccess: false })
  }
}
