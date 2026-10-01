import { NextRequest, NextResponse } from 'next/server'
import { verifyVisitorToken } from '@/lib/visitorToken'
import { refreshOpportunityValue } from '@/lib/ghl'
import { estimateForLead, type PricedConfig } from '@/lib/estimate'
import { getProductStyle } from '@/lib/roofProducts'
import pricingConfig from '@/config/pricing.json'

export const maxDuration = 15

const VISITOR_COOKIE = 'mmr_visitor'

// Case A returning visitor (recognized, same address): the visualizer never
// re-submits a lead for them, so this is the only place a changed estimate
// (e.g. a different material this time) reaches the existing opportunity.
// The contact comes from the signed visitor cookie, never the request body, and
// the price is recomputed here from the roof size + material -- never trusted
// from the browser. Always 200: best-effort, must not affect the visualizer.
export async function POST(req: NextRequest) {
  try {
    const verified = verifyVisitorToken(req.cookies.get(VISITOR_COOKIE)?.value)
    if (!verified) return NextResponse.json({ updated: false, reason: 'not_recognized' })
    const b = await req.json()
    const roofType = typeof b?.selectedRoofType === 'string' ? b.selectedRoofType : undefined
    const product = typeof b?.product === 'string' ? b.product : undefined
    const est = estimateForLead(pricingConfig.roofTypes as Record<string, PricedConfig>, {
      roofType,
      style: roofType && product ? getProductStyle(roofType, product) : null,
      color: typeof b?.color === 'string' ? b.color : undefined,
      netSquares: typeof b?.netSquares === 'number' ? b.netSquares : null,
      manualSqFt: typeof b?.manualSqFt === 'number' ? b.manualSqFt : null,
      stories: typeof b?.stories === 'string' ? b.stories : undefined,
      roofSizeSource: typeof b?.roofSizeSource === 'string' ? b.roofSizeSource : undefined,
    })
    if (est.status !== 'priced') return NextResponse.json({ updated: false, reason: est.status })
    const updated = await refreshOpportunityValue(verified.contactId, est.low)
    return NextResponse.json({ updated })
  } catch (err) {
    console.error('[update-opportunity-value]', err)
    return NextResponse.json({ updated: false, reason: 'error' })
  }
}
