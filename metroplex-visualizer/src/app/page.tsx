'use client';

import { useEffect, useState } from 'react';
import { StepOne, type ParsedAddress } from '@/components/StepOne';
import { StepTwo } from '@/components/StepTwo';
import { StepThree, type LeadInfo } from '@/components/StepThree';
import { LeadForm } from '@/components/LeadForm';
import { ErrorState } from '@/components/ErrorState';
import { getRoofTypeLabel, type RoofSelection } from '@/lib/roofProducts';

console.log('[page] module evaluated — NEXT_PUBLIC_GHL_WEBHOOK_URL =', process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL);

const LOADING_MESSAGES = [
  'Generating your photorealistic roof preview…',
  'Analyzing your roofline and structure…',
  'Applying your selected style and color…',
  'Finishing touches — almost ready…',
  'Exceptional results are worth the wait…',
];

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState('');
  const [addressComponents, setAddressComponents] = useState<ParsedAddress | undefined>(undefined);
  const [satelliteImageUrl, setSatelliteImageUrl] = useState('');
  const [selection, setSelection] = useState<RoofSelection | null>(null);
  const [renderedImage, setRenderedImage] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [streetViewAvailable, setStreetViewAvailable] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [utmParams, setUtmParams] = useState<{ utmSource?: string; utmMedium?: string; utmCampaign?: string }>({});

  // Read UTM params from the page URL once on load
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setUtmParams({
      utmSource: sp.get('utm_source') ?? undefined,
      utmMedium: sp.get('utm_medium') ?? undefined,
      utmCampaign: sp.get('utm_campaign') ?? undefined,
    });
  }, []);

  // Cycles the render-loading message every 15s, holding on the last one —
  // resets/clears whenever isRendering flips off (success, error, or unmount).
  useEffect(() => {
    if (!isRendering) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i < LOADING_MESSAGES.length - 1 ? i + 1 : i));
    }, 15000);
    return () => clearInterval(interval);
  }, [isRendering]);

  // Handler when form in Step 3 completes
  const handleLeadFormComplete = async (formData: any) => {
    console.log('[page] handleLeadFormComplete called with:', formData, 'selection:', selection);
    setLeadInfo({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      reason: formData.reason,
      insuranceClaim: formData.insuranceClaim,
      timeline: formData.timeline,
    });
    if (!selection) {
      console.log('[page] bailing out: selection is null/undefined, render + GHL post will NOT run');
      return;
    }
    setIsRendering(true);
    setRenderError(null);
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          satelliteImageUrl,
          roofType: selection.roofType,
          style: selection.style,
          product: selection.product,
          color: selection.color,
        }),
      });

      console.log('[page] /api/render returned, status:', res.status, 'ok:', res.ok);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Rendering failed. Please try again.');
      }

      const data = await res.json();
      setRenderedImage(data.image);
      setStreetViewAvailable(data.streetViewAvailable ?? false);
      console.log('[page] render succeeded, proceeding to GHL post');

      // Post to GHL
      const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
      console.log('[page] NEXT_PUBLIC_GHL_WEBHOOK_URL =', webhookUrl);
      if (!webhookUrl) {
        console.warn('[page] NEXT_PUBLIC_GHL_WEBHOOK_URL is not set — skipping GHL webhook entirely. Set it in .env.local (see .env.example) and restart the dev server.');
      }
      if (webhookUrl) {
        const ghlPayload = {
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          phone: formData.phone || '',
          email: formData.email || '',
          address,
          roofType: getRoofTypeLabel(selection.roofType),
          productLabel: selection.productLabel,
          color: selection.color,
          smsConsent: true,
          emailConsent: false,
          imageSource: 'satellite',
          timestamp: new Date().toISOString(),
          source: 'visualizer',
          contact: {
            property_address: address,
            address1: addressComponents?.address1 ?? '',
            city: addressComponents?.city ?? '',
            state: addressComponents?.state ?? '',
            postalCode: addressComponents?.postalCode ?? '',
            current_roof_type: formData.roofType,
            project_reason: formData.reason,
            insurance_claim_status: formData.insuranceClaim,
            homeowner_timeline: formData.timeline,
            lead_source: 'Visualizer',
          },
          customField: [
            { id: 'pOqyjdxOHg67C4JWdkaG', value: 'Visualizer' },
            { id: 'Vo7YnqmuZnhV2U66uKJA', value: formData.roofType },
            { id: 'prLMUoMzKClcfmBzDH3R', value: formData.reason },
            { id: 'tpAq0AZMqWJZeTy3dPsS', value: formData.insuranceClaim },
            { id: '7F3CKSSVRj7jdHKoq87X', value: formData.timeline },
            { id: 'acFCeylcy8uhep3stymL', value: address },
            ...(utmParams.utmSource ? [{ id: 'NNZiielScQomx8VDF7q8', value: utmParams.utmSource }] : []),
            ...(utmParams.utmMedium ? [{ id: 'ELW45zGCkwQkpUV2TnEW', value: utmParams.utmMedium }] : []),
            ...(utmParams.utmCampaign ? [{ id: 'VrI3HZtaymdTdf0lggfD', value: utmParams.utmCampaign }] : []),
          ],
        };
        console.log('GHL webhook payload (visualizer):', ghlPayload);
        try {
          const ghlRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghlPayload),
          });
          console.log('[page] GHL webhook response status:', ghlRes.status);
        } catch (ghlErr) {
          console.error('[page] GHL webhook fetch failed (non-blocking):', ghlErr);
        }
      }

      // Move to results
      console.log('[page] moving to step 4 (results)');
      setStep(4);
    } catch (err) {
      console.error('Render error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Rendering failed. Please try again.';
      setRenderError(errorMessage);
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
            onComplete={(addr, satelliteUrl, components) => {
              setAddress(addr);
              setAddressComponents(components);
              setSatelliteImageUrl(satelliteUrl);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepTwo
            satelliteImageUrl={satelliteImageUrl}
            address={address}
            onComplete={(sel) => {
              setSelection(sel);
              setStep(3);
            }}
          />
        )}

        {step === 3 && !isRendering && !renderError && (
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

        {step === 3 && isRendering && (
          <div className="bg-card border border-border rounded-2xl p-12 sm:p-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <svg width="40" height="28" viewBox="0 0 40 28" fill="none" className="text-accent">
                <path d="M2 22L20 3l18 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="animate-spin w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-foreground text-sm font-medium">{LOADING_MESSAGES[loadingMessageIndex]}</p>
              <p className="text-muted text-xs">This usually takes under a minute.</p>
            </div>
          </div>
        )}

        {step === 3 && renderError && (
          <ErrorState
            message={renderError}
            onRetry={() => setRenderError(null)}
          />
        )}

        {step === 4 && selection && (
          <StepThree
            address={address}
            selection={selection}
            image={renderedImage}
            streetViewAvailable={streetViewAvailable}
            leadInfo={leadInfo}
          />
        )}

      </div>
    </main>
  );
}
