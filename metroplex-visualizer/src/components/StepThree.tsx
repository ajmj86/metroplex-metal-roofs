'use client';

import { getRoofTypeLabel, type RoofSelection } from '@/lib/roofProducts';

function getMainSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_MAIN_SITE_URL;
  if (!url) {
    console.warn('[StepThree] NEXT_PUBLIC_MAIN_SITE_URL is not set — falling back to http://localhost:3000');
    return 'http://localhost:3000';
  }
  return url;
}

const MAIN_SITE_URL = getMainSiteUrl();

interface StepThreeProps {
  address: string;
  selection: RoofSelection;
  image: string;
  streetViewAvailable: boolean;
}

function buildEstimateUrl(selection: RoofSelection, address: string): string {
  const params = new URLSearchParams();
  params.set('roofType', selection.roofType);
  if (selection.style) params.set('style', selection.style);
  if (selection.product) params.set('product', selection.product);
  if (selection.color) params.set('color', selection.color);
  if (address) params.set('address', address);
  return `${MAIN_SITE_URL}/estimate?${params.toString()}`;
}

export function StepThree({ address, selection, image, streetViewAvailable }: StepThreeProps) {
  const roofTypeLabel = getRoofTypeLabel(selection.roofType);
  const estimateUrl = buildEstimateUrl(selection, address);

  const caption =
    selection.productLabel && selection.color
      ? `Your New Roof: ${selection.productLabel} in ${selection.color}`
      : `Your New Roof: ${roofTypeLabel}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-foreground mb-2">Your New Roof</h2>
        <p className="text-muted">
          <span className="font-medium">{roofTypeLabel}</span>
          {selection.productLabel && selection.color && (
            <>
              <span> — </span>
              <span className="font-medium">{selection.productLabel}</span>
              <span> in </span>
              <span className="font-medium">{selection.color}</span>
            </>
          )}
        </p>
        <p className="text-muted text-sm mt-2">{address}</p>
      </div>

      {/* Combined render — single full-width image */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground mb-4">{caption}</h3>
        <div className="rounded-lg overflow-hidden">
          <img src={image} alt={caption} className="w-full h-auto block" />
        </div>
        <p className="font-body text-xs text-muted mt-4 leading-relaxed">
          Renderings are AI-generated for illustration purposes. Final color and material will be confirmed during your in-home consultation.
        </p>
      </div>

      {/* Get Your Estimate CTA */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Love your new roof?</h3>
        <p className="text-muted text-sm mb-4">Get a real price estimate for this roof type in just a couple minutes.</p>
        <a
          href={estimateUrl}
          className="inline-flex items-center justify-center px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
        >
          Get Your Estimate →
        </a>
      </div>
    </div>
  );
}
