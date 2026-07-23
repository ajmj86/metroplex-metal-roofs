import { createHmac, timingSafeEqual } from 'crypto'

// Signed, stateless "remember this visitor" token — stored client-side in a
// cookie (see app/api/lead-intake/route.ts for issuance). Deliberately holds
// only contactId + timestamps; address/contact details are always re-fetched
// live from GHL (lib/ghl.ts) so a stale token can't serve stale data.
interface VisitorTokenPayload {
  contactId: string
  iat: number
  exp: number
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 180 // ~180 days

function base64url(input: Buffer): string {
  return input.toString('base64url')
}

function sign(payload: string): string {
  const secret = process.env.VISITOR_TOKEN_SECRET
  if (!secret) throw new Error('VISITOR_TOKEN_SECRET is not set')
  return base64url(createHmac('sha256', secret).update(payload).digest())
}

export function signVisitorToken(contactId: string): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: VisitorTokenPayload = { contactId, iat: now, exp: now + TOKEN_TTL_SECONDS }
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

// Never throws — a tampered, expired, or malformed token degrades silently to
// "no cookie" (null), same as a first-time visitor, rather than erroring.
export function verifyVisitorToken(token: string | undefined | null): { contactId: string } | null {
  if (!token) return null
  try {
    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return null

    const expectedSignature = sign(encodedPayload)
    const actual = Buffer.from(signature)
    const expected = Buffer.from(expectedSignature)
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as VisitorTokenPayload
    if (!payload.contactId || typeof payload.exp !== 'number') return null
    if (Math.floor(Date.now() / 1000) > payload.exp) return null

    return { contactId: payload.contactId }
  } catch {
    return null
  }
}
