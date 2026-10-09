import { test, expect } from '@playwright/test'
import codes from '../data/neighbor_codes.json'

const UTM = 'utm_source=addressed&utm_medium=postcard&utm_campaign=campaign2_brava_neighbors'
const entries = Object.entries(codes as Record<string, string>)

for (const [code, full] of [entries[0], entries[entries.length - 1]]) {
  test(`/n/${code} 302s to /lp/neighbor with town, street and UTMs`, async ({ request }) => {
    const res = await request.get(`/n/${code}`, { maxRedirects: 0 })
    expect(res.status()).toBe(302)
    const loc = new URL(res.headers()['location'])
    const want = new URL(full)
    expect(loc.pathname).toBe('/lp/neighbor')
    expect(loc.search).toBe(want.search)
    expect(loc.searchParams.get('town')).toBeTruthy()
    expect(loc.searchParams.get('street')).toBeTruthy()
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

test('unknown code 302s to /lp/neighbor with utm_content=unknown', async ({ request }) => {
  const res = await request.get('/n/ZZ99', { maxRedirects: 0 })
  expect(res.status()).toBe(302)
  const loc = new URL(res.headers()['location'])
  expect(loc.pathname).toBe('/lp/neighbor')
  expect(loc.search).toBe(`?${UTM}&utm_content=unknown`)
})

test('every code redirects to /lp/neighbor with matching utm_content', () => {
  for (const [code, full] of entries) {
    const u = new URL(full)
    expect(u.pathname).toBe('/lp/neighbor')
    expect(u.searchParams.get('utm_content')).toBe(code)
    expect(full).not.toMatch(/undefined|null/)
  }
})
