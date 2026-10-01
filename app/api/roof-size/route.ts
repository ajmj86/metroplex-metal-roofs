import { NextRequest, NextResponse } from 'next/server'
import pricingConfig from '@/config/pricing.json'
import { computeEstimate, isAreaInRange, resolveMaterialConfig, squaresFromManualSqFt, type PricedConfig } from '@/lib/estimate'

export const maxDuration = 30

const roofTypes = pricingConfig.roofTypes as Record<string, PricedConfig>

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

// Roof complexity scoring -- reuses the same `segments` array pulled for the
// area correction above (no second Solar API call). As of the low/high
// waste-multiplier pricing change this score NO LONGER AFFECTS PRICE (price
// comes from config/pricing.json wasteLow/wasteHigh via lib/estimate.ts); it
// is still computed and logged for analytics only.
//
// Density: segments per CORRECTED square (post area-correction, not raw --
// stays on the same "believed" roof size as the rest of the pipeline).
// 0.10 seg/sq anchors complexity 0 (a simple ~4-segment hip roof on a
// ~30-sq home); 0.50 seg/sq anchors complexity 1 (heavy fragmentation).
//
// Pitch variance: population stdev of segment pitchDegrees. 0 degrees
// anchors complexity 0 (one uniform pitch); 8 degrees anchors complexity 1
// (multiple genuinely distinct pitch bands -- porches, accent pitches,
// dormers). Deliberately independent of segment count: confirmed
// 2026-09-20 against 7902 Hanover St (EagleView ground truth) that a roof
// with fewer, larger segments can still carry real multi-pitch complexity
// (a flat porch + main + steeper accent section) that density alone misses.
//
// Small-segment fraction: share of total area held in segments under 150
// sq ft, GATED by densityNorm. This is the same fragmentation signal that
// flagged tree-driven DSM noise vs. genuine complexity in the
// Marquette/Hanover area-correction analysis -- it's noise-prone on its
// own, so it only contributes once segment density is already elevated
// rather than acting as a standalone complexity driver.
//
// Weights (0.5 / 0.3 / 0.2) and both sets of anchors are reasoned defaults,
// not fit to Marquette/Hanover -- neither property's score lands at 0 or 1,
// which is a sanity check, not validation. There's no ground-truth
// waste-used data the way RoofScope/EagleView gave ground truth for area,
// so revisit once real material-order-vs-estimate data exists.
const COMPLEXITY_DENSITY_LO = 0.10 // segments per corrected square
const COMPLEXITY_DENSITY_HI = 0.50
const COMPLEXITY_PITCH_STDEV_LO = 0 // degrees
const COMPLEXITY_PITCH_STDEV_HI = 8
const COMPLEXITY_SMALL_SEGMENT_SQFT = 150
const COMPLEXITY_WEIGHTS = { density: 0.5, pitch: 0.3, smallFrac: 0.2 }

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

function roofComplexityScore(
  segments: { stats: { areaMeters2: number }; pitchDegrees: number }[],
  correctedSquares: number
): number {
  const density = segments.length / correctedSquares
  const densityNorm = clamp01((density - COMPLEXITY_DENSITY_LO) / (COMPLEXITY_DENSITY_HI - COMPLEXITY_DENSITY_LO))

  const pitches = segments.map((s) => s.pitchDegrees)
  const meanPitch = pitches.reduce((sum, p) => sum + p, 0) / pitches.length
  const pitchStdev = Math.sqrt(pitches.reduce((sum, p) => sum + (p - meanPitch) ** 2, 0) / pitches.length)
  const pitchNorm = clamp01((pitchStdev - COMPLEXITY_PITCH_STDEV_LO) / (COMPLEXITY_PITCH_STDEV_HI - COMPLEXITY_PITCH_STDEV_LO))

  const totalAreaM2 = segments.reduce((sum, s) => sum + s.stats.areaMeters2, 0)
  const smallAreaM2 = segments
    .filter((s) => s.stats.areaMeters2 * 10.7639 < COMPLEXITY_SMALL_SEGMENT_SQFT)
    .reduce((sum, s) => sum + s.stats.areaMeters2, 0)
  const smallFracGated = (smallAreaM2 / totalAreaM2) * densityNorm

  return clamp01(
    COMPLEXITY_WEIGHTS.density * densityNorm +
      COMPLEXITY_WEIGHTS.pitch * pitchNorm +
      COMPLEXITY_WEIGHTS.smallFrac * smallFracGated
  )
}

function formatDollars(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

// Roof types like Copper have no price estimate at all (tariffs/material
// shortages) — callers get estimateMessage instead of estimateLow/estimateHigh,
// never a $0 or blank range. An unknown/unpriceable material also returns
// empty low/high (never NaN/undefined strings).
function buildPriceFields(netSquares: number, roofType: string, color: string | undefined, style: string | undefined) {
  const result = computeEstimate(roofTypes, netSquares, roofType, color, style)
  if (!result.priced) {
    const noEstimate = result.reason === 'no_estimate'
    return {
      estimateLow: null,
      estimateHigh: null,
      noPriceEstimate: noEstimate as boolean,
      estimateMessage: noEstimate ? pricingConfig.noPriceEstimateMessage : null,
    }
  }
  return {
    estimateLow: formatDollars(result.low),
    estimateHigh: formatDollars(result.high),
    noPriceEstimate: false as boolean,
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

export async function POST(req: NextRequest) {
  let address: string | undefined
  try {
    const body = await req.json()
    address = body?.address
    const roofType: string | undefined = body?.roofType
    const color: string | undefined = body?.color
    const manualSqFt: number | undefined = body?.manualSqFt != null ? Number(body.manualSqFt) : undefined
    const stories: string | undefined = body?.stories
    const style: string | undefined = typeof body?.style === 'string' ? body.style : undefined

    if (!roofType || !resolveMaterialConfig(roofTypes, roofType, style)) {
      return NextResponse.json(emptyResult())
    }

    // Manual fallback path — bypasses geocode/Solar entirely. Uses the same
    // buildPriceFields() and live config/pricing.json as the Solar path, so
    // pricing always stays in sync between the two; only the squares input
    // differs.
    if (manualSqFt != null && !Number.isNaN(manualSqFt) && manualSqFt > 0) {
      const squares = squaresFromManualSqFt(manualSqFt, stories)
      const priceFields = buildPriceFields(squares, roofType, color, style)
      return NextResponse.json({
        squares: Math.round(squares * 10) / 10,
        netSquares: squares,
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

    type Segment = { stats: { areaMeters2: number }; pitchDegrees: number }
    const segments: Segment[] | undefined = solarData?.solarPotential?.roofSegmentStats

    if (!segments?.length) {
      console.error('[roof-size] No usable Solar API roof data:', address, `(${lat}, ${lng})`)
      return NextResponse.json(emptyResult('no_roof_data'))
    }

    const rawAreaM2 = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0)
    const totalAreaM2 = rawAreaM2 * AREA_CORRECTION_FACTOR

    // Confidence check: must be between 800 and 8,000 sq ft
    if (!isAreaInRange(totalAreaM2)) {
      console.error('[roof-size] Roof area out of confidence range:', totalAreaM2, 'sqm for', address, `(${lat}, ${lng})`)
      return NextResponse.json(emptyResult('area_out_of_range'))
    }

    const squares = (totalAreaM2 * 10.7639) / 100

    // Analytics/logging only -- does not feed pricing (see comment above).
    const complexityScore = roofComplexityScore(segments, squares)
    console.log('[roof-size] complexity', { roofType, style, squares: Math.round(squares * 10) / 10, complexityScore: Math.round(complexityScore * 1000) / 1000 })
    const priceFields = buildPriceFields(squares, roofType, color, style)

    return NextResponse.json({
      squares: Math.round(squares * 10) / 10,
      // Unrounded net squares: the lead path recomputes its own price from this
      // (server-side) so the opportunity value matches the displayed range.
      netSquares: squares,
      ...priceFields,
      solarFailureReason: null,
    })
  } catch (err) {
    console.error('[roof-size] Exception for', address, ':', err)
    return NextResponse.json(emptyResult('exception'))
  }
}
