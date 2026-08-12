// Full Brava synthetic slate/tile color catalog, structured for reuse once
// these three profiles are wired into the roof visualizer (roofProducts.json
// style/product keys, swatch photography, etc. -- same shape convention as
// lib/productColors.js's flat color arrays, but kept in its own file since
// Brava isn't in the visualizer yet and this has no photography wired up).
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
    colors: [
      c('Arendale'), c('Atlantic'), c('Cottage'), c('Graphite'), c('Light Arendale'), c('Onyx'), c('Washington'), c('White'),
      c('Sandstone', true), c('European', true), c('Pine Green', true), c('Tuscan Clay', true), c('Victorian', true),
    ],
  },
]
