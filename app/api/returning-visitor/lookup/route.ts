import { NextRequest, NextResponse } from 'next/server'
import { signVisitorToken } from '@/lib/visitorToken'
import { searchContactByEmailOrPhone } from '@/lib/ghl'

export const maxDuration = 15

const VISITOR_COOKIE = 'mmr_visitor'

// Best-effort, per-serverless-instance limiter — resets on cold start and
// doesn't coordinate across concurrent instances/regions. Acceptable given
// this endpoint's low-stakes, non-financial data (no KV/Redis in this project
// to do better). 5 attempts/IP/hour.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
const attemptsByIp = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const attempts = (attemptsByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  attempts.push(now)
  attemptsByIp.set(ip, attempts)
  return attempts.length > RATE_LIMIT
}

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Anti-enumeration: bad-format input, genuinely-no-match, and found all
// return the same 200 status and { matched: boolean } shape — never a
// distinct 400 for "that doesn't look like an email." The fast-reject
// (bad-format) path is also padded to roughly match a real GHL round-trip, so
// response timing alone can't distinguish the cases either. The response
// itself never carries contactId/address/PII — on a match it only sets the
// cookie; the client re-fetches display data from the cookie-gated
// GET /api/returning-visitor afterward.
export async function POST(req: NextRequest) {
  const start = Date.now()
  const ip = getIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const email: string | undefined = typeof body.email === 'string' ? body.email.trim() : undefined
  const phone: string | undefined = typeof body.phone === 'string' ? body.phone.trim() : undefined

  const validEmail = email && EMAIL_RE.test(email) ? email : undefined
  const validPhone = phone && phone.replace(/\D/g, '').length === 10 ? phone : undefined

  let contact = null
  if (validEmail || validPhone) {
    contact = await searchContactByEmailOrPhone(validEmail, validPhone)
  }

  // Normalize total response time so a malformed-input reject (no network
  // call made) doesn't complete measurably faster than a real lookup.
  const MIN_RESPONSE_MS = 400
  const elapsed = Date.now() - start
  if (elapsed < MIN_RESPONSE_MS) await sleep(MIN_RESPONSE_MS - elapsed)

  if (!contact) return NextResponse.json({ matched: false })

  const res = NextResponse.json({ matched: true })
  res.cookies.set(VISITOR_COOKIE, signVisitorToken(contact.contactId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 180,
    path: '/',
  })
  return res
}
