import { test, expect } from '@playwright/test'
import codes from '../data/neighbor_codes.json'

// The Campaign 2 mail-merge sheet points qr_url at /qr/{code}.png, so every code must have a served PNG.
test('every Campaign 2 code has a QR PNG at /qr/{code}.png', async ({ request }) => {
  for (const code of Object.keys(codes)) {
    const r = await request.get(`/qr/${code}.png`)
    expect(r.status(), code).toBe(200)
    expect(r.headers()['content-type'], code).toContain('image/png')
  }
})
