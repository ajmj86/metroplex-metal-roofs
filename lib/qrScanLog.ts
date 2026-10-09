// Fire-and-forget scan logging for the /n/[code] QR redirect. Rows land in Airtable "QR Scans" (base
// appyyprjyNFwzY689) through an n8n relay webhook, so no Airtable token lives on Vercel. No IP is stored: only code,
// timestamp, user-agent family, referrer (origin + path, no query) and the Vercel geo country header.
// Never throws: any failure is swallowed so the redirect is never blocked or failed.

export function uaFamily(ua: string | null): string {
  const s = ua || ''
  if (!s) return 'unknown'
  if (/bot|crawl|spider|preview|facebookexternalhit|slurp|headless|monitor|curl|wget/i.test(s)) return 'bot'
  const os = /iPhone|iPad|iPod/i.test(s) ? 'iOS' : /Android/i.test(s) ? 'Android' : /Windows/i.test(s) ? 'Windows'
    : /Mac OS X|Macintosh/i.test(s) ? 'macOS' : /Linux/i.test(s) ? 'Linux' : 'other'
  const br = /EdgA?\/|Edg\//i.test(s) ? 'Edge' : /OPR\/|Opera/i.test(s) ? 'Opera' : /SamsungBrowser/i.test(s) ? 'Samsung'
    : /FxiOS|Firefox/i.test(s) ? 'Firefox' : /CriOS|Chrome/i.test(s) ? 'Chrome' : /Safari/i.test(s) ? 'Safari' : 'other'
  return `${br} / ${os}`
}

export function cleanReferrer(ref: string | null): string {
  if (!ref) return ''
  try { const u = new URL(ref); return (u.origin + u.pathname).slice(0, 300) } catch { return '' }
}

export async function logQrScan(request: Request, code: string, known: boolean): Promise<void> {
  try {
    const url = process.env.QR_SCAN_WEBHOOK_URL
    if (!url) return
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-scan-secret': process.env.QR_SCAN_WEBHOOK_SECRET || '' },
      body: JSON.stringify({
        code: code.toUpperCase(),
        timestamp: new Date().toISOString(),
        ua: uaFamily(request.headers.get('user-agent')),
        referrer: cleanReferrer(request.headers.get('referer')),
        country: request.headers.get('x-vercel-ip-country') || '',
        known,
      }),
      signal: AbortSignal.timeout(4000),
    })
  } catch {
    // logging must never affect the redirect
  }
}
