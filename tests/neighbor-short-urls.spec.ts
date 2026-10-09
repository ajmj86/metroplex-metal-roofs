import { test, expect } from '@playwright/test'
import codes from '../data/neighbor_codes.json'

const UTM = 'utm_source=addressed&utm_medium=postcard&utm_campaign=campaign2_brava_neighbors'
const entries = Object.entries(codes as Record<string, string>)

for (const [code, full] of [entries[0], entries[entries.length - 1]]) {
  test(`/n/${code} 302s to its UTM URL`, async ({ request }) => {
    const res = await request.get(`/n/${code}`, { maxRedirects: 0 })
    expect(res.status()).toBe(302)
    const loc = new URL(res.headers()['location'])
    expect(loc.pathname).toBe('/lp/postcard')
    expect(loc.search).toBe(new URL(full).search)
    expect(loc.searchParams.get('utm_content')).toBe(code)
    expect(loc.search).toContain(UTM)
  })
}

test('lower-case code still resolves', async ({ request }) => {
  const [code] = entries[0]
  const res = await request.get(`/n/${code.toLowerCase()}`, { maxRedirects: 0 })
  expect(res.status()).toBe(302)
  expect(new URL(res.headers()['location']).searchParams.get('utm_content')).toBe(code)
})

test('unknown code 302s to the unknown-attribution postcard URL', async ({ request }) => {
  const res = await request.get('/n/ZZ99', { maxRedirects: 0 })
  expect(res.status()).toBe(302)
  const loc = new URL(res.headers()['location'])
  expect(loc.pathname).toBe('/lp/postcard')
  expect(loc.search).toBe(`?${UTM}&utm_content=unknown`)
})
