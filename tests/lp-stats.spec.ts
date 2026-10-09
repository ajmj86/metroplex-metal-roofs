import { test, expect } from '@playwright/test'

const FOOTNOTE =
  '*Insurance discounts and energy savings vary by home, roof system, carrier, and climate. Confirm eligibility with your insurance provider.'

const pages = ['/lp/postcard', '/lp/neighbor?town=Colleyville&street=Miramar%20Lane']

for (const url of pages) {
  test(`${url}: stat ranges, labels and single footnote`, async ({ page }) => {
    await page.goto(url)
    await expect(page.getByText('15–35%', { exact: true })).toBeVisible()
    await expect(page.getByText('10–25%', { exact: true })).toBeVisible()
    await expect(page.getByText('Insurance Premium Savings*', { exact: true })).toBeVisible()
    await expect(page.getByText('Energy Cost Reduction*', { exact: true })).toBeVisible()
    await expect(page.getByText('Roof Lifespan')).toBeVisible()
    await expect(page.getByText('Highest Class Impact Rating')).toBeVisible()

    const foot = page.getByTestId('stat-footnote')
    await expect(foot).toHaveCount(1)
    await expect(foot).toHaveText(FOOTNOTE)

    // the old single-number insurance stat is gone from the stat strip
    await expect(page.getByText('Insurance Savings', { exact: true })).toHaveCount(0)
    const text = await page.locator('body').innerText()
    expect(text).not.toMatch(/undefined|NaN|\{town\}|\{street\}/)
  })
}

test('stat strip is a 4-column grid on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/lp/postcard')
  const cols = await page.locator('.grid-4').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
  expect(cols).toBe(4)
})

// ── Sitewide alignment: homepage, city pages, material pages (same claims + one footnote wording) ──
const HERO_BULLET = 'Insurance Discount Eligible*'

for (const url of ['/', '/metal-roofing-frisco-tx']) {
  test(`${url}: stat ranges, hero bullet and footnote use the sitewide wording`, async ({ page }) => {
    await page.goto(url)
    await expect(page.getByText('15–35%', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('10–25%', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Insurance Premium Savings*', { exact: true })).toBeVisible()
    await expect(page.getByText('Energy Cost Reduction*', { exact: true })).toBeVisible()
    await expect(page.getByText('Cost Recouped at Resale')).toBeVisible()          // still a 4-stat strip
    await expect(page.getByText(HERO_BULLET, { exact: true })).toBeVisible()
    await expect(page.getByText(FOOTNOTE, { exact: true })).toHaveCount(2)          // hero footnote + stat-strip footnote, same constant
    // the strip footnote sits directly under the stat strip (same section as the asterisks)
    const strip = await page.locator('.grid-4').first().boundingBox()
    const foot = await page.getByTestId('stat-footnote').boundingBox()
    expect(strip && foot).toBeTruthy()
    expect(foot!.y).toBeGreaterThanOrEqual(strip!.y + strip!.height - 1)
    expect(foot!.y - (strip!.y + strip!.height)).toBeLessThan(40)
    await expect(page.getByTestId('stat-footnote')).toHaveCount(1)
    await expect(page.getByTestId('stat-footnote')).toHaveText(FOOTNOTE)
    await expect(page.getByText('Insurance Savings', { exact: true })).toHaveCount(0)
    const text = await page.locator('body').innerText()
    expect(text).not.toMatch(/Up to 35%|\b20–35%|undefined|NaN/)
    const cols = await page.locator('.grid-4').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
    expect(cols).toBe(4)
  })
}

async function faqJsonLd(page: import('@playwright/test').Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  const answers: string[] = []
  const walk = (n: unknown) => {
    if (Array.isArray(n)) n.forEach(walk)
    else if (n && typeof n === 'object') {
      const o = n as Record<string, unknown>
      if (o['@type'] === 'FAQPage') (o['mainEntity'] as Array<{ acceptedAnswer: { text: string } }>).forEach(q => answers.push(q.acceptedAnswer.text))
      Object.values(o).forEach(walk)
    }
  }
  blocks.forEach(b => walk(JSON.parse(b)))
  return answers
}

for (const url of ['/metal-roofing-frisco-tx', '/metal-roofing-southlake-tx', '/standing-seam-roofing', '/stone-coated-steel-roofing']) {
  test(`${url}: FAQ copy and FAQPage JSON-LD both say 15–35% (carrier-dependent)`, async ({ page }) => {
    await page.goto(url)
    const answers = await faqJsonLd(page)
    const hit = answers.filter(a => a.includes('wind/hail premium'))
    expect(hit.length).toBe(1)
    expect(hit[0]).toContain('15–35% reductions on their wind/hail premium')
    expect(hit[0]).toContain('depending on carrier and policy')
    expect(answers.join(' ')).not.toContain('20–35%')
    expect(await page.content()).not.toContain('20–35%')
  })
}

test('general landing pages: hero bullet + hero footnote use the sitewide wording', async ({ page }) => {
  for (const u of ['postcard', 'facebook', 'google-brand', 'google-cost', 'google-materials']) {
    await page.goto(`/lp/${u}`)
    await expect(page.getByText('Insurance Discount Eligible*', { exact: true }), u).toBeVisible()
    await expect(page.getByText(FOOTNOTE, { exact: true }), u).toHaveCount(2)   // hero footnote + stat-strip footnote, same constant
    expect(await page.locator('body').innerText(), u).not.toContain('Up to 35%')
  }
})

test('/lp/google-insurance: 15–35% in title, subhead and bullet; required footnote verbatim', async ({ page }) => {
  await page.goto('/lp/google-insurance')
  expect(await page.title()).toBe('Class 4 Impact-Rated Roofing — 15–35% Insurance Discount | Metroplex Metal Roofs')
  await expect(page.getByText('can qualify DFW homeowners for a 15–35% insurance discount*', { exact: false })).toBeVisible()
  await expect(page.getByText('15–35% Insurance Premium Savings*', { exact: true })).toBeVisible()
  await expect(page.getByText('*Actual discount varies by carrier and policy.', { exact: true })).toHaveCount(1)
  await expect(page.getByText(FOOTNOTE, { exact: true })).toHaveCount(1)          // stat-strip footnote
  await expect(page.getByText('10–25%', { exact: true })).toBeVisible()
  const html = await page.content()
  expect(html).not.toContain('Up to 35%')
  expect(html).not.toContain('up to a 35%')
})
