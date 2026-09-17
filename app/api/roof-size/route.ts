import { NextRequest, NextResponse } from 'next/server'
import pricingConfig from '@/config/pricing.json'

export const maxDuration = 30

type RoofTypeKey = keyof typeof pricingConfig.roofTypes

type RoofTypeConfig = {
  label: string
  retailPerSquare?: number
  retailPerSquareMetallic?: number
  retailPerSquareStandard?: number
  metallicColors?: string[]
  noPriceEstimate?: boolean
  wasteFactor: number
}

// Google Solar API's per-segment areas run systematically higher than
// professional aerial measurement (RoofScope/EagleView) -- confirmed
// 2026-09-17 against a real RoofScope report for 3808 Marquette St., Dallas:
// Solar API's raw sum (38.44 sq, reproduced exactly from live segment data)
// vs RoofScope's surveyed 31.20 sq for the same roof (ratio 0.8117).
//
// The inflation is NOT concentrated in a few detectable "duplicate"
// segments that could be found and discarded -- checked directly: even
// where a real RoofScope plane (847 sq ft) lines up almost exactly with two
// adjacent Solar segments (603.6 + 254.3 = 857.9 sq ft, both ~22-23 degree
// pitch), the combined pair is barely bigger than the single real plane
// (+1.3%). So splitting one real plane into two Solar segments is close to
// area-neutral on its own -- the actual ~23% gap must be small
// edge/eave-boundary over-measurement spread across essentially every
// segment (each segment's boundary is measured slightly larger than the
// real roof edge), not a handful of phantom facets. That means more
// segments -> more total edge boundary -> more accumulated inflation, so
// the correction is scaled by segment count rather than applied as one
// flat discount to every roof regardless of complexity (a simple few-facet
// roof has little edge boundary to inflate and shouldn't take the same hit
// as this address's fragmented 14-segment case).
//
// This is a single-address calibration, not an independently validated
// curve: baselineSegmentCount/perSegmentDiscount are chosen so the curve
// passes through 1.0 at a minimal-complexity roof and lands on the one
// real measured ratio (0.8117) at this address's 14 segments; the floor
// (minAreaCorrectionFactor) keeps hypothetically-more-fragmented roofs from
// extrapolating past what's actually been observed. Retune all three in
// config/pricing.json once more paired RoofScope comparisons exist,
// ideally spanning a range of segment counts, not just complex ones.
function solarAreaCorrectionFactor(segmentCount: number): number {
  const { baselineSegmentCount, perSegmentDiscount, minAreaCorrectionFactor } = pricingConfig.roofSizeCalibration
  const excessSegments = Math.max(0, segmentCount - baselineSegmentCount)
  const factor = 1 - excessSegments * perSegmentDiscount
  return Math.max(minAreaCorrectionFactor, factor)
}

// Standing Seam prices by metallicColors membership (e.g. "Natural Metal");
// every other roof type has a single flat retailPerSquare.
function resolveRetailPerSquare(config: RoofTypeConfig, color?: string): number {
  if (config.retailPerSquareMetallic != null && config.retailPerSquareStandard != null) {
    const isMetallic = !!color && (config.metallicColors ?? []).includes(color)
    return isMetallic ? config.retailPerSquareMetallic : config.retailPerSquareStandard
  }
  return config.retailPerSquare ?? 0
}

// Returns raw numbers instead of pre-formatted USD strings so formatDollars()
// below can do its own whole-dollar formatting. Low end is the material's
// configured rate times roof size adjusted for waste (offcuts/overlap
// material a real job needs beyond the bare roof area); high end adds the
// configured margin on top (pricingConfig.estimateRange.highMultiplier,
// currently 10%).
function calculateEstimate(squares: number, config: RoofTypeConfig, color: string | undefined) {
  const pricePerSquare = resolveRetailPerSquare(config, color)
  const adjustedSquares = squares * (1 + config.wasteFactor)
  const low = pricePerSquare * adjustedSquares
  const high = low * pricingConfig.estimateRange.highMultiplier

  return { low, high }
}

function formatDollars(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

// Roof types like Copper have no price estimate at all (tariffs/material
// shortages) — callers get estimateMessage instead of estimateLow/estimateHigh,
// never a $0 or blank range.
function buildPriceFields(squares: number, config: RoofTypeConfig, color: string | undefined) {
  if (config.noPriceEstimate) {
    return {
      estimateLow: null,
      estimateHigh: null,
      noPriceEstimate: true as const,
      estimateMessage: pricingConfig.noPriceEstimateMessage,
    }
  }
  const result = calculateEstimate(squares, config, color)
  return {
    estimateLow: formatDollars(result.low),
    estimateHigh: formatDollars(result.high),
    noPriceEstimate: false as const,
    estimateMessage: null,
  }
}

type SolarFailureReason = 'geocode_failed' | 'no_roof_data' | 'area_out_of_range' | 'exception'

function emptyResult(solarFailureReason?: SolarFailureReason) {
  return {
    squares: null,
    estimateLow: null,
    estimateHigh: null,
    noPriceEstimate: false,
    estimateMessage: null,
    solarFailureReason: solarFailureReason ?? null,
  }
}

// Manual fallback: same story-count-to-footprint heuristic as the old
// (deleted) /api/estimate route — a one-story home's roof is close to its
// full living-space footprint (no stacking), a two-story home's footprint
// is roughly half its living space, "not sure" splits the difference.
function squaresFromManualSqFt(sqFt: number, stories: string | undefined): number {
  let multiplier = 1.05
  if (stories === 'one') multiplier = 1.30
  else if (stories === 'two') multiplier = 0.80
  return (sqFt * multiplier) / 100
}

export async function POST(req: NextRequest) {
  let address: string | undefined
  try {
    const body = await req.json()
    address = body?.address
    const roofType: string | undefined = body?.roofType
    const color: string | undefined = body?.color
    const manualSqFt: number | undefined = body?.manualSqFt != null ? Number(body.manualSqFt) : undefined
    const stories: string | undefined = body?.stories

    if (!roofType || !(roofType in pricingConfig.roofTypes)) {
      return NextResponse.json(emptyResult())
    }

    const config = pricingConfig.roofTypes[roofType as RoofTypeKey] as RoofTypeConfig

    // Manual fallback path — bypasses geocode/Solar entirely. Uses the same
    // buildPriceFields() and live config/pricing.json as the Solar path, so
    // pricing always stays in sync between the two; only the squares input
    // differs.
    if (manualSqFt != null && !Number.isNaN(manualSqFt) && manualSqFt > 0) {
      const squares = squaresFromManualSqFt(manualSqFt, stories)
      const priceFields = buildPriceFields(squares, config, color)
      return NextResponse.json({
        squares: Math.round(squares * 10) / 10,
        ...priceFields,
        solarFailureReason: null,
      })
    }

    if (!address) {
      return NextResponse.json(emptyResult())
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const geoRes = await fetch(geocodeUrl)
    const geoData = await geoRes.json()

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      console.error('[roof-size] Geocoding failed:', geoData.status, geoData.error_message, address)
      return NextResponse.json(emptyResult('geocode_failed'))
    }

    const { lat, lng } = geoData.results[0].geometry.location

    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${process.env.GOOGLE_SOLAR_API_KEY}`
    const solarRes = await fetch(solarUrl)
    const solarData = await solarRes.json()

    type Segment = { stats: { areaMeters2: number } }
    const segments: Segment[] | undefined = solarData?.solarPotential?.roofSegmentStats

    if (!segments?.length) {
      console.error('[roof-size] No usable Solar API roof data:', address, `(${lat}, ${lng})`)
      return NextResponse.json(emptyResult('no_roof_data'))
    }

    const rawAreaM2 = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0)
    const totalAreaM2 = rawAreaM2 * solarAreaCorrectionFactor(segments.length)

    // Confidence check: must be between 800 and 8,000 sq ft
    if (totalAreaM2 < 74.3 || totalAreaM2 > 743) {
      console.error('[roof-size] Roof area out of confidence range:', totalAreaM2, 'sqm for', address, `(${lat}, ${lng})`)
      return NextResponse.json(emptyResult('area_out_of_range'))
    }

    const squares = (totalAreaM2 * 10.7639) / 100

    const priceFields = buildPriceFields(squares, config, color)

    return NextResponse.json({
      squares: Math.round(squares * 10) / 10,
      ...priceFields,
      solarFailureReason: null,
    })
  } catch (err) {
    console.error('[roof-size] Exception for', address, ':', err)
    return NextResponse.json(emptyResult('exception'))
  }
}
