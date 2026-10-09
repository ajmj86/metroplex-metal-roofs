import codes from '@/data/neighbor_codes.json'

// Short-URL redirect for the Campaign 2 addressed-mail QR codes:
// metroplexmetalroofs.com/n/{code} -> full /lp/postcard URL with UTMs (utm_content = code).
// Unknown codes still land on the postcard page, attributed to utm_content=unknown.
const FALLBACK =
  '/lp/postcard?utm_source=addressed&utm_medium=postcard&utm_campaign=campaign2_brava_neighbors&utm_content=unknown'

const CODES = codes as Record<string, string>

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const target = CODES[code.toUpperCase()] ?? FALLBACK
  return Response.redirect(new URL(target, request.url), 302)
}
