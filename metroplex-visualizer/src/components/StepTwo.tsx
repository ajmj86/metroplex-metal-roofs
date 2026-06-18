'use client';

import { useState } from 'react';
import { StyleColorPicker } from '@/components/StyleColorPicker';
import type { RoofSelection } from '@/lib/roofProducts';

interface StepTwoProps {
  streetviewImageUrl?: string;
  satelliteImageUrl: string;
  address: string;
  onComplete: (selection: RoofSelection) => void;
}

export function StepTwo({ streetviewImageUrl, satelliteImageUrl, address, onComplete }: StepTwoProps) {
  const [selection, setSelection] = useState<RoofSelection | null>(null);
  const [ready, setReady] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection || !ready) return;
    onComplete(selection);
  };

  return (
    <div className="space-y-5">
      {/* Satellite image preview */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="relative" style={{ aspectRatio: '8 / 5' }}>
          <img
            src={streetviewImageUrl || satelliteImageUrl}
            alt={`Satellite view of ${address}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-foreground text-xs px-2.5 py-1 rounded-full">
            {streetviewImageUrl ? 'Street View' : 'Satellite View'}
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-muted text-sm truncate">{address}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <StyleColorPicker
          onChange={(sel, isComplete) => {
            setSelection(sel);
            setReady(isComplete);
          }}
        />

        <button
          type="submit"
          disabled={!ready}
          className="w-full bg-accent text-background font-semibold py-4 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {!ready ? 'Select your roof type to continue' : 'Get My Free Visualization →'}
        </button>
      </form>
    </div>
  );
}
