'use client';

import { useState } from 'react';
import { getRoofTypeLabel, type RoofSelection } from '@/lib/roofProducts';

export interface LeadInfo {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  reason?: string;
  insuranceClaim?: string;
  timeline?: string;
}

interface StepThreeProps {
  address: string;
  selection: RoofSelection;
  image: string;
  streetViewAvailable: boolean;
  leadInfo?: LeadInfo | null;
}

type EstimateState = 'idle' | 'loading' | 'success' | 'fallback' | 'error';

export function StepThree({ address, selection, image, streetViewAvailable, leadInfo }: StepThreeProps) {
  const roofTypeLabel = getRoofTypeLabel(selection.roofType);
  const [estimateState, setEstimateState] = useState<EstimateState>('idle');
  const [estimateResult, setEstimateResult] = useState<{ estimatedRoofSize: number; estimateRange: string } | null>(null);

  const handleGetEstimate = async () => {
    setEstimateState('loading');
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: leadInfo?.firstName,
          lastName: leadInfo?.lastName,
          phone: leadInfo?.phone,
          email: leadInfo?.email,
          address1: address,
          roofType: selection.roofType,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.estimatedRoofSize != null && data.estimateRange) {
        setEstimateResult({ estimatedRoofSize: data.estimatedRoofSize, estimateRange: data.estimateRange });
        setEstimateState('success');
      } else {
        setEstimateState('fallback');
      }
    } catch {
      setEstimateState('error');
    }
  };

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
        {estimateState === 'success' && estimateResult ? (
          <>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Your Estimated Price Range</h3>
            <p className="font-heading text-2xl font-semibold text-accent mb-2">{estimateResult.estimateRange}</p>
            <p className="text-muted text-sm">
              Based on an estimated roof size of {estimateResult.estimatedRoofSize} squares. A team member will follow up to confirm your final price.
            </p>
          </>
        ) : estimateState === 'fallback' ? (
          <>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">You're all set!</h3>
            <p className="text-muted text-sm">We weren't able to generate an instant estimate for this address, but a team member will follow up with your price range shortly.</p>
          </>
        ) : (
          <>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Love your new roof?</h3>
            <p className="text-muted text-sm mb-4">Get a real price estimate for this roof type in just a couple minutes.</p>
            <button
              type="button"
              onClick={handleGetEstimate}
              disabled={estimateState === 'loading'}
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {estimateState === 'loading' ? 'Calculating…' : 'Get Your Estimate →'}
            </button>
            {estimateState === 'error' && <p className="text-red-500 text-sm mt-3">Something went wrong. Please try again.</p>}
          </>
        )}
      </div>
    </div>
  );
}
