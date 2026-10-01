// Run: node --test scripts/test-estimate.mjs   (Node >= 22.18 strips TS types natively)
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { computeEstimate, isAreaInRange, estimateForLead, squaresFromManualSqFt } from '../lib/estimate.ts'

const cfg = JSON.parse(readFileSync(new URL('../config/pricing.json', import.meta.url), 'utf8'))
const roofTypes = cfg.roofTypes
const r2 = (n) => Math.round(n * 100) / 100
const NET = 40

const CASES = [
  ['Stone-coated', 'stone_coated_steel', undefined, undefined, 70398.68, 76798.56],
  ['Standing seam metallic', 'standing_seam', 'Natural Metal', undefined, 57598.56, 62398.44],
  ['Standing seam other colors', 'standing_seam', 'Charcoal', undefined, 67198.56, 72798.44],
  ['R-panel', 'r_panel', undefined, undefined, 45598.56, 49398.44],
  ['Brava slate', 'synthetic_slate', undefined, 'slate', 89698.62, 95158.54],
  ['Brava shake', 'synthetic_slate', undefined, 'cedar_shake', 87398.62, 92718.54],
  ['Brava Spanish barrel', 'synthetic_slate', undefined, 'spanish_barrel_tile', 92044.62, 97647.34],
]

for (const [name, rt, color, style, low, high] of CASES) {
  test(`${name} @ ${NET} net squares`, () => {
    const r = computeEstimate(roofTypes, NET, rt, color, style)
    assert.equal(r.priced, true)
    assert.equal(r2(r.low), low)
    assert.equal(r2(r.high), high)
  })
}

test('Copper returns no estimate', () => {
  const r = computeEstimate(roofTypes, NET, 'copper_standing_seam')
  assert.deepEqual(r, { priced: false, reason: 'no_estimate' })
})

test('unknown / missing material does not produce NaN', () => {
  for (const rt of [undefined, '', 'nope']) {
    const r = computeEstimate(roofTypes, NET, rt)
    assert.equal(r.priced, false)
  }
  assert.equal(computeEstimate(roofTypes, NaN, 'r_panel').priced, false)
})

test('synthetic_slate with missing/unknown style falls back to default (slate) rate', () => {
  const base = computeEstimate(roofTypes, NET, 'synthetic_slate', undefined, 'slate')
  for (const st of [undefined, null, 'bogus']) {
    const r = computeEstimate(roofTypes, NET, 'synthetic_slate', undefined, st)
    assert.equal(r.priced && r.low, base.priced && base.low)
  }
})

test('every priced material has low < high, finite, at all manual-entry story sizes', () => {
  const multipliers = { one: 1.30, two: 0.80, unknown: 1.05 }
  const sqft = 2200
  const mats = [
    ['standing_seam', 'Natural Metal'], ['standing_seam', 'Charcoal'], ['r_panel'], ['stone_coated_steel'],
    ['synthetic_slate', undefined, 'slate'], ['synthetic_slate', undefined, 'cedar_shake'], ['synthetic_slate', undefined, 'spanish_barrel_tile'],
  ]
  for (const [rt, color, style] of mats) {
    for (const m of Object.values(multipliers)) {
      const r = computeEstimate(roofTypes, (sqft * m) / 100, rt, color, style)
      assert.equal(r.priced, true)
      assert.ok(Number.isFinite(r.low) && Number.isFinite(r.high) && r.low < r.high, `${rt}/${style} m=${m}`)
    }
  }
})

test('area gate: under 800 / over 8,000 sq ft is out of range', () => {
  const sqftToM2 = (f) => f / 10.7639
  assert.equal(isAreaInRange(sqftToM2(799)), false)
  assert.equal(isAreaInRange(sqftToM2(8010)), false)
  assert.equal(isAreaInRange(sqftToM2(800.5)), true)
  assert.equal(isAreaInRange(sqftToM2(7990)), true)
})

// ── Server-side lead recompute (opportunity value = low, whole dollars) ──
const LEAD_CASES = [
  ['stone-coated', { roofType: 'stone_coated_steel' }, 70399, 76799],
  ['standing seam metallic', { roofType: 'standing_seam', color: 'Natural Metal' }, 57599, 62398],
  ['standing seam other', { roofType: 'standing_seam', color: 'Charcoal' }, 67199, 72798],
  ['r-panel', { roofType: 'r_panel' }, 45599, 49398],
  ['brava slate', { roofType: 'synthetic_slate', style: 'slate' }, 89699, 95159],
  ['brava shake', { roofType: 'synthetic_slate', style: 'cedar_shake' }, 87399, 92719],
  ['brava spanish barrel', { roofType: 'synthetic_slate', style: 'spanish_barrel_tile' }, 92045, 97647],
]
for (const [name, inp, low, high] of LEAD_CASES) {
  test(`lead recompute: ${name} @ 40 net squares -> ${low}/${high}`, () => {
    const r = estimateForLead(roofTypes, { ...inp, netSquares: 40 })
    assert.deepEqual(r, { status: 'priced', low, high })
  })
}

test('lead recompute: copper -> none (custom quote), never a value', () => {
  assert.deepEqual(estimateForLead(roofTypes, { roofType: 'copper_standing_seam', netSquares: 40 }), { status: 'none' })
})

test('lead recompute: missing/invalid inputs -> unavailable, no NaN', () => {
  const bad = [
    { roofType: 'r_panel' }, // no squares
    { roofType: 'r_panel', netSquares: null },
    { roofType: 'r_panel', netSquares: NaN },
    { roofType: 'r_panel', netSquares: -5 },
    { roofType: 'r_panel', netSquares: 7 }, // < 800 sq ft
    { roofType: 'r_panel', netSquares: 81 }, // > 8,000 sq ft
    { roofType: 'r_panel', netSquares: 'abc' },
    { netSquares: 40 }, // no material
    { roofType: 'nope', netSquares: 40 },
    { roofType: 'r_panel', roofSizeSource: 'manual' },
    { roofType: 'r_panel', roofSizeSource: 'manual', manualSqFt: 0 },
    { roofType: 'r_panel', roofSizeSource: 'manual', manualSqFt: 1e9 },
  ]
  for (const b of bad) assert.deepEqual(estimateForLead(roofTypes, b), { status: 'unavailable' }, JSON.stringify(b))
})

test('lead recompute: manual path matches /api/roof-size manual math for all story options', () => {
  for (const stories of ['one', 'two', 'unknown', undefined]) {
    const r = estimateForLead(roofTypes, { roofType: 'r_panel', roofSizeSource: 'manual', manualSqFt: 2200, stories })
    const e = computeEstimate(roofTypes, squaresFromManualSqFt(2200, stories), 'r_panel')
    assert.equal(r.status, 'priced')
    assert.equal(r.low, Math.round(e.low))
    assert.ok(r.low < r.high)
  }
})

test('lead recompute: browser-supplied price fields are ignored', () => {
  const r = estimateForLead(roofTypes, { roofType: 'r_panel', netSquares: 40, estimateLow: 1, estimateHigh: 2 })
  assert.equal(r.low, 45599)
})
