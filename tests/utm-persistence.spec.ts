import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import { withUtm, UTM_COOKIE } from '../lib/utm'

const UTM = {
  utm_source: 'addressed', utm_medium: 'postcard', utm_campaign: 'campaign2_brava_neighbors', utm_content: 'SL05',
}
const WIDE = { width: 1700, height: 900 }   // SiteNav shows the desktop links at >= 1600px

async function readStorage(page: Page) {
  return page.evaluate(() => Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'area'].map(k => [k, sessionStorage.getItem(k)])))
}

// ── (3a) journey: QR landing -> three header links -> header CTA -> real visualizer submission ──────────────────────────
test('journey: /n/SL05 -> 3 header links -> CTA -> visualizer submission still carries utm_content=SL05', async ({ page }) => {
  await page.setViewportSize(WIDE)
  const leadBodies: Array<Record<string, unknown>> = []
  await page.route('**/maps.googleapis.com/**', r => r.abort())                 // no Places -> the visualizer's typed-address path
  await page.route('**/api/**', async route => {
    const u = new URL(route.request().url())
    if (u.pathname === '/api/lead-intake') {
      leadBodies.push(JSON.parse(route.request().postData() || '{}'))
      return route.fulfill({ json: { ok: true } })
    }
    if (u.pathname === '/api/returning-visitor') return route.fulfill({ json: { recognized: false } })
    if (u.pathname === '/api/resolve-image') return route.fulfill({ json: { satellite: { imageUrl: null } } })
    if (u.pathname === '/api/roof-size') return route.fulfill({ json: { squares: 24, netSquares: 22, estimateLow: '$54,000', estimateHigh: '$58,000' } })
    return route.fulfill({ json: {} })
  })

  await page.goto('/n/SL05')
  await expect(page).toHaveURL(/\/lp\/neighbor\?.*utm_content=SL05/)
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('SL05')

  // three header links, each a full navigation; every one must keep the attribution
  for (const label of ['About Us', 'Why Metal', 'Pricing']) {
    await page.locator('nav a', { hasText: new RegExp(`^${label}$`, 'i') }).first().click()
    await page.waitForLoadState('load')
    await expect.poll(async () => (await readStorage(page)).utm_content, { message: `after "${label}"` }).toBe('SL05')
  }

  // header CTA -> visualizer; its href must itself carry the UTMs
  const cta = page.locator('nav a', { hasText: /Free Visualizer \+ Estimate/ }).first()
  expect(await cta.getAttribute('href')).toContain('utm_content=SL05')
  await cta.click()
  await expect(page).toHaveURL(/\/visualizer\?.*utm_content=SL05/)

  // drive the visualizer: typed address (Places unavailable) -> Brava Slate / Standard / Arendale -> contact form -> submit
  await page.getByPlaceholder('Enter your home address…').fill('1301 Coffeyville Trail, Plano, TX 75023')
  await page.getByRole('button', { name: /Visualize my roof/i }).click()
  await page.getByRole('button', { name: /^Synthetic Slate$/i }).click()
  await page.getByRole('button', { name: /^Brava Slate$/i }).click()
  await page.getByRole('button', { name: /^Standard Slate$/i }).click()
  await page.getByText('Arendale', { exact: true }).click()
  await page.getByRole('button', { name: /Next: Enter Your Details/i }).click()
  await page.getByPlaceholder('Jane', { exact: true }).fill('TEST')
  await page.getByPlaceholder('Doe', { exact: true }).fill('Campaign2')
  await page.getByPlaceholder('(817) 555-0100').fill('(817) 555-0142')
  await page.getByPlaceholder('jane@email.com').fill('test-c2@example.com')
  await page.getByRole('button', { name: /Generate My Visualization/i }).click()

  await expect.poll(() => leadBodies.length, { timeout: 15_000 }).toBeGreaterThan(0)
  const lead = leadBodies.find(b => b.leadOrigin === 'visualizer') ?? leadBodies[0]
  expect(lead.utm).toMatchObject({ source: 'addressed', medium: 'postcard', campaign: 'campaign2_brava_neighbors', content: 'SL05' })
})

// ── (3b) capture: fbclid/gclid + first-party cookie mirror + restore ───────────────────────────────────────────────────
const LANDING = `/lp/postcard?${new URLSearchParams({ ...UTM, utm_term: 'roof', fbclid: 'FB123', gclid: 'GC456' })}`

test('capture: fbclid and gclid are stored, and everything is mirrored into mmr_utm (30 days, SameSite=Lax)', async ({ page, context }) => {
  await page.goto(LANDING)
  await expect.poll(async () => (await readStorage(page)).gclid).toBe('GC456')
  expect(await readStorage(page)).toMatchObject({ ...UTM, utm_term: 'roof', fbclid: 'FB123', gclid: 'GC456' })

  const cookie = (await context.cookies()).find(c => c.name === UTM_COOKIE)!
  expect(cookie, 'mmr_utm cookie').toBeTruthy()
  expect(cookie.sameSite).toBe('Lax')
  expect(cookie.httpOnly).toBe(false)
  expect(cookie.path).toBe('/')
  const days = (cookie.expires - Date.now() / 1000) / 86400
  expect(days).toBeGreaterThan(29.9)
  expect(days).toBeLessThan(30.1)
  expect(JSON.parse(decodeURIComponent(cookie.value))).toMatchObject({ ...UTM, utm_term: 'roof', fbclid: 'FB123', gclid: 'GC456' })
})

async function freshTab(context: BrowserContext) { return context.newPage() }   // new page = empty sessionStorage

test('restore: an empty sessionStorage is rebuilt from the cookie (new tab, and after clearing storage)', async ({ page, context }) => {
  await page.goto(LANDING)
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('SL05')

  const tab2 = await freshTab(context)                       // new tab, no query string at all
  await tab2.goto('/about')
  await expect.poll(async () => (await readStorage(tab2)).utm_content).toBe('SL05')
  expect(await readStorage(tab2)).toMatchObject({ ...UTM, fbclid: 'FB123', gclid: 'GC456' })

  await page.evaluate(() => sessionStorage.clear())
  await page.goto('/about')
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('SL05')
})

test('new UTMs on a later landing overwrite the stored ones and update the cookie', async ({ page, context }) => {
  await page.goto(LANDING)
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('SL05')
  await page.goto('/lp/postcard?utm_source=addressed&utm_content=TW07')
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('TW07')
  const cookie = (await context.cookies()).find(c => c.name === UTM_COOKIE)!
  expect(JSON.parse(decodeURIComponent(cookie.value)).utm_content).toBe('TW07')
})

// ── (3c) useUtmHref: internal links carry the UTMs, nothing else does ──────────────────────────────────────────────────
test('withUtm: internal only; hash kept; explicit params win; external, tel:, protocol-relative and bare #hash untouched', () => {
  const s = { utm_source: 'addressed', utm_content: 'SL05', gclid: 'G1' }
  expect(withUtm('/visualizer', s)).toBe('/visualizer?utm_source=addressed&utm_content=SL05&gclid=G1')
  expect(withUtm('/#pricing', s)).toBe('/?utm_source=addressed&utm_content=SL05&gclid=G1#pricing')
  expect(withUtm('/visualizer?roofType=r_panel', s)).toBe('/visualizer?roofType=r_panel&utm_source=addressed&utm_content=SL05&gclid=G1')
  expect(withUtm('/lp/x?utm_content=KEEP', s)).toBe('/lp/x?utm_content=KEEP&utm_source=addressed&gclid=G1')
  for (const h of ['https://example.com/x', 'tel:+18173823338', '//cdn.example.com/a', '#why-metal', 'mailto:a@b.co', '']) expect(withUtm(h, s)).toBe(h)
  expect(withUtm('/about', {})).toBe('/about')
})

test('links: header nav, header CTA and page CTAs carry the UTMs; external, tel: and #hash links do not', async ({ page }) => {
  await page.setViewportSize(WIDE)
  await page.goto(LANDING)
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('SL05')

  const hrefs = async (sel: string) => page.locator(sel).evaluateAll(els => els.map(e => e.getAttribute('href') || ''))
  const hasUtm = (h: string) => h.includes('utm_content=SL05') && h.includes('gclid=GC456') && h.includes('fbclid=FB123')

  // landing page: header nav (internal) + hero CTA
  await expect.poll(async () => (await hrefs('nav a')).filter(h => h.startsWith('/')).every(hasUtm)).toBe(true)
  expect((await hrefs('a.cta-btn')).filter(h => h.startsWith('/visualizer')).every(hasUtm)).toBe(true)

  // homepage: bare #hash nav links untouched, internal /about + CTAs carry UTMs, external booking link untouched
  await page.goto('/')
  await expect.poll(async () => (await hrefs('nav a')).filter(h => h.includes('/about') || h.includes('/visualizer')).every(hasUtm)).toBe(true)
  await expect.poll(async () => { const v = await hrefs('a[href*="/visualizer"]'); return v.length > 0 && v.every(hasUtm) }).toBe(true)   // header, hero, step, CTA and footer links
  const homeNav = await hrefs('nav a')
  expect(homeNav.filter(h => h.startsWith('#')).length).toBeGreaterThan(0)                    // #why-metal etc. unchanged
  expect(homeNav.filter(h => h.startsWith('#')).every(h => !h.includes('utm_'))).toBe(true)
  const all = await hrefs('a')
  expect(all.filter(h => /^https?:\/\//.test(h) || h.startsWith('tel:') || h.startsWith('mailto:')).every(h => !h.includes('utm_content=SL05'))).toBe(true)

  // city page + a material page (server component via UtmLink)
  for (const url of ['/metal-roofing-frisco-tx', '/standing-seam-roofing']) {
    await page.goto(url)
    await expect.poll(async () => (await hrefs('a[href*="/visualizer"]')).length > 0 && (await hrefs('a[href*="/visualizer"]')).every(hasUtm), { message: url }).toBe(true)
  }
  await page.goto('/standing-seam-roofing')
  await expect.poll(async () => (await hrefs('a.cta-btn')).filter(h => h.startsWith('/')).every(hasUtm)).toBe(true)
})

test('links: with no stored UTMs nothing is appended; with UTMs a section link keeps the query BEFORE the #hash and still lands on the homepage', async ({ page }) => {
  await page.setViewportSize(WIDE)
  await page.goto('/about')
  const hrefs = await page.locator('nav a').evaluateAll(els => els.map(e => e.getAttribute('href') || ''))
  expect(hrefs.every(h => !h.includes('utm_'))).toBe(true)

  // with UTMs stored, "Pricing" from /about goes to the homepage pricing section (query before the hash)
  await page.goto(LANDING)
  await expect.poll(async () => (await readStorage(page)).utm_content).toBe('SL05')
  await page.goto('/about')
  const pricing = page.locator('nav a', { hasText: /^Pricing$/i }).first()
  await expect.poll(async () => await pricing.getAttribute('href')).toMatch(/^\/\?.*utm_content=SL05.*#pricing$/)
  await pricing.click()
  await expect(page).toHaveURL(/^[^#]*\/(\?.*utm_content=SL05.*)?(#pricing)?$/)
  await expect(page.locator('#pricing')).toBeAttached()      // homepage loaded with its pricing section (hash scrolling itself is timing-dependent and unchanged)
})
