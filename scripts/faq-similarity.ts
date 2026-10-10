/*
 * FAQ near-duplicate check.
 *
 * Collects every FAQ answer from the FAQPage JSON-LD of each URL in the sitemap
 * (so it checks the text actually served, which is also the text search engines
 * read) and flags any pair of answers on DIFFERENT pages whose normalized token
 * Jaccard similarity is above the threshold.
 *
 * Usage (needs a running server, e.g. `npx next build && npx next start -p 3457`):
 *   node scripts/faq-similarity.ts [--base http://localhost:3457] [--threshold 0.6] [--list] [--max 60]
 *
 * --list prints every page's FAQ questions with counts.
 * Exit code 1 if any pair is flagged.
 */

type Faq = { page: string; q: string; a: string }

const args = process.argv.slice(2)
const opt = (name: string, fallback: string) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const BASE = opt('--base', 'http://localhost:3457').replace(/\/$/, '')
const THRESHOLD = parseFloat(opt('--threshold', '0.6'))
const LIST = args.includes('--list')
const MAX = parseInt(opt('--max', '60'), 10)

const tokens = (s: string): Set<string> =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean),
  )

const jaccard = (a: Set<string>, b: Set<string>): number => {
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

async function main() {
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname || '/')

  const faqs: Faq[] = []
  const perPage = new Map<string, string[]>()
  for (const path of urls) {
    const html = await (await fetch(BASE + path)).text()
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    for (const b of blocks) {
      let data: any
      try { data = JSON.parse(b[1]) } catch { continue }
      const nodes = data['@graph'] ?? [data]
      for (const n of nodes) {
        if (n['@type'] !== 'FAQPage') continue
        for (const e of n.mainEntity ?? []) {
          faqs.push({ page: path, q: e.name, a: e.acceptedAnswer?.text ?? '' })
          perPage.set(path, [...(perPage.get(path) ?? []), e.name])
        }
      }
    }
  }

  if (LIST) {
    for (const [path, qs] of perPage) {
      console.log(`\n${path} (${qs.length})`)
      for (const q of qs) console.log(`  - ${q}`)
    }
    console.log('')
  }

  const sets = faqs.map(f => tokens(f.a))
  const flagged: { score: number; x: Faq; y: Faq }[] = []
  for (let i = 0; i < faqs.length; i++) {
    for (let j = i + 1; j < faqs.length; j++) {
      if (faqs[i].page === faqs[j].page) continue
      const score = jaccard(sets[i], sets[j])
      if (score > THRESHOLD) flagged.push({ score, x: faqs[i], y: faqs[j] })
    }
  }

  flagged.sort((a, b) => b.score - a.score)
  console.log(`Pages with FAQs: ${perPage.size} | answers: ${faqs.length} | threshold: ${THRESHOLD}`)
  console.log(`Flagged pairs: ${flagged.length}`)
  for (const f of flagged.slice(0, MAX)) {
    console.log(`  ${f.score.toFixed(2)}  ${f.x.page} "${f.x.q}"\n        ${f.y.page} "${f.y.q}"`)
  }
  if (flagged.length > MAX) console.log(`  ... and ${flagged.length - MAX} more (use --max N)`)
  process.exit(flagged.length ? 1 : 0)
}

main()
