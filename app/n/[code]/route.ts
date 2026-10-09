import { after } from 'next/server'
import codes from '@/data/neighbor_codes.json'
import { logQrScan } from '@/lib/qrScanLog'

// Short-URL redirect for the Campaign 2 addressed-mail QR codes:
// metroplexmetalroofs.com/n/{code} -> /lp/neighbor with town/street merge values and UTMs
// (utm_content = code); the QR and printed short URL carry only the code.
// Unknown codes still land on the neighbor page (generic copy), attributed to utm_content=unknown.
const FALLBACK =
  '/lp/neighbor?utm_source=addressed&utm_medium=postcard&utm_campaign=campaign2_brava_neighbors&utm_content=unknown'

const CODES = codes as Record<string, string>

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const known = code.toUpperCase() in CODES
  const target = CODES[code.toUpperCase()] ?? FALLBACK
  // Log the scan after the response is sent; logQrScan never throws, and a failure here can't affect the redirect.
  try { after(() => logQrScan(request, code, known)) } catch {}
  // Redirect on the request's own origin (path + query of the mapped URL), so the apex, www and
  // preview deployments all stay on the host the visitor used.
  const t = new URL(target, request.url)
  return Response.redirect(new URL(t.pathname + t.search, request.url), 302)
}
