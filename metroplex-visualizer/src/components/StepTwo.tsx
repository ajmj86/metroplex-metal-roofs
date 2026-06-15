'use client';

import { useState, useRef } from 'react';
import type { ImageSource, LeadData } from '@/types';
import { ROOF_TYPES, COLORS } from '@/types';
import { LeadForm } from './LeadForm';

interface StepTwoProps {
  streetviewImageUrl: string;
  satelliteImageUrl: string;
  address: string;
  onComplete: (
    roofType: string,
    color: string,
    colorHex: string,
    satelliteRenderUrl: string,
    streetviewRenderUrl: string | null,
    streetviewMaskValidation: any
  ) => void;
}

const SOURCE_LABEL: Record<ImageSource, string> = {
  streetview: 'Street View',
  satellite: 'Satellite',
  upload: 'Uploaded',
};

export function StepTwo({ streetviewImageUrl, satelliteImageUrl, address, onComplete }: StepTwoProps) {
  const [selectedRoofType, setSelectedRoofType] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedColorHex, setSelectedColorHex] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lead, setLead] = useState<LeadData>({
    name: '', phone: '', email: '', smsConsent: false, emailConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [renderError, setRenderError] = useState('');
  const leadSentRef = useRef(false);

  const isValid =
    selectedRoofType && selectedColor;

  const postToGHL = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
    if (!webhookUrl || leadSentRef.current) return;
    leadSentRef.current = true;
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          address,
          roofType: selectedRoofType,
          color: selectedColor,
          smsConsent: lead.smsConsent,
          emailConsent: lead.emailConsent,
          imageSource: streetviewImageUrl ? 'streetview' : 'satellite',
          timestamp: new Date().toISOString(),
          source: 'visualizer',
        }),
      });
    } catch {
      // Non-blocking — GHL failure should not block the user experience
    }
  };

  const callRender = async () => {
    setStatus('submitting');
    setRenderError('');

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streetviewImageUrl,
          satelliteImageUrl,
          roofType: selectedRoofType,
          color: selectedColor,
          colorHex: selectedColorHex,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Rendering failed. Please try again.');
      }

      const data = await res.json();
      onComplete(
        selectedRoofType,
        selectedColor,
        selectedColorHex,
        data.satellite.render,
        data.streetview?.render || null,
        data.streetview?.maskValidation || null
      );
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : 'Rendering failed. Please try again.');
      setStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setShowLeadForm(true);
  };

  const handleLeadFormComplete = async (formData: any) => {
    // Update lead data from Heyflow form
    setLead({
      name: formData.firstName || '',
      phone: formData.phone || '',
      email: '', // Heyflow form doesn't capture email
      smsConsent: true, // Implied by completing form
      emailConsent: false,
    });
    
    // Post to GHL and trigger render
    await postToGHL();
    await callRender();
  };

  const handleRetry = async () => {
    await callRender();
  };

  const loading = status === 'submitting';

  return (
    <div className="space-y-5">
      {/* Show Heyflow lead form instead of inline form */}
      {showLeadForm ? (
        <LeadForm onComplete={handleLeadFormComplete} />
      ) : (
        <>
          {/* House image preview */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="relative" style={{ aspectRatio: '8 / 5' }}>
              <img
                src={streetviewImageUrl || satelliteImageUrl}
                alt={`View of ${address}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-foreground text-xs px-2.5 py-1 rounded-full">
                {streetviewImageUrl ? SOURCE_LABEL['streetview'] : SOURCE_LABEL['satellite']}
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
                    onClick={() => { setSelectedColor(c.label); setSelectedColorHex(c.hex); }}
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

            {/* Error + retry */}
            {status === 'error' && (
              <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4">
                <p className="text-red-400 text-sm mb-3">{renderError}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-sm text-accent hover:underline font-medium"
                >
                  Try again →
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-accent text-background font-semibold py-4 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {!isValid ? 'Select roof style and color' : 'Continue to Visualizer →'}
            </button>

          </form>
        </>
      )}
    </div>
  );
}
