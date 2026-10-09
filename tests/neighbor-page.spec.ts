import { test, expect } from '@playwright/test'

const UTM = 'utm_source=addressed&utm_medium=postcard&utm_campaign=campaign2_brava_neighbors&utm_content=CV01'

test('renders merged town and street from params', async ({ page }) => {
  await page.goto(`/lp/neighbor?town=Colleyville&street=Miramar%20Lane&${UTM}`)
  await expect(page.getByText('Mailed to homes near Miramar Lane · Colleyville')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your neighbor chose Brava slate.')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('See it on your home.')
  await expect(page.getByText('A Brava synthetic slate roof was just installed on Miramar Lane.')).toBeVisible()
  for (const b of ['50-Year Lifespan', 'Class 4 Impact Rated', 'Insurance Discount Eligible']) {
    await expect(page.getByText(b).first()).toBeVisible()
  }
  await expect(page.getByText('What a Brava roof typically runs on homes like yours.')).toBeVisible()
  const text = await page.locator('body').innerText()
  expect(text).not.toMatch(/undefined|\{town\}|\{street\}|null/)
  await expect(page.getByRole('link', { name: /Free Visualizer/ }).first()).toHaveAttribute('href', /^\/visualizer\?roofType=synthetic_slate&style=slate&.*utm_content=CV01/)   // Brava pre-select kept, UTMs appended
})

test('falls back without params', async ({ page }) => {
  await page.goto('/lp/neighbor')
  await expect(page.getByText('Mailed to homes near your street · your neighborhood')).toBeVisible()
  await expect(page.getByText('just installed on your street.')).toBeVisible()
  const text = await page.locator('body').innerText()
  expect(text).not.toMatch(/undefined|\{town\}|\{street\}|null/)
})

test('is noindex', async ({ page }) => {
  await page.goto('/lp/neighbor')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('short URL lands on the page and UTM capture fires', async ({ page }) => {
  await page.goto('/n/CV01')
  await expect(page).toHaveURL(/\/lp\/neighbor\?town=Colleyville/)
  await expect(page.getByText('Miramar Lane').first()).toBeVisible()
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('utm_content'))).toBe('CV01')
  expect(await page.evaluate(() => sessionStorage.getItem('utm_source'))).toBe('addressed')
  expect(await page.evaluate(() => sessionStorage.getItem('utm_campaign'))).toBe('campaign2_brava_neighbors')
  expect(await page.evaluate(() => sessionStorage.getItem('utm_medium'))).toBe('postcard')
})
