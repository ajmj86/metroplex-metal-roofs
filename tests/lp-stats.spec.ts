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
