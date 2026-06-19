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

function utmCustomFields(utmSource?: string, utmMedium?: string, utmCampaign?: string) {
  const fields: { id: string; value: string }[] = []
  if (utmSource) fields.push({ id: 'NNZiielScQomx8VDF7q8', value: utmSource })
  if (utmMedium) fields.push({ id: 'ELW45zGCkwQkpUV2TnEW', value: utmMedium })
  if (utmCampaign) fields.push({ id: 'VrI3HZtaymdTdf0lggfD', value: utmCampaign })
  return fields
}

function fireGHLWebhook(payload: Record<string, unknown>): void {
  const url = process.env.GHL_ESTIMATE_WEBHOOK_URL
  console.log('GHL webhook payload (estimate):', JSON.stringify(payload, null, 2))
  if (!url) return
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(console.error)
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

    fireGHLWebhook({
      estimateRoofType: roofTypeLabel,
      estimateLow: estimate.low,
      estimateHigh: estimate.high,
      estimateSquares: Math.round(squares),
      estimateSource: 'manual',
      estimateTimestamp: new Date().toISOString(),
      firstName,
      lastName,
      phone,
      email,
      contact: {
        property_address: address,
        project_reason: formatFormValue('reason', reason),
        insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
        homeowner_timeline: formatFormValue('timeline', timeline),
        lead_source: leadSource,
        estimated_roof_size: Math.round(squares),
        estimate_range: `${estimate.low} - ${estimate.high}`,
      },
      customField: [
        { id: 'pOqyjdxOHg67C4JWdkaG', value: leadSource },
        { id: 'prLMUoMzKClcfmBzDH3R', value: formatFormValue('reason', reason) },
        { id: 'tpAq0AZMqWJZeTy3dPsS', value: formatFormValue('insuranceClaim', insuranceClaim) },
        { id: '7F3CKSSVRj7jdHKoq87X', value: formatFormValue('timeline', timeline) },
        { id: 'acFCeylcy8uhep3stymL', value: address },
        { id: 'S3E1cQMFQ2vD2Ec1nSAR', value: Math.round(squares) },
        { id: 'cEjn1x0nid6taqIaQxKt', value: `${estimate.low} - ${estimate.high}` },
        ...utmCustomFields(utmSource, utmMedium, utmCampaign),
        ...(selectedRoofLabel ? [{ id: 'ooxcklKOKGrDCRunZnh3', value: selectedRoofLabel }] : []),
      ],
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
      return NextResponse.json({ success: false, solarSuccess: false })
    }

    const { lat, lng } = geoData.results[0].geometry.location

    // Solar API
    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${process.env.GOOGLE_SOLAR_API_KEY}`
    const solarRes = await fetch(solarUrl)
    const solarData = await solarRes.json()

    if (!solarData.solarPotential?.roofSegmentStats?.length) {
      return NextResponse.json({ success: false, solarSuccess: false })
    }

    type Segment = { stats: { areaMeters2: number }; pitchDegrees?: number }
    const segments: Segment[] = solarData.solarPotential.roofSegmentStats

    const totalAreaM2 = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0)

    // Confidence check: must be between 800 and 8,000 sq ft
    if (totalAreaM2 < 74.3 || totalAreaM2 > 743) {
      return NextResponse.json({ success: false, solarSuccess: false })
    }

    const squares = (totalAreaM2 * 10.7639) / 100

    const dominant = segments.reduce((best, seg) =>
      seg.stats.areaMeters2 > best.stats.areaMeters2 ? seg : best
    )
    const pitchDegrees = dominant.pitchDegrees ?? 0
    const pitchLevel = Math.max(0, Math.round(pitchDegrees / 4.76) - 7)

    const estimate = calculateEstimate(squares, config, pitchLevel, address)

    fireGHLWebhook({
      estimateRoofType: roofTypeLabel,
      estimateLow: estimate.low,
      estimateHigh: estimate.high,
      estimateSquares: Math.round(squares),
      estimateSource: 'solar_api',
      estimateTimestamp: new Date().toISOString(),
      firstName,
      lastName,
      phone,
      email,
      contact: {
        property_address: address,
        project_reason: formatFormValue('reason', reason),
        insurance_claim_status: formatFormValue('insuranceClaim', insuranceClaim),
        homeowner_timeline: formatFormValue('timeline', timeline),
        lead_source: leadSource,
        estimated_roof_size: Math.round(squares),
        estimate_range: `${estimate.low} - ${estimate.high}`,
      },
      customField: [
        { id: 'pOqyjdxOHg67C4JWdkaG', value: leadSource },
        { id: 'prLMUoMzKClcfmBzDH3R', value: formatFormValue('reason', reason) },
        { id: 'tpAq0AZMqWJZeTy3dPsS', value: formatFormValue('insuranceClaim', insuranceClaim) },
        { id: '7F3CKSSVRj7jdHKoq87X', value: formatFormValue('timeline', timeline) },
        { id: 'acFCeylcy8uhep3stymL', value: address },
        { id: 'S3E1cQMFQ2vD2Ec1nSAR', value: Math.round(squares) },
        { id: 'cEjn1x0nid6taqIaQxKt', value: `${estimate.low} - ${estimate.high}` },
        ...utmCustomFields(utmSource, utmMedium, utmCampaign),
        ...(selectedRoofLabel ? [{ id: 'ooxcklKOKGrDCRunZnh3', value: selectedRoofLabel }] : []),
      ],
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
    return NextResponse.json({ success: false, solarSuccess: false })
  }
}
