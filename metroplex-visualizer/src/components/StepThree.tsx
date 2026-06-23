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

export function StepThree({ address, selection, image, streetViewAvailable, leadInfo }: StepThreeProps) {
  const roofTypeLabel = getRoofTypeLabel(selection.roofType);
  const [estimateRequested, setEstimateRequested] = useState(false);
  const [submittingEstimate, setSubmittingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const handleGetEstimate = async () => {
    setSubmittingEstimate(true);
    setEstimateError(null);
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
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setEstimateRequested(true);
    } catch {
      setEstimateError('Something went wrong. Please try again.');
    } finally {
      setSubmittingEstimate(false);
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
        {estimateRequested ? (
          <>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">You're all set!</h3>
            <p className="text-muted text-sm">A team member will follow up with your estimate shortly.</p>
          </>
        ) : (
          <>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Love your new roof?</h3>
            <p className="text-muted text-sm mb-4">Get a real price estimate for this roof type in just a couple minutes.</p>
            <button
              type="button"
              onClick={handleGetEstimate}
              disabled={submittingEstimate}
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {submittingEstimate ? 'Submitting…' : 'Get Your Estimate →'}
            </button>
            {estimateError && <p className="text-red-500 text-sm mt-3">{estimateError}</p>}
          </>
        )}
      </div>
    </div>
  );
}
