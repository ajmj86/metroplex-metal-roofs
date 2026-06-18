import data from '../../config/roofProducts.json';

export interface ColorOption {
  name: string;
  slug: string;
  sku: string | null;
  hex: string | null;
  image1: string | null;
  image2: string | null;
}

export interface ProductOption {
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

export interface RoofTypeEntry {
  label: string;
  manufacturer: string | null;
  styles: Record<string, StyleOption>;
  products: Record<string, ProductOption>;
}

export type RoofProductsConfig = Record<string, RoofTypeEntry>;

export const roofProducts = data as unknown as RoofProductsConfig;

export const ROOF_TYPE_ORDER = [
  'standing_seam',
  'copper_standing_seam',
  'r_panel',
  'stone_coated_steel',
] as const;

export interface RoofSelection {
  roofType: string;
  style: string | null;
  product: string | null;
  productLabel: string | null;
  color: string | null;
  colorImagePath: string | null;
}

export function getRoofTypeLabel(roofType: string): string {
  return roofProducts[roofType]?.label ?? roofType;
}

// Styles that have at least one product with at least one color populated.
export function stylesWithColors(roofType: string): Array<[string, StyleOption]> {
  const entry = roofProducts[roofType];
  if (!entry) return [];
  return Object.entries(entry.styles).filter(([styleKey]) =>
    Object.values(entry.products).some((p) => p.style === styleKey && p.colors.length > 0)
  );
}

export function productsForStyle(roofType: string, style: string): Array<[string, ProductOption]> {
  const entry = roofProducts[roofType];
  if (!entry) return [];
  return Object.entries(entry.products).filter(([, p]) => p.style === style);
}

// Resolves a selection of keys into the full RoofSelection shape, looking up
// productLabel/colorImagePath from the config rather than trusting client-supplied values.
export function resolveSelection(
  roofType: string,
  style: string | null,
  product: string | null,
  colorName: string | null
): RoofSelection {
  const entry = roofProducts[roofType];
  const productEntry = product && entry ? entry.products[product] : undefined;
  const colorEntry = productEntry && colorName
    ? productEntry.colors.find((c) => c.name === colorName)
    : undefined;

  return {
    roofType,
    style: style ?? null,
    product: product ?? null,
    productLabel: productEntry?.label ?? null,
    color: colorEntry?.name ?? null,
    colorImagePath: colorEntry?.image1 ?? null,
  };
}

export function getColorHex(roofType: string, product: string | null, colorName: string | null): string | null {
  const entry = roofProducts[roofType];
  const productEntry = product && entry ? entry.products[product] : undefined;
  const colorEntry = productEntry && colorName
    ? productEntry.colors.find((c) => c.name === colorName)
    : undefined;
  return colorEntry?.hex ?? null;
}

// Check if a roof type has exactly one style with exactly one product.
// Used to skip redundant Style/Product selection steps for simple roof types like Standing Seam.
export function hasExactlyOneProduct(roofType: string): boolean {
  const styles = stylesWithColors(roofType);
  if (styles.length !== 1) return false;
  const products = productsForStyle(roofType, styles[0][0]);
  return products.length === 1;
}

// Get the auto-selected style and product for roof types with exactly one.
export function getAutoSelectedStyleAndProduct(roofType: string): { style: string; product: string } | null {
  const styles = stylesWithColors(roofType);
  if (styles.length !== 1) return null;
  const styleKey = styles[0][0];
  const products = productsForStyle(roofType, styleKey);
  if (products.length !== 1) return null;
  return { style: styleKey, product: products[0][0] };
}
