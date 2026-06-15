'use client';

import { useState } from 'react';
import { StepOne } from '@/components/StepOne';
import { StepTwo } from '@/components/StepTwo';
import { StepThree } from '@/components/StepThree';
import { LeadForm } from '@/components/LeadForm';

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState('');
  const [satelliteImageUrl, setSatelliteImageUrl] = useState('');
  const [roofType, setRoofType] = useState('');
  const [color, setColor] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [satelliteRenderUrl, setSatelliteRenderUrl] = useState('');
  const [isRendering, setIsRendering] = useState(false);

  // Handler when form in Step 3 completes
  const handleLeadFormComplete = async (formData: any) => {
    setIsRendering(true);
    try {
      // Call /api/render with satellite image only
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          satelliteImageUrl,
          roofType,
          color: color,
          colorHex,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Rendering failed. Please try again.');
      }

      const data = await res.json();
      setSatelliteRenderUrl(data.satellite.render);

      // Post to GHL
      const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.firstName || '',
            phone: formData.phone || '',
            email: formData.email || '',
            address,
            roofType,
            color,
            smsConsent: true,
            emailConsent: false,
            imageSource: 'satellite',
            timestamp: new Date().toISOString(),
            source: 'visualizer',
          }),
        }).catch(() => {
          // Non-blocking GHL failure
        });
      }

      // Move to results
      setStep(4);
    } catch (err) {
      console.error('Render error:', err);
      alert(err instanceof Error ? err.message : 'Rendering failed. Please try again.');
    } finally {
      setIsRendering(false);
    }
  };

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

        {/* Step indicator (4 steps now) */}
        <div className="flex items-center justify-center mb-8">
          {([1, 2, 3, 4] as const).map((s) => (
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
              {s < 4 && (
                <div className={`w-16 sm:w-24 h-px mx-1 transition-colors ${s < step ? 'bg-accent/40' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <StepOne
            onComplete={(addr, satelliteUrl) => {
              setAddress(addr);
              setSatelliteImageUrl(satelliteUrl);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepTwo
            satelliteImageUrl={satelliteImageUrl}
            address={address}
            onComplete={(rt, c, ch) => {
              setRoofType(rt);
              setColor(c);
              setColorHex(ch);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Lead Information
            </h2>
            <LeadForm
              address={address}
              onComplete={handleLeadFormComplete}
            />
          </div>
        )}

        {step === 4 && (
          <StepThree
            satelliteOriginalUrl={satelliteImageUrl}
            satelliteRenderUrl={satelliteRenderUrl}
            address={address}
            roofType={roofType}
            color={color}
          />
        )}

      </div>
    </main>
  );
}
