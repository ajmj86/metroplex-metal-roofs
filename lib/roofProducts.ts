import data from '@/config/roofProducts.json';

export interface ColorOption {
  name: string;
  slug: string;
  hex: string | null;
  image1: string | null;
  image2: string | null;
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

export const ROOF_TYPE_ORDER = [
  'standing_seam',
  'copper_standing_seam',
  'r_panel',
  'stone_coated_steel',
] as const;

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

export function getAutoSelectedStyleAndProduct(roofType: string): { style: string; product: string } | null {
  const styles = stylesWithColors(roofType);
  if (styles.length !== 1) return null;
  const styleKey = styles[0][0];
  const products = productsForStyle(roofType, styleKey);
  if (products.length !== 1) return null;
  return { style: styleKey, product: products[0][0] };
}
