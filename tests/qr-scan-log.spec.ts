import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { uaFamily, cleanReferrer } from '../lib/qrScanLog'

// The row check needs the scan webhook configured for the dev server (QR_SCAN_WEBHOOK_URL / _SECRET in the env that runs
// `npx playwright test`) and ~/.airtable_token to read the row back. Without them only the redirect-never-blocks checks run.
const BASE = 'appyyprjyNFwzY689', TABLE = 'tblZQfJUQmhIIs9TO'
let token = ''
try { token = readFileSync(homedir() + '/.airtable_token', 'utf8').trim() } catch {}
const configured = !!process.env.QR_SCAN_WEBHOOK_URL && !!token

test('redirect still returns 302 to the neighbor page (logging never blocks it)', async ({ request }) => {
  const r = await request.get('/n/SL05', { maxRedirects: 0 })
  expect(r.status()).toBe(302)
  expect(r.headers()['location']).toContain('utm_content=SL05')
})

test('uaFamily and cleanReferrer keep only coarse data', () => {
  expect(uaFamily('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')).toBe('Safari / iOS')
  expect(uaFamily('Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36')).toBe('Chrome / Android')
  expect(uaFamily('Googlebot/2.1')).toBe('bot')
  expect(uaFamily(null)).toBe('unknown')
  expect(cleanReferrer('https://example.com/a/b?email=x@y.com#h')).toBe('https://example.com/a/b')
  expect(cleanReferrer('not a url')).toBe('')
})

test('a hit to /n/SL05 produces a QR Scans row', async ({ request }) => {
  test.skip(!configured, 'QR_SCAN_WEBHOOK_URL / ~/.airtable_token not available')
  const marker = 'https://playwright.test/qr-' + Date.now()
  const r = await request.get('/n/SL05', { maxRedirects: 0, headers: { referer: marker, 'x-vercel-ip-country': 'US' } })
  expect(r.status()).toBe(302)
  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?filterByFormula=${encodeURIComponent(`{Referrer}='${marker}'`)}`
  let rec: { id: string; fields: Record<string, unknown> } | undefined
  await expect.poll(async () => {
    const j = await (await fetch(url, { headers: { Authorization: 'Bearer ' + token } })).json()
    rec = j.records?.[0]
    return !!rec
  }, { timeout: 30_000, intervals: [1000, 2000, 3000] }).toBe(true)
  expect(rec!.fields.Code).toBe('SL05')
  expect(rec!.fields.Country).toBe('US')
  expect(rec!.fields['Known Code']).toBe(true)
  expect(typeof rec!.fields.Timestamp).toBe('string')
  expect(JSON.stringify(rec!.fields)).not.toMatch(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/) // no IP
  await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}/${rec!.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
})
