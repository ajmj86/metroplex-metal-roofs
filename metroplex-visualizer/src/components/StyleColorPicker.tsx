'use client';

import { useEffect, useState } from 'react';
import {
  ROOF_TYPE_ORDER,
  getRoofTypeLabel,
  stylesWithColors,
  productsForStyle,
  resolveSelection,
  hasExactlyOneProduct,
  getAutoSelectedStyleAndProduct,
  type RoofSelection,
} from '@/lib/roofProducts';

interface StyleColorPickerProps {
  onChange: (selection: RoofSelection, isComplete: boolean) => void;
}

function isComplete(roofType: string | null, style: string | null, product: string | null, color: string | null): boolean {
  if (!roofType) return false;
  
  // A selection is complete if we have a roof type and:
  // - if the roof type has styles, we need a style and product selected
  // - if the roof type requires color selection, we need a color
  const styles = stylesWithColors(roofType);
  
  // If no styles available for this roof type, just having the roof type is enough
  if (styles.length === 0) return true;
  
  // If styles are available, we need style, product, and color
  return style !== null && product !== null && color !== null;
}

export function StyleColorPicker({ onChange }: StyleColorPickerProps) {
  const [roofType, setRoofType] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const products = roofType && style ? productsForStyle(roofType, style) : [];
  const hasStyles = roofType ? stylesWithColors(roofType).length > 0 : false;

  useEffect(() => {
    const selection = resolveSelection(roofType ?? '', style, product, color);
    onChange(selection, isComplete(roofType, style, product, color));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roofType, style, product, color]);

  const colors = roofType && product ? productsForStyle(roofType, style ?? '').find(([key]) => key === product)?.[1].colors ?? [] : [];

  return (
    <div className="space-y-5">
      {/* Roof type */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Roof Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {ROOF_TYPE_ORDER.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => {
                // Reset all dependent state in the same batch to prevent an intermediate
                // render with stale product/color, which causes scroll jump + button flash.
                setStyle(null);
                setProduct(null);
                setColor(null);
                setRoofType(rt);

                if (hasExactlyOneProduct(rt)) {
                  const autoSelected = getAutoSelectedStyleAndProduct(rt);
                  if (autoSelected) {
                    setStyle(autoSelected.style);
                    setProduct(autoSelected.product);
                    const autoColors =
                      productsForStyle(rt, autoSelected.style).find(([key]) => key === autoSelected.product)?.[1].colors ?? [];
                    if (autoColors.length === 1) {
                      setColor(autoColors[0].name);
                    }
                  }
                }
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                roofType === rt
                  ? 'border-accent bg-accent/10 text-foreground'
                  : 'border-border bg-background text-muted hover:border-accent/40 hover:text-foreground'
              }`}
            >
              <span className="text-sm font-medium">{getRoofTypeLabel(rt)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Placeholder for roof types without color data */}
      {roofType && !hasStyles && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted text-sm">Color options coming soon — we&apos;ll confirm material and color during your consultation.</p>
        </div>
      )}

      {/* Style sub-options (shown only for roof types with multiple styles) */}
      {roofType && hasStyles && !hasExactlyOneProduct(roofType) && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Style</h3>
          <div className="grid grid-cols-2 gap-3">
            {stylesWithColors(roofType).map(([styleKey, styleOpt]) => (
              <button
                key={styleKey}
                type="button"
                onClick={() => {
                  // Reset dependent state in the same batch to prevent scroll jump.
                  setProduct(null);
                  setColor(null);
                  setStyle(styleKey);

                  const styleProducts = productsForStyle(roofType!, styleKey);
                  if (styleProducts.length === 1) {
                    setProduct(styleProducts[0][0]);
                    const autoColors = styleProducts[0][1].colors ?? [];
                    if (autoColors.length === 1) {
                      setColor(autoColors[0].name);
                    }
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  style === styleKey
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border bg-background text-muted hover:border-accent/40 hover:text-foreground'
                }`}
              >
                <span className="text-sm font-medium">{styleOpt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product cards — only shown when a style has more than one product */}
      {roofType && hasStyles && style && products.length > 1 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map(([productKey, productOpt]) => (
              <button
                key={productKey}
                type="button"
                onClick={() => setProduct(productKey)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  product === productKey
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border bg-background text-muted hover:border-accent/40 hover:text-foreground'
                }`}
              >
                <div className="text-sm font-medium mb-1">{productOpt.label}</div>
                <div className="text-xs text-muted leading-relaxed">{productOpt.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color swatches (shown when we have a valid selection) */}
      {roofType && hasStyles && product && colors.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={`rounded-xl border overflow-hidden text-left transition-all ${
                  color === c.name
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-background hover:border-accent/40'
                }`}
              >
                {c.image1 && (
                  <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
                    <img src={c.image1} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="px-3 py-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground leading-tight">{c.name}</span>
                  {colors.length === 1 && (
                    <span className="text-xs text-accent font-medium shrink-0">✓ Selected</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
