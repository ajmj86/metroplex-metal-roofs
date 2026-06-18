import data from '@/config/roofProducts.json';

interface ProductOption {
  label: string;
}

interface RoofTypeEntry {
  label: string;
  products: Record<string, ProductOption>;
}

type RoofProductsConfig = Record<string, RoofTypeEntry>;

const roofProducts = data as unknown as RoofProductsConfig;

export function getProductLabel(roofType: string, product: string): string | null {
  return roofProducts[roofType]?.products?.[product]?.label ?? null;
}
