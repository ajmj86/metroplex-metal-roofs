// First-party attribution persistence (client-side only).
//
// Captured query params (UTMs + ad click ids + the QR "area") are kept in sessionStorage AND mirrored into a first-party
// cookie (mmr_utm, 30 days, SameSite=Lax) so attribution survives a new tab, a closed tab, or a return visit. Reads fall back
// from sessionStorage to the cookie, so an empty sessionStorage restores itself.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'] as const
export type UtmKey = (typeof UTM_KEYS)[number]
// Everything we capture and mirror. `area` is not attribution but rides along (it drives the hero eyebrow).
export const CAPTURE_KEYS = [...UTM_KEYS, 'area'] as const
export type CaptureKey = (typeof CAPTURE_KEYS)[number]
export type StoredUtm = Partial<Record<CaptureKey, string>>

export const UTM_COOKIE = 'mmr_utm'
export const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30
export const UTM_UPDATED_EVENT = 'mmr-utm-updated'
const MAX_VALUE_LEN = 150

const isKey = (k: string): k is CaptureKey => (CAPTURE_KEYS as readonly string[]).includes(k)

function readCookie(): StoredUtm {
  try {
    const m = document.cookie.split('; ').find(c => c.startsWith(UTM_COOKIE + '='))
    if (!m) return {}
    const parsed = JSON.parse(decodeURIComponent(m.slice(UTM_COOKIE.length + 1)))
    const out: StoredUtm = {}
    for (const [k, v] of Object.entries(parsed ?? {})) if (isKey(k) && typeof v === 'string' && v) out[k] = v.slice(0, MAX_VALUE_LEN)
    return out
  } catch {
    return {}
  }
}

function writeCookie(values: StoredUtm) {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${UTM_COOKIE}=${encodeURIComponent(JSON.stringify(values))}; Max-Age=${UTM_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  } catch { /* cookies blocked: sessionStorage still works */ }
}

/** sessionStorage first; if it holds nothing, restore from the mmr_utm cookie (and re-seed sessionStorage). */
export function readStoredUtm(): StoredUtm {
  const out: StoredUtm = {}
  try {
    for (const k of CAPTURE_KEYS) {
      const v = sessionStorage.getItem(k)
      if (v) out[k] = v
    }
  } catch { /* storage blocked */ }
  if (Object.keys(out).length) return out
  const fromCookie = readCookie()
  if (Object.keys(fromCookie).length) {
    try { for (const [k, v] of Object.entries(fromCookie)) sessionStorage.setItem(k, v as string) } catch { /* ignore */ }
  }
  return fromCookie
}

/** Store captured values in sessionStorage and merge them into the cookie. */
export function writeStoredUtm(values: StoredUtm) {
  const clean: StoredUtm = {}
  for (const [k, v] of Object.entries(values)) if (isKey(k) && v) clean[k] = v.slice(0, MAX_VALUE_LEN)
  if (!Object.keys(clean).length) return
  try { for (const [k, v] of Object.entries(clean)) sessionStorage.setItem(k, v as string) } catch { /* ignore */ }
  writeCookie({ ...readCookie(), ...clean })
  try { window.dispatchEvent(new Event(UTM_UPDATED_EVENT)) } catch { /* ignore */ }
}

/** Append stored attribution params to an INTERNAL href. External URLs, protocol-relative URLs and bare "#hash" links are untouched;
 *  params already present on the href win. Query goes before any #hash. */
export function withUtm(href: string, stored: StoredUtm): string {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return href
  const hashAt = href.indexOf('#')
  const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt)
  const hash = hashAt === -1 ? '' : href.slice(hashAt)
  const qAt = beforeHash.indexOf('?')
  const path = qAt === -1 ? beforeHash : beforeHash.slice(0, qAt)
  const sp = new URLSearchParams(qAt === -1 ? '' : beforeHash.slice(qAt + 1))
  let changed = false
  for (const k of UTM_KEYS) {
    const v = stored[k]
    if (v && !sp.has(k)) { sp.set(k, v); changed = true }
  }
  if (!changed) return href
  const qs = sp.toString()
  return path + (qs ? '?' + qs : '') + hash
}
