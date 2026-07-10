/*
 * PLACEHOLDER palette — replace with confirmed manufacturer chart.
 *
 * Names below are derived from the image filenames in public/products/**
 * and have NOT been verified against an official manufacturer color chart.
 * Swap the entries here (names, hexes, image order) without touching the
 * Homepage.jsx JSX.
 */

const P = (dir, file) => `/products/${dir}/${file}`;

/* ── Standing Seam (steel) — public/products/standing_seam ── */
export const STANDING_SEAM_COLORS = [
  { name: "Bone White",    src: P("standing_seam", "bone-white.jpg") },
  { name: "Bronze",        src: P("standing_seam", "bronze.jpg") },
  { name: "Burgundy",      src: P("standing_seam", "burgundy.jpg") },
  { name: "Charcoal Gray", src: P("standing_seam", "charcoal-gray.jpg") },
  { name: "Forest Green",  src: P("standing_seam", "forest-green.jpg") },
  { name: "True Black",    src: P("standing_seam", "true-black.jpg") },
];

/* ── R-Panel (steel) — public/products/r_panel ── */
export const R_PANEL_COLORS = [
  { name: "Bone White",    src: P("r_panel", "bone-white.jpg") },
  { name: "Bronze",        src: P("r_panel", "bronze.jpg") },
  { name: "Burgundy",      src: P("r_panel", "burgundy.jpg") },
  { name: "Charcoal Gray", src: P("r_panel", "charcoal-gray.jpg") },
  { name: "Forest Green",  src: P("r_panel", "forest-green.jpg") },
  { name: "True Black",    src: P("r_panel", "true-black.jpg") },
];

/*
 * ── Stone-Coated Steel — spans 4 source folders / 5 product lines.
 * Each item carries `profile` (Barrel / Shake / Shingle, used to group the
 * swatch modal) and `product` (the specific product line, shown in the
 * modal footer alongside the color name).
 */
export const STONE_COLORS = [
  // Barrel — Barrel Vault Tile (public/products/high-barrel/barrel-vault-tile)
  { name: "Barcelona",   src: P("high-barrel/barrel-vault-tile", "barcelona-1.jpg"),   profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Barclay",     src: P("high-barrel/barrel-vault-tile", "barclay-1.jpg"),     profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Charcoal",    src: P("high-barrel/barrel-vault-tile", "charcoal-1.jpg"),    profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Dover",       src: P("high-barrel/barrel-vault-tile", "dover-1.jpg"),       profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Santa Fe",    src: P("high-barrel/barrel-vault-tile", "santa-fe-1.jpg"),    profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Spanish Red", src: P("high-barrel/barrel-vault-tile", "spanish-red-1.jpg"), profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Sunset Gold", src: P("high-barrel/barrel-vault-tile", "sunset-gold-1.jpg"), profile: "Barrel", product: "Barrel Vault Tile" },
  { name: "Timberwood",  src: P("high-barrel/barrel-vault-tile", "timberwood-1.jpg"),  profile: "Barrel", product: "Barrel Vault Tile" },

  // Barrel — Pacific Tile (public/products/low-barrel/pacific-tile)
  { name: "Barclay",       src: P("low-barrel/pacific-tile", "barclay-1.jpg"),       profile: "Barrel", product: "Pacific Tile" },
  { name: "Charcoal",      src: P("low-barrel/pacific-tile", "charcoal-1.jpg"),      profile: "Barrel", product: "Pacific Tile" },
  { name: "Harborwood",    src: P("low-barrel/pacific-tile", "harborwood-1.jpg"),    profile: "Barrel", product: "Pacific Tile" },
  { name: "Sage Green",    src: P("low-barrel/pacific-tile", "sage-green-1.jpg"),    profile: "Barrel", product: "Pacific Tile" },
  { name: "Spanish Red",   src: P("low-barrel/pacific-tile", "spanish-red-1.jpg"),   profile: "Barrel", product: "Pacific Tile" },
  { name: "Stirling Gray", src: P("low-barrel/pacific-tile", "stirling-gray-1.jpg"), profile: "Barrel", product: "Pacific Tile" },
  { name: "Timberwood",    src: P("low-barrel/pacific-tile", "timberwood-1.jpg"),    profile: "Barrel", product: "Pacific Tile" },

  // Shake — Pine-Crest Shake (public/products/shake/pine-crest-shake)
  { name: "Barclay",       src: P("shake/pine-crest-shake", "barclay-1.jpg"),     profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Charcoal",      src: P("shake/pine-crest-shake", "charcoal-1.jpg"),    profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Dover",         src: P("shake/pine-crest-shake", "dover-1.jpg"),       profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Gold River",    src: P("shake/pine-crest-shake", "gold-river-1.jpg"),  profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Harborwood",    src: P("shake/pine-crest-shake", "harborwood-1.jpg"),  profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Ironwood",      src: P("shake/pine-crest-shake", "ironwood-1.jpg"),    profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Sage Green",    src: P("shake/pine-crest-shake", "sage-green-1.jpg"),  profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Stirling Gray", src: P("shake/pine-crest-shake", "stirling-gray-1.jpg"), profile: "Shake", product: "Pine-Crest Shake" },
  { name: "Timberwood",    src: P("shake/pine-crest-shake", "timberwood-1.jpg"),  profile: "Shake", product: "Pine-Crest Shake" },

  // Shingle — Cottage Shingle (public/products/shingle/cottage-shingle)
  { name: "Barclay HD",    src: P("shingle/cottage-shingle", "barclay-hd-1.jpg"),    profile: "Shingle", product: "Cottage Shingle" },
  { name: "Charcoal HD",   src: P("shingle/cottage-shingle", "charcoal-hd-1.jpg"),   profile: "Shingle", product: "Cottage Shingle" },
  { name: "Ironwood HD",   src: P("shingle/cottage-shingle", "ironwood-hd-1.jpg"),   profile: "Shingle", product: "Cottage Shingle" },
  { name: "Timberwood HD", src: P("shingle/cottage-shingle", "timberwood-hd-1.jpg"), profile: "Shingle", product: "Cottage Shingle" },

  // Shingle — Granite Ridge Shingle (public/products/shingle/granite-ridge-shingle)
  { name: "Barclay",    src: P("shingle/granite-ridge-shingle", "barclay-1.jpg"),    profile: "Shingle", product: "Granite Ridge Shingle" },
  { name: "Charcoal",   src: P("shingle/granite-ridge-shingle", "charcoal-1.jpg"),   profile: "Shingle", product: "Granite Ridge Shingle" },
  { name: "Ironwood",   src: P("shingle/granite-ridge-shingle", "ironwood-1.jpg"),   profile: "Shingle", product: "Granite Ridge Shingle" },
  { name: "Sage Green", src: P("shingle/granite-ridge-shingle", "sage-green-1.jpg"), profile: "Shingle", product: "Granite Ridge Shingle" },
  { name: "Timberwood", src: P("shingle/granite-ridge-shingle", "timberwood-1.jpg"), profile: "Shingle", product: "Granite Ridge Shingle" },
];

/*
 * ── Stone drill-down tiles ──
 * Level 1 (STONE_PROFILE_TILES): 4 tiles shown in the swatch row. Three
 * (`product` set) open straight to that product line's colors; "shingle"
 * has no `product` of its own — clicking it drills into level 2 instead.
 * Level 2 (STONE_SHINGLE_TILES): the two shingle product lines, shown only
 * after the "shingle" tile is picked.
 * `previewProduct`/`previewName` pick which STONE_COLORS entry supplies the
 * tile's thumbnail photo (defaults to the tile's own `product`/`previewName`).
 */
export const STONE_PROFILE_TILES = [
  { key: "high-barrel", label: "Barrel-Vault Tile", product: "Barrel Vault Tile", previewName: "Timberwood" },
  { key: "low-barrel",  label: "Pacific Tile",       product: "Pacific Tile",     previewName: "Timberwood" },
  { key: "shake",       label: "Pine-Crest Shake",   product: "Pine-Crest Shake", previewName: "Timberwood" },
  { key: "shingle",     label: "Shingle",            product: null, previewProduct: "Granite Ridge Shingle", previewName: "Timberwood" },
];
export const STONE_SHINGLE_TILES = [
  { key: "cottage-shingle",       label: "Cottage Shingle",        product: "Cottage Shingle",       previewName: "Timberwood HD" },
  { key: "granite-ridge-shingle", label: "Granite-Ridge Shingle",  product: "Granite Ridge Shingle", previewName: "Timberwood" },
];

/*
 * ── Copper — no color swatch photography exists (copper is one material
 * that patinas over time, not a color chart). The row shows 3 flat chips
 * standing in for the patina stages; the modal shows a gradient timeline
 * instead of a photo grid. Hex values are placeholders pending a real
 * patina reference.
 */
export const COPPER_PATINA_CHIPS = [
  { name: "Bright Penny", hex: "#B87333" },
  { name: "Deep Bronze",  hex: "#6E4A2E" },
  { name: "Verdigris",    hex: "#43B3AE" },
];

/* Install photos used as supporting thumbnails in the copper modal. */
export const COPPER_INSTALL_PHOTOS = [
  { name: "Natural Copper",        src: P("copper_standing_seam", "natural-copper.jpg") },
  { name: "Copper Standing Seam",  src: P("copper_standing_seam", "copper-standing-seam-2.jpg") },
  { name: "Copper Standing Seam",  src: P("copper_standing_seam", "copper-standing-seam-3.jpg") },
  { name: "Copper Standing Seam",  src: P("copper_standing_seam", "copper-standing-seam-4.jpg") },
];

export const PRODUCT_COLORS = {
  standing: STANDING_SEAM_COLORS,
  rpanel: R_PANEL_COLORS,
  stone: STONE_COLORS,
};
