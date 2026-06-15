'use client';

import { useState, useRef } from 'react';
import type { ImageSource, LeadData } from '@/types';
import { ROOF_TYPES, COLORS } from '@/types';

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
  const [lead, setLead] = useState<LeadData>({
    name: '', phone: '', email: '', smsConsent: false, emailConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [renderError, setRenderError] = useState('');
  const leadSentRef = useRef(false);

  const isValid =
    selectedRoofType && selectedColor && lead.name.trim() && lead.phone.trim() && lead.email.trim();

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
    await postToGHL();
    await callRender();
  };

  const handleRetry = async () => {
    await callRender();
  };

  const loading = status === 'submitting';

  return (
    <div className="space-y-5">

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

        {/* Lead capture */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
            Your Information
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              required
              disabled={loading}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm disabled:opacity-50"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              required
              disabled={loading}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm disabled:opacity-50"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              required
              disabled={loading}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm disabled:opacity-50"
            />

            {/* A2P-compliant consent checkboxes */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lead.smsConsent}
                  onChange={(e) => setLead({ ...lead, smsConsent: e.target.checked })}
                  disabled={loading}
                  className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                />
                <span className="text-xs text-muted leading-relaxed">
                  I agree to receive SMS text messages from Metroplex Metal Roofs about my roofing
                  estimate and project updates. Message &amp; data rates may apply. Message frequency
                  varies. Reply STOP to opt out or HELP for help.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lead.emailConsent}
                  onChange={(e) => setLead({ ...lead, emailConsent: e.target.checked })}
                  disabled={loading}
                  className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                />
                <span className="text-xs text-muted leading-relaxed">
                  I agree to receive email communications from Metroplex Metal Roofs including
                  quotes, promotions, and project updates. You may unsubscribe at any time.
                </span>
              </label>
            </div>

            <p className="text-xs text-muted pt-1 leading-relaxed">
              Consent is not a condition of purchasing any goods or services.{' '}
              <a href="/privacy" target="_blank" className="text-accent hover:underline">Privacy Policy</a>
              {' · '}
              <a href="/terms" target="_blank" className="text-accent hover:underline">Terms of Service</a>
            </p>
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
          disabled={loading || !isValid}
          className="w-full bg-accent text-background font-semibold py-4 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Generating your visualization&hellip;
            </span>
          ) : (
            'Visualize My New Roof →'
          )}
        </button>

      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
