import { NextRequest, NextResponse } from 'next/server'
import { verifyVisitorToken } from '@/lib/visitorToken'
import { getContact } from '@/lib/ghl'

export const maxDuration = 15

const VISITOR_COOKIE = 'mmr_visitor'

// Silent, cookie-only recognition check — called on every /visualizer page
// load. Not recognized is the expected common case (every first-time visitor
// hits this), so it always responds 200 with { recognized: false } rather
// than an error status.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(VISITOR_COOKIE)?.value
  const verified = verifyVisitorToken(token)
  if (!verified) return NextResponse.json({ recognized: false })

  const contact = await getContact(verified.contactId)
  if (!contact) return NextResponse.json({ recognized: false })

  return NextResponse.json({ recognized: true, ...contact })
}
