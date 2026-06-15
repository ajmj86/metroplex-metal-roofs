'use client';

import { useState } from 'react';
import { ROOF_TYPES, COLORS } from '@/types';

interface StepTwoProps {
  satelliteImageUrl: string;
  address: string;
  onComplete: (
    roofType: string,
    color: string,
    colorHex: string
  ) => void;
}

export function StepTwo({ satelliteImageUrl, address, onComplete }: StepTwoProps) {
  const [selectedRoofType, setSelectedRoofType] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedColorHex, setSelectedColorHex] = useState('');

  const isValid = selectedRoofType && selectedColor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onComplete(selectedRoofType, selectedColor, selectedColorHex);
  };

  return (
    <div className="space-y-5">
      {/* Satellite image preview */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="relative" style={{ aspectRatio: '8 / 5' }}>
          <img
            src={satelliteImageUrl}
            alt={`Satellite view of ${address}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-foreground text-xs px-2.5 py-1 rounded-full">
            Satellite View
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-muted text-sm truncate">{address}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Roof type */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Roof Style</h3>
          <div className="grid grid-cols-2 gap-3">
            {ROOF_TYPES.map((rt) => (
              <button
                key={rt.id}
                type="button"
                onClick={() => setSelectedRoofType(rt.label)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedRoofType === rt.label
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border bg-background text-muted hover:border-accent/40 hover:text-foreground'
                }`}
              >
                <span className="text-sm font-medium">{rt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Roof Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedColor(c.label);
                  setSelectedColorHex(c.hex);
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all ${
                  selectedColor === c.label
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-background hover:border-accent/40'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-white/10"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs text-foreground leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-accent text-background font-semibold py-4 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {!isValid ? 'Select roof style and color' : 'Continue to Lead Form →'}
        </button>
      </form>
    </div>
  );
}
