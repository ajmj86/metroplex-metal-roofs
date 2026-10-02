// Run: node --test scripts/test-caseB.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { createOpportunityForCaseB, buildCaseBAlert, maskPhone } from '../lib/caseB.ts'

function harness(result, { phone = '+12145550147', phoneThrows = false } = {}) {
  const calls = { create: [], alerts: [] }
  const deps = {
    createOpportunity: async (p) => { calls.create.push(p); return result },
    alertAndrew: async (m) => { calls.alerts.push(m); return true },
    getContactPhone: async () => { if (phoneThrows) throw new Error('boom'); return phone },
  }
  return { deps, calls }
}
const input = {
  contactId: 'c1', name: 'n', firstName: 'Jane', lastName: 'Doe', address: '1 Test Way, Dallas, TX 75201, USA',
  roofLabel: 'Synthetic Slate – Brava Cedar Shake', estimate: { status: 'priced', low: 77301, high: 82007 },
}

test('NO_DUPLICATE -> created:false, status 200, exactly one alert', async () => {
  const { deps, calls } = harness({ ok: false, duplicate: true, existingId: 'opp9' })
  const r = await createOpportunityForCaseB(deps, input)
  assert.equal(r.status, 200)
  assert.deepEqual(r.body, { ok: true, created: false, reason: 'existing_opportunity', existingOpportunityId: 'opp9' })
  assert.equal(calls.alerts.length, 1)
})

test('alert text: required line, name, masked phone, new address, roof, $low – $high, < 300 chars, no full phone', async () => {
  const { deps, calls } = harness({ ok: false, duplicate: true, existingId: null })
  await createOpportunityForCaseB(deps, input)
  const m = calls.alerts[0]
  assert.ok(m.includes('Returning contact entered a new address. GHL blocked a second opportunity. Create it manually.'))
  assert.ok(m.includes('Jane Doe ***0147'))
  assert.ok(m.includes('New address: 1 Test Way, Dallas, TX 75201, USA'))
  assert.ok(m.includes('Roof: Synthetic Slate – Brava Cedar Shake'))
  assert.ok(m.includes('Estimate: $77,301 – $82,007'))
  assert.ok(!m.includes('2145550147'))
  assert.ok(m.length < 300, `len ${m.length}`)
  assert.ok(!/undefined|null|NaN/.test(m))
})

test('copper -> "none (custom quote)"; unavailable -> estimate line omitted', () => {
  const base = { firstName: 'A', lastName: 'B', phone: '2145550147', address: 'x', roofLabel: 'Copper' }
  assert.ok(buildCaseBAlert({ ...base, estimate: { status: 'none' } }).includes('Estimate: none (custom quote)'))
  assert.ok(!buildCaseBAlert({ ...base, estimate: { status: 'unavailable' } }).includes('Estimate'))
})

test('very long address/name still stays under 300 chars', () => {
  const m = buildCaseBAlert({ firstName: 'Bartholomew', lastName: 'Featherstonehaugh-Smythe', phone: '2145550147',
    address: '12345 Extraordinarily Long Boulevard Name Suite 4500, North Richland Hills, TX 76182, USA',
    roofLabel: 'Synthetic Slate – Brava Spanish Barrel Tile', estimate: { status: 'priced', low: 100000, high: 120000 } })
  assert.ok(m.length <= 300, `len ${m.length}`)
})

test('phone lookup failure / missing phone: alert still sent once, no phone shown', async () => {
  const { deps, calls } = harness({ ok: false, duplicate: true, existingId: null }, { phoneThrows: true })
  await createOpportunityForCaseB(deps, input)
  assert.equal(calls.alerts.length, 1)
  assert.ok(!calls.alerts[0].includes('***'))
  assert.equal(maskPhone(null), '')
})

test('other GHL error -> 502 error, NO alert', async () => {
  const { deps, calls } = harness({ ok: false, duplicate: false })
  const r = await createOpportunityForCaseB(deps, input)
  assert.equal(r.status, 502)
  assert.deepEqual(r.body, { error: 'Failed to create opportunity' })
  assert.equal(calls.alerts.length, 0)
})

test('normal create -> created:true, value = low, NO alert', async () => {
  const { deps, calls } = harness({ ok: true, id: 'newopp' })
  const r = await createOpportunityForCaseB(deps, input)
  assert.equal(r.status, 200)
  assert.deepEqual(r.body, { success: true, ok: true, created: true, opportunityId: 'newopp' })
  assert.equal(calls.create[0].monetaryValue, 77301)
  assert.equal(calls.alerts.length, 0)
})
