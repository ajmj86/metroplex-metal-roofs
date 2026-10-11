import { test, expect, type Page } from '@playwright/test'

// Stubs window.gtag, blocks navigation (preventDefault in a capture listener, so React
// handlers still run), clicks every visible /visualizer link and guide link, and checks the
// GA4 events. No leads are submitted.
async function prep(page: Page) {
  await page.addInitScript(() => {
    ;(window as any).__ga = []
    ;(window as any).gtag = (...a: unknown[]) => (window as any).__ga.push(a)
    document.addEventListener('click', e => {
      if ((e.target as Element)?.closest('a')) e.preventDefault()
    }, true)
  })
}
const events = (page: Page) => page.evaluate(() => (window as any).__ga.filter((a: any[]) => a[0] === 'event').map((a: any[]) => ({ name: a[1], ...a[2] })))

async function clickAll(page: Page, selector: string) {
  const out: any[] = []
  const n = await page.locator(selector).count()
  for (let i = 0; i < n; i++) {
    const el = page.locator(selector).nth(i)
    if (!(await el.isVisible())) continue
    const href = await el.getAttribute('href')
    const label = ((await el.innerText()) || '').trim().slice(0, 40)
    await page.evaluate(() => { (window as any).__ga.length = 0 })
    await el.scrollIntoViewIfNeeded()
    await el.click({ force: true })
    const ev = (await events(page)).filter((e: any) => e.name === 'visualizer_cta_click' || e.name === 'guide_link_click')
    out.push({ label, href: href?.split('&utm')[0], events: ev })
  }
  return out
}

const pages = [
  { path: '/', viewport: { width: 1280, height: 900 } },
  { path: '/', viewport: { width: 390, height: 800 }, mobileMenu: true },
  { path: '/', viewport: { width: 1700, height: 900 } },
  { path: '/metal-roofing-plano-tx', viewport: { width: 1700, height: 900 } },
  { path: '/about', viewport: { width: 1700, height: 900 } },
  { path: '/metal-roofing-plano-tx', viewport: { width: 1280, height: 900 } },
  { path: '/copper-roofing', viewport: { width: 1280, height: 900 } },
  { path: '/brava-vs-davinci-roofing', viewport: { width: 1280, height: 900 } },
  { path: '/lp/google-cost', viewport: { width: 1280, height: 900 } },
]

for (const p of pages) {
  test(`click events ${p.path} ${p.viewport.width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(String(e)))
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
    await page.setViewportSize(p.viewport)
    await prep(page)
    await page.goto(p.path)
    await page.waitForLoadState('networkidle')
    if (p.mobileMenu) {
      await page.locator('button[aria-label*="enu" i]').first().click().catch(() => {})
    }
    const viz = await clickAll(page, 'a[href^="/visualizer"]')
    const guide = await clickAll(page, 'a.ps-guide-link')
    console.log(`REPORT ${p.path} @${p.viewport.width}\n` + [...viz, ...guide].map(r => `  ${r.events.map((e: any) => `${e.name} location=${e.location ?? '-'} product=${e.product} path=${e.page_path} variant=${e.form_variant ?? '-'}`).join(' | ')}  <= ${r.href} [${r.label.replace(/\s+/g, ' ')}]`).join('\n'))
    for (const r of [...viz, ...guide]) {
      expect(r.events.length, `${p.path} ${r.label}`).toBe(1)
      expect(r.events[0].page_path).toBe(p.path)
    }
    expect(errors, errors.join('\n')).toEqual([])
  })
}

test('visualizer page loads clean', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(String(e)))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await prep(page)
  await page.goto('/visualizer')
  await page.waitForLoadState('networkidle')
  const ev = await events(page)
  expect(ev.some((e: any) => e.name === 'visualizer_start')).toBe(true)
  expect(errors, errors.join('\n')).toEqual([])
})

// Address step: /api/* is mocked, so nothing reaches Google or n8n and no lead is created.
test('visualizer address step fires visualizer_address_selected', async ({ page }) => {
  await prep(page)
  await page.route('**/api/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ satellite: { imageUrl: null } }) }))
  await page.goto('/visualizer')
  await page.waitForLoadState('networkidle')
  await page.getByPlaceholder('Enter your home address…').fill('1234 Test Street, Plano, TX 75024')
  const btn = page.locator('button', { hasText: /visualize|continue|next/i }).first()
  await expect(btn).toBeEnabled({ timeout: 15000 })
  await btn.click()
  await expect.poll(async () => (await events(page)).map((e: any) => e.name)).toContain('visualizer_address_selected')
  const ev = (await events(page)).find((e: any) => e.name === 'visualizer_address_selected')
  expect(Object.keys(ev).sort()).toEqual(['form_variant', 'method', 'name'])
})
