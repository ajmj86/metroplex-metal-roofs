// Full Brava synthetic slate/tile color catalog. As of Phase 12 this same
// data (plus real photography, Slate's Standard/Multi-Width variants, and
// visualizer-specific fields like widthVariants) lives in
// config/roofProducts.json under the "synthetic_slate" roofType -- that's
// the source of truth for the actual visualizer now. This file stays in
// use for /synthetic-slate-roofing's marketing copy (representative color
// mentions), which doesn't need photography or width variants, just the
// name + premiumBlend list -- not worth re-deriving from the bigger config
// shape for that one purpose.
export interface BravaColor {
  name: string
  // Brava's "Premium Blend" tier -- a subset of colors carrying a different
  // price point than the standard line, per Brava's own product catalog.
  premiumBlend: boolean
}

export interface BravaProfile {
  key: string
  name: string
  colors: BravaColor[]
}

const c = (name: string, premiumBlend = false): BravaColor => ({ name, premiumBlend })

export const BRAVA_PROFILES: BravaProfile[] = [
  {
    key: 'spanish-barrel-tile',
    name: 'Brava Spanish Barrel Tile',
    colors: [
      c('Aged Mission'), c('Antique Clay'), c('Arendale'), c('Black Brown Blend'),
      c('Graphite'), c('Onyx'), c('Terra Cotta Brown'), c('Tuscan Clay'), c('Vintage Terra Cotta'),
      c('Autumn', true), c('Mediterranean', true), c('Pine Green', true), c('Sandstone', true), c('White Spanish Barrel', true),
    ],
  },
  {
    key: 'cedar-shake',
    name: 'Brava Cedar Shake',
    colors: [
      c('Aged Cedar'), c('Aspen'), c('Beechwood'), c('Canyon Gray'), c('Lake Forest'), c('Natural Cedar'), c('Weathered'),
      c('Arendale', true), c('Light Arendale', true), c('New Cedar', true), c('Onyx', true), c('White', true),
    ],
  },
  {
    key: 'slate',
    name: 'Brava Slate',
    // Corrected in Phase 12 against Brava's own product photos (each
    // Premium Blend photo carries a visible "Premium" badge) -- Victorian
    // has no badge (moved out of premiumBlend) and White does (moved in).
    // Every other color in this file matched the photographic evidence
    // exactly; this was the one real correction across all 39 colors.
    colors: [
      c('Arendale'), c('Atlantic'), c('Cottage'), c('Graphite'), c('Light Arendale'), c('Onyx'), c('Washington'), c('Victorian'),
      c('Sandstone', true), c('European', true), c('Pine Green', true), c('Tuscan Clay', true), c('White', true),
    ],
  },
]
