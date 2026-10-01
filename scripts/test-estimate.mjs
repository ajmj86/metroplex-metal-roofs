// Run: node --test scripts/test-estimate.mjs   (Node >= 22.18 strips TS types natively)
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { computeEstimate, isAreaInRange } from '../lib/estimate.ts'

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
