import data from '@/config/roofProducts.json';

export interface ColorOption {
  name: string;
  slug: string;
  hex: string | null;
  image1: string | null;
  image2: string | null;
  // Brava-specific: a "Premium Blend" color is genuinely multi-hue (several
  // distinct tones blended together), not just a lighter/darker single hue
  // with natural texture variation like the standard colors. Independent of
  // widthVariants below -- a color can be either, both, or neither.
  premiumBlend?: boolean;
  // Slate only, and only for colors where Brava's own photography actually
  // shows both variants (7 of 13 Slate colors -- checked directly, not
  // assumed). "Multi-Width" and "Standard" are Brava's own product
  // terminology (confirmed from the source comparison photo's own text
  // captions). image1 above still gets set to the standard variant's path
  // as a safe default for anything reading color.image1 directly without
  // being width-aware.
  widthVariants?: {
    standard: { image1: string };
    multi: { image1: string };
  };
}

export interface FullProductOption {
  label: string;
  style: string;
  slug: string;
  description: string;
  colors: ColorOption[];
}

export interface StyleOption {
  label: string;
  slug: string;
}

interface FullRoofTypeEntry {
  label: string;
  styles: Record<string, StyleOption>;
  products: Record<string, FullProductOption>;
}

type RoofProductsConfig = Record<string, FullRoofTypeEntry>;

const roofProducts = data as unknown as RoofProductsConfig;

// Deliberately left untouched (still metal-only, same 4 entries, same
// order) so the existing "Choose Your Material" grid and every metal render
// path stay byte-identical -- Synthetic Slate is additive, not merged in.
export const ROOF_TYPE_ORDER = [
  'standing_seam',
  'copper_standing_seam',
  'r_panel',
  'stone_coated_steel',
] as const;

export type MaterialType = 'metal' | 'synthetic_slate';

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  metal: 'Metal',
  synthetic_slate: 'Synthetic Slate',
};

// Which roofType keys belong to which top-level material group. Synthetic
// Slate has exactly one roofType today (all 3 Brava profiles live under it
// as styles, matching the existing stone_coated_steel style/product shape)
// -- kept as a real array rather than a single constant so a second
// synthetic-slate-family roofType could be added later without touching
// any selector logic.
export const MATERIAL_TYPE_GROUPS: Record<MaterialType, readonly string[]> = {
  metal: ROOF_TYPE_ORDER,
  synthetic_slate: ['synthetic_slate'],
};

export function getRoofTypeLabel(roofType: string): string {
  return roofProducts[roofType]?.label ?? roofType;
}

export function getProductLabel(roofType: string, product: string): string | null {
  return roofProducts[roofType]?.products?.[product]?.label ?? null;
}

export function stylesWithColors(roofType: string): Array<[string, StyleOption]> {
  const entry = roofProducts[roofType];
  if (!entry) return [];
  return Object.entries(entry.styles).filter(([styleKey]) =>
    Object.values(entry.products).some((p) => p.style === styleKey && p.colors.length > 0)
  );
}

export function productsForStyle(roofType: string, style: string): Array<[string, FullProductOption]> {
  const entry = roofProducts[roofType];
  if (!entry) return [];
  return Object.entries(entry.products).filter(([, p]) => p.style === style);
}

export function hasExactlyOneProduct(roofType: string): boolean {
  const styles = stylesWithColors(roofType);
  if (styles.length !== 1) return false;
  return productsForStyle(roofType, styles[0][0]).length === 1;
}

// True if ANY color in this style's product(s) has width-variant
// photography (Slate only, today). Gates the Width tier the same way
// hasExactlyOneProduct/getAutoSelectedStyleAndProduct gate the Product tier
// -- a boolean check on real data, not a hardcoded roofType/style name, so
// it stays correct if width variants are ever added elsewhere.
export function styleHasWidthVariants(roofType: string, style: string): boolean {
  return productsForStyle(roofType, style).some(([, p]) =>
    p.colors.some((c) => !!c.widthVariants)
  );
}

export type TileWidth = 'standard' | 'multi';

// Colors to actually show once a width is chosen: "multi" narrows to only
// the colors that have that variant (today, 7 of Slate's 13); "standard"
// (or no width chosen yet) shows every color in the product, since a color
// without widthVariants has no distinction to narrow by in the first place.
export function colorsForWidth(colors: ColorOption[], width: TileWidth | null): ColorOption[] {
  if (width === 'multi') return colors.filter((c) => !!c.widthVariants);
  return colors;
}

export function colorImageForWidth(color: ColorOption, width: TileWidth | null): string | null {
  if (width && color.widthVariants) return color.widthVariants[width].image1;
  return color.image1;
}

export function getAutoSelectedStyleAndProduct(roofType: string): { style: string; product: string } | null {
  const styles = stylesWithColors(roofType);
  if (styles.length !== 1) return null;
  const styleKey = styles[0][0];
  const products = productsForStyle(roofType, styleKey);
  if (products.length !== 1) return null;
  return { style: styleKey, product: products[0][0] };
}

export interface RoofSelection {
  roofType: string;
  style: string | null;
  product: string | null;
  productLabel: string | null;
  color: string | null;
  colorImagePath: string | null;
  premiumBlend: boolean;
  width: TileWidth | null;
}

export function resolveSelection(
  roofType: string,
  style: string | null,
  product: string | null,
  colorName: string | null,
  width: TileWidth | null = null
): RoofSelection {
  const entry = roofProducts[roofType];
  const productEntry = product && entry ? entry.products[product] : undefined;
  const colorEntry = productEntry && colorName
    ? productEntry.colors.find((c) => c.name === colorName)
    : undefined;
  // Only a real, meaningful width if this color actually has variants --
  // otherwise carrying a stale 'standard'/'multi' value forward into the
  // render prompt for a color with no such distinction would be misleading.
  const resolvedWidth = colorEntry?.widthVariants ? width : null;
  return {
    roofType,
    style: style ?? null,
    product: product ?? null,
    productLabel: productEntry?.label ?? null,
    color: colorEntry?.name ?? null,
    colorImagePath: colorEntry ? colorImageForWidth(colorEntry, resolvedWidth) : null,
    premiumBlend: colorEntry?.premiumBlend ?? false,
    width: resolvedWidth,
  };
}
