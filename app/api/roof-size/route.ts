import { NextRequest, NextResponse } from 'next/server'
import pricingConfig from '@/config/pricing.json'

export const maxDuration = 30

type RoofTypeKey = keyof typeof pricingConfig.roofTypes

type RoofTypeConfig = {
  label: string
  retailPerSquare: number
  pitchAdjustment: boolean
  wasteFactor: number
  pitchSurchargePerLevel?: number
}

// Copied verbatim from app/api/estimate/route.ts — keep the two in sync.
function getPriceFingerprint(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 85) / 100 + 0.13
}

// Same math as calculateEstimate() in app/api/estimate/route.ts, but returns
// raw numbers instead of pre-formatted USD strings so formatDollars() below
// can do its own whole-dollar formatting.
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

  return { low, high }
}

function formatDollars(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

const EMPTY_RESULT = { squares: null, estimateLow: null, estimateHigh: null }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const address: string | undefined = body?.address
    const roofType: string | undefined = body?.roofType

    if (!address || !roofType || !(roofType in pricingConfig.roofTypes)) {
      return NextResponse.json(EMPTY_RESULT)
    }

    const config = pricingConfig.roofTypes[roofType as RoofTypeKey] as RoofTypeConfig

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const geoRes = await fetch(geocodeUrl)
    const geoData = await geoRes.json()

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      return NextResponse.json(EMPTY_RESULT)
    }

    const { lat, lng } = geoData.results[0].geometry.location

    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=LOW&key=${process.env.GOOGLE_SOLAR_API_KEY}`
    const solarRes = await fetch(solarUrl)
    const solarData = await solarRes.json()

    type Segment = { stats: { areaMeters2: number }; pitchDegrees?: number }
    const segments: Segment[] | undefined = solarData?.solarPotential?.roofSegmentStats

    if (!segments?.length) {
      return NextResponse.json(EMPTY_RESULT)
    }

    const totalAreaM2 = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0)
    const squares = (totalAreaM2 * 10.7639) / 100

    const largestSegment = segments.reduce((best, seg) =>
      seg.stats.areaMeters2 > best.stats.areaMeters2 ? seg : best
    )
    const pitchLevel = config.pitchAdjustment
      ? Math.round((largestSegment.pitchDegrees ?? 0) / 10)
      : 0

    const result = calculateEstimate(squares, config, pitchLevel, address)

    return NextResponse.json({
      squares: Math.round(squares * 10) / 10,
      estimateLow: formatDollars(result.low),
      estimateHigh: formatDollars(result.high),
    })
  } catch (err) {
    console.error('[roof-size]', err)
    return NextResponse.json(EMPTY_RESULT)
  }
}
