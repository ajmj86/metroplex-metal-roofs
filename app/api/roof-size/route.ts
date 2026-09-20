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

// Google Solar API's per-segment area sum doesn't track professional aerial
// measurement (RoofScope/EagleView) in a consistent direction -- confirmed
// 2026-09-20 against two real paired reports:
//   - 3808 Marquette St, Dallas (RoofScope): Solar raw 38.44 sq vs truth
//     31.20 sq (+23.2%, overestimate). 14 Solar segments vs 10 real planes --
//     mature tree canopy over the roof splits real planes into noisy
//     fragments, and boundary/edge over-measurement accumulates with segment
//     count.
//   - 7902 Hanover St, Dallas (EagleView): Solar raw 40.06 sq vs truth
//     42.24 sq (-5.2%, UNDERestimate). 11 Solar segments vs 19 real facets --
//     Solar merged/missed a real 112.7 sq ft flat (0/12 pitch) facet
//     entirely, unrelated to tree cover.
// The two errors have opposite signs, so segment count alone does not
// predict over- vs under-estimation (the previous formula assumed more
// segments always meant more inflation to discount, which made the Hanover
// estimate worse -- -18.5% -- than doing nothing at all). With only two
// data points of opposite sign, a segment-count-aware curve is curve-fitting
// noise, not signal.
//
// AREA_CORRECTION_FACTOR = 0.917 is a flat, minimax-optimal multiplier: the
// value that makes both properties' corrected error equal and opposite
// (+13.0% / -13.0%), which bounds worst-case error tighter than either the
// raw Solar output (23.2% worst case) or the old segment-scaled formula
// (18.5% worst case, and in the wrong direction on non-calibration data).
// This is a stopgap, not a validated model -- retune (and consider a real
// runtime-observable feature, e.g. fraction of segment area in small/<150
// sq ft segments) once 3-5+ more paired reports exist, ideally spanning a
// simple untreed roof, a roof with a flat/porch section, and another
// tree-heavy roof.
const AREA_CORRECTION_FACTOR = pricingConfig.roofSizeCalibration.areaCorrectionFactor

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
    const totalAreaM2 = rawAreaM2 * AREA_CORRECTION_FACTOR

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
