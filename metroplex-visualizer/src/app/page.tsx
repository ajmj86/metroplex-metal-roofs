'use client';

import { useState } from 'react';
import { StepOne } from '@/components/StepOne';
import { StepTwo } from '@/components/StepTwo';
import { StepThree } from '@/components/StepThree';
import type { ImageSource, LeadData } from '@/types';

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState('');
  const [streetviewImageUrl, setStreetviewImageUrl] = useState('');
  const [satelliteImageUrl, setSatelliteImageUrl] = useState('');
  const [roofType, setRoofType] = useState('');
  const [color, setColor] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [satelliteRenderUrl, setSatelliteRenderUrl] = useState('');
  const [streetviewRenderUrl, setStreetviewRenderUrl] = useState<string | null>(null);
  const [streetviewMaskValidation, setStreetviewMaskValidation] = useState<any>(null);

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground tracking-wide mb-1">
            Metal Roof Visualizer
          </h1>
          <p className="text-muted text-sm">See your home transformed before you commit</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s === step
                    ? 'bg-accent text-background'
                    : s < step
                    ? 'bg-accent/30 text-accent'
                    : 'bg-card text-muted border border-border'
                }`}
              >
                {s < step ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 3 && (
                <div className={`w-16 sm:w-24 h-px mx-1 transition-colors ${s < step ? 'bg-accent/40' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <StepOne
            onComplete={(addr, streetviewUrl, satelliteUrl) => {
              setAddress(addr);
              setStreetviewImageUrl(streetviewUrl);
              setSatelliteImageUrl(satelliteUrl);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepTwo
            streetviewImageUrl={streetviewImageUrl}
            satelliteImageUrl={satelliteImageUrl}
            address={address}
            onComplete={(rt, c, ch, satRender, svRender, maskVal) => {
              setRoofType(rt);
              setColor(c);
              setColorHex(ch);
              setSatelliteRenderUrl(satRender);
              setStreetviewRenderUrl(svRender);
              setStreetviewMaskValidation(maskVal);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <StepThree
            satelliteBeforeUrl={satelliteImageUrl}
            satelliteAfterUrl={satelliteRenderUrl}
            streetviewBeforeUrl={streetviewImageUrl}
            streetviewAfterUrl={streetviewRenderUrl}
            streetviewMaskValidation={streetviewMaskValidation}
            address={address}
            roofType={roofType}
            color={color}
          />
        )}

      </div>
    </main>
  );
}
