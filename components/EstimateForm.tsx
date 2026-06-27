'use client'

import { useState, useEffect, useRef } from 'react'
import EstimateResult from './EstimateResult'
import SiteNav from '@/components/SiteNav'
import {
  getProductLabel,
  ROOF_TYPE_ORDER,
  getRoofTypeLabel,
  stylesWithColors,
  productsForStyle,
  hasExactlyOneProduct,
  getAutoSelectedStyleAndProduct,
  type ColorOption,
} from '@/lib/roofProducts'

const C = {
  black: '#09090A',
  surface: '#111113',
  card: '#18181B',
  border: '#27272A',
  borderLight: '#3F3F46',
  accent: '#B8935A',
  accentLight: '#D4AE7A',
  accentDark: '#8C6A38',
  white: '#F4F1EB',
  muted: '#71717A',
  mutedLight: '#A1A1AA',
}

type StoryOption = 'one' | 'two' | 'unknown'

type EstimateData = {
  roofType: string
  estimate: { low: string; high: string }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  padding: '12px 14px',
  color: C.white,
  fontSize: 14,
  outline: 'none',
  fontFamily: "'Outfit',sans-serif",
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px',
  background: C.accent,
  color: C.black,
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase',
  fontWeight: 700,
  borderRadius: 4,
  cursor: 'pointer',
  border: 'none',
  fontFamily: "'Outfit',sans-serif",
  transition: 'background 0.2s',
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: C.muted,
  marginBottom: 6,
}

const errStyle: React.CSSProperties = { fontSize: 11, color: '#F87171', marginTop: 4 }

const inputFieldStyle: React.CSSProperties = {
  width: '100%',
  background: '#18181B',
  border: '1px solid #27272A',
  borderRadius: 4,
  padding: '12px 14px',
  color: '#F4F1EB',
  fontSize: 14,
  outline: 'none',
  fontFamily: "'Outfit',sans-serif",
  boxSizing: 'border-box',
}

interface InitialSelection {
  roofType?: string
  style?: string
  product?: string
  color?: string
  address?: string
}

interface LeadInfo {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  reason?: string
  insuranceClaim?: string
  timeline?: string
  leadOrigin?: string
}

interface EstimateFormProps {
  initialSelection?: InitialSelection
  leadInfo?: LeadInfo
  leadSource?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export default function EstimateForm({ initialSelection, leadInfo, leadSource, utmSource, utmMedium, utmCampaign }: EstimateFormProps = {}) {
  const carriedRoofType = initialSelection?.roofType && (ROOF_TYPE_ORDER as readonly string[]).includes(initialSelection.roofType)
    ? initialSelection.roofType
    : null
  const carriedProductLabel = carriedRoofType && initialSelection?.product
    ? getProductLabel(carriedRoofType, initialSelection.product)
    : null
  const carriedColor = carriedProductLabel ? initialSelection?.color ?? null : null

  const shouldAutoTrigger = Boolean(carriedRoofType && initialSelection?.address)

  // Material selection state
  const [standaloneType, setStandaloneType]       = useState<string | null>(carriedRoofType)
  const [standaloneStyle, setStandaloneStyle]     = useState<string | null>(null)
  const [standaloneProduct, setStandaloneProduct] = useState<string | null>(null)
  const [standaloneColor, setStandaloneColor]     = useState<string | null>(null)

  const [address, setAddress]       = useState(initialSelection?.address ?? '')
  const [loading, setLoading]       = useState(shouldAutoTrigger)
  const [showManual, setShowManual] = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')
  const [manualSqFt, setManualSqFt] = useState('')
  const [stories, setStories]       = useState<StoryOption>('one')
  const [result, setResult]         = useState<EstimateData | null>(null)
  const addressInputRef       = useRef<HTMLInputElement>(null)
  const autocompleteAttachedRef = useRef(false)
  const autoTriggeredRef      = useRef(false)

  // Contact fields — pre-fill from leadInfo if coming from visualizer
  const skipContactForm = Boolean(leadInfo?.phone)
  const [contactFields, setContactFields] = useState({
    firstName: leadInfo?.firstName ?? '',
    lastName: leadInfo?.lastName ?? '',
    phone: leadInfo?.phone ?? '',
    email: leadInfo?.email ?? '',
    smsConsent: false,
    emailConsent: false,
  })
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})

  // Google Places Autocomplete
  useEffect(() => {
    if (typeof window === 'undefined' || !addressInputRef.current) {
      autocompleteAttachedRef.current = false
      return
    }

    function tryAttach() {
      if (!addressInputRef.current || autocompleteAttachedRef.current || !(window as any).google?.maps?.places) return
      initializeAutocomplete()
      autocompleteAttachedRef.current = true
    }

    if ((window as any).google?.maps?.places) {
      tryAttach()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-maps-places]')
    if (existingScript) {
      existingScript.addEventListener('load', tryAttach)
      return () => existingScript.removeEventListener('load', tryAttach)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.dataset.googleMapsPlaces = 'true'
    script.addEventListener('load', tryAttach)
    document.head.appendChild(script)
  }, [standaloneType, loading])

  function initializeAutocomplete() {
    if (!addressInputRef.current || !(window as any).google) return

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      }
    )

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place && place.formatted_address) {
        setAddress(place.formatted_address)
      }
    })
  }

  function validateContactFields() {
    const e: Record<string, string> = {}
    if (!contactFields.firstName.trim()) e.firstName = 'Required'
    if (!contactFields.lastName.trim()) e.lastName = 'Required'
    if (!contactFields.phone.trim()) e.phone = 'Required'
    else if (!/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(contactFields.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number'
    if (!contactFields.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactFields.email)) e.email = 'Invalid email'
    return e
  }

  function leadFields() {
    return {
      firstName: skipContactForm ? leadInfo?.firstName : contactFields.firstName,
      lastName: skipContactForm ? leadInfo?.lastName : contactFields.lastName,
      phone: skipContactForm ? leadInfo?.phone : contactFields.phone,
      email: skipContactForm ? leadInfo?.email : contactFields.email,
      smsConsent: contactFields.smsConsent,
      emailConsent: contactFields.emailConsent,
      reason: leadInfo?.reason,
      insuranceClaim: leadInfo?.insuranceClaim,
      timeline: leadInfo?.timeline,
      leadOrigin: leadInfo?.leadOrigin,
      leadSource,
      utmSource,
      utmMedium,
      utmCampaign,
      productLabel: carriedProductLabel ?? undefined,
    }
  }

  async function postToLeadIntake(extraFields: Record<string, unknown>) {
    try {
      await fetch('/api/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadFields(), ...extraFields, leadOrigin: leadInfo?.leadOrigin ?? 'estimate' }),
      })
    } catch { /* best-effort */ }
  }

  async function handleAddressSubmit(): Promise<boolean> {
    if (!address.trim()) return false

    if (!skipContactForm) {
      const e = validateContactFields()
      if (Object.keys(e).length) { setContactErrors(e); return false }
    }

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, roofType: standaloneType, ...leadFields() }),
      })
      const data = await res.json()
      if (data.success && data.estimate && data.roofType) {
        setResult({ roofType: data.roofType, estimate: data.estimate })
        await postToLeadIntake({ address, roofType: standaloneType })
        return true
      } else {
        setShowManual(true)
        setErrorMsg("We weren't able to pull data for your address. Enter your home's approximate square footage below and we'll calculate your estimate.")
        return false
      }
    } catch {
      setShowManual(true)
      setErrorMsg("We weren't able to pull data for your address. Enter your home's approximate square footage below and we'll calculate your estimate.")
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoTriggeredRef.current || !shouldAutoTrigger) return
    autoTriggeredRef.current = true
    handleAddressSubmit().then(success => {
      if (!success) {
        setShowManual(false)
        setErrorMsg("We weren't able to generate your estimate automatically. Please confirm your address and try again.")
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleManualSubmit() {
    const sqFt = Number(manualSqFt)
    if (!manualSqFt || isNaN(sqFt) || sqFt <= 0) return

    if (!skipContactForm) {
      const e = validateContactFields()
      if (Object.keys(e).length) { setContactErrors(e); return }
    }

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualSqFt: sqFt, stories, roofType: standaloneType, ...leadFields() }),
      })
      const data = await res.json()
      if (data.success && data.estimate && data.roofType) {
        setResult({ roofType: data.roofType, estimate: data.estimate })
        await postToLeadIntake({ manualSqFt: sqFt, stories, roofType: standaloneType })
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <>
        <SiteNav/>
        <div style={{ paddingTop: 84 }}>
          <EstimateResult roofType={result.roofType} estimate={result.estimate} />
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <SiteNav/>
        <div style={{ paddingTop: 84 }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '48px 32px', textAlign: 'center' }}>
              <svg width="44" height="44" viewBox="0 0 44 44" style={{ animation: 'espin 1.1s linear infinite', display: 'inline-block', marginBottom: 20 }}>
                <circle cx="22" cy="22" r="18" stroke={C.border} strokeWidth="3" fill="none" />
                <path d="M22 4 A18 18 0 0 1 40 22" stroke={C.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <style>{`@keyframes espin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, color: C.white }}>Calculating your estimate…</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Material selector helpers ──────────────────────────────────────────────
  const selStyles   = standaloneType ? stylesWithColors(standaloneType) : []
  const selProducts = standaloneType && standaloneStyle ? productsForStyle(standaloneType, standaloneStyle) : []
  const selColors: ColorOption[] = standaloneType && standaloneProduct
    ? (productsForStyle(standaloneType, standaloneStyle ?? '').find(([k]) => k === standaloneProduct)?.[1].colors ?? [])
    : []

  function pickType(rt: string) {
    setStandaloneStyle(null); setStandaloneProduct(null); setStandaloneColor(null); setStandaloneType(rt)
    if (hasExactlyOneProduct(rt)) {
      const auto = getAutoSelectedStyleAndProduct(rt)
      if (auto) {
        setStandaloneStyle(auto.style); setStandaloneProduct(auto.product)
        const autoColors = productsForStyle(rt, auto.style).find(([k]) => k === auto.product)?.[1].colors ?? []
        if (autoColors.length === 1) setStandaloneColor(autoColors[0].name)
      }
    }
  }

  const canSubmit = Boolean(
    address.trim() && standaloneColor &&
    (skipContactForm || (contactFields.firstName.trim() && contactFields.phone.trim()))
  )

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '9px 16px', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const,
    background: active ? C.accent : 'transparent',
    color: active ? C.black : C.mutedLight,
    border: `1px solid ${active ? C.accent : C.border}`,
    borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: "'Outfit',sans-serif", fontWeight: 500,
  })

  const cardStyle: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 12,
  }

  return (
    <>
      <SiteNav/>
      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {!showManual ? (
            <>
              {errorMsg && (
                <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: C.mutedLight, lineHeight: 1.7 }}>
                  {errorMsg}
                </div>
              )}

              {/* Address field */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 8 }}>
                  Enter your property address
                </div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
                  We&apos;ll use satellite data to calculate your exact roof size.
                </p>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', minWidth: 160 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6.1c-.94 0-1.7-.76-1.7-1.7S7.06 4.2 8 4.2s1.7.76 1.7 1.7S8.94 7.6 8 7.6z" fill={C.muted} />
                    </svg>
                    <input
                      ref={addressInputRef}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && canSubmit && handleAddressSubmit()}
                      placeholder="123 Main St, Southlake, TX"
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.white, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Inline material selector */}
              <div style={{ marginBottom: 24 }}>
                {/* Roof type tabs */}
                <div style={cardStyle}>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Material</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(ROOF_TYPE_ORDER as readonly string[]).map(rt => (
                      <button key={rt} onClick={() => pickType(rt)} style={tabBtn(standaloneType === rt)}>
                        {getRoofTypeLabel(rt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style tabs (stone-coated only) */}
                {standaloneType && selStyles.length > 1 && !hasExactlyOneProduct(standaloneType) && (
                  <div style={cardStyle}>
                    <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Style</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {selStyles.map(([sk, so]) => (
                        <button key={sk} style={tabBtn(standaloneStyle === sk)} onClick={() => {
                          setStandaloneProduct(null); setStandaloneColor(null); setStandaloneStyle(sk)
                          const sp = productsForStyle(standaloneType, sk)
                          if (sp.length === 1) { setStandaloneProduct(sp[0][0]); if (sp[0][1].colors.length === 1) setStandaloneColor(sp[0][1].colors[0].name) }
                        }}>{so.label}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product grid */}
                {standaloneType && standaloneStyle && selProducts.length > 1 && (
                  <div style={cardStyle}>
                    <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Product</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                      {selProducts.map(([pk, po]) => (
                        <button key={pk} onClick={() => { setStandaloneColor(null); setStandaloneProduct(pk) }}
                          style={{ background: standaloneProduct === pk ? `${C.accentDark}33` : C.surface, border: `1px solid ${standaloneProduct === pk ? C.accentDark : C.border}`, borderRadius: 6, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 600, color: standaloneProduct === pk ? C.accent : C.white, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>{po.label}</div>
                          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{po.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Circular color swatches */}
                {standaloneType && standaloneProduct && selColors.length > 0 && (
                  <div style={cardStyle}>
                    <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Color</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                      {selColors.map((c: ColorOption) => (
                        <button key={c.name} onClick={() => setStandaloneColor(c.name)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                        >
                          <div style={{
                            width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
                            border: `2px solid ${standaloneColor === c.name ? C.accent : C.border}`,
                            boxShadow: standaloneColor === c.name ? `0 0 0 2px ${C.accent}` : 'none',
                            background: c.hex ?? C.surface, transition: 'all 0.15s',
                          }}>
                            {c.image1 && <img src={c.image1} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                          </div>
                          <span style={{ fontSize: 10, color: standaloneColor === c.name ? C.accent : C.muted, textAlign: 'center', lineHeight: 1.3, fontFamily: "'Outfit',sans-serif", maxWidth: 60 }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact section */}
              {skipContactForm ? (
                <div style={{ marginBottom: 20, padding: '12px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.mutedLight }}>
                  Estimating for: {leadInfo?.firstName} {leadInfo?.lastName} · {leadInfo?.phone}
                </div>
              ) : (
                <div style={{ marginTop: 32, borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 16 }}>
                    Your Contact Info
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={labelStyle}>First Name *</div>
                      <input value={contactFields.firstName}
                        onChange={e => setContactFields(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="Jane" style={inputFieldStyle} />
                      {contactErrors.firstName && <div style={errStyle}>{contactErrors.firstName}</div>}
                    </div>
                    <div>
                      <div style={labelStyle}>Last Name *</div>
                      <input value={contactFields.lastName}
                        onChange={e => setContactFields(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Smith" style={inputFieldStyle} />
                      {contactErrors.lastName && <div style={errStyle}>{contactErrors.lastName}</div>}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={labelStyle}>Phone *</div>
                    <input value={contactFields.phone} type="tel"
                      onChange={e => setContactFields(f => ({ ...f, phone: e.target.value }))}
                      placeholder="(817) 555-0100" style={inputFieldStyle} />
                    {contactErrors.phone && <div style={errStyle}>{contactErrors.phone}</div>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={labelStyle}>Email *</div>
                    <input value={contactFields.email} type="email"
                      onChange={e => setContactFields(f => ({ ...f, email: e.target.value }))}
                      placeholder="jane@email.com" style={inputFieldStyle} />
                    {contactErrors.email && <div style={errStyle}>{contactErrors.email}</div>}
                  </div>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={contactFields.smsConsent}
                      onChange={e => setContactFields(f => ({ ...f, smsConsent: e.target.checked }))}
                      style={{ marginTop: 2, accentColor: '#B8935A', width: 15, height: 15, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#71717A', lineHeight: 1.6 }}>
                      I agree to receive SMS messages about my estimate. Message &amp; data rates may apply. Reply STOP to opt out.
                    </span>
                  </label>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16, cursor: 'pointer' }}>
                    <input type="checkbox" checked={contactFields.emailConsent}
                      onChange={e => setContactFields(f => ({ ...f, emailConsent: e.target.checked }))}
                      style={{ marginTop: 2, accentColor: '#B8935A', width: 15, height: 15, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#71717A', lineHeight: 1.6 }}>
                      I agree to receive email updates from Metroplex Metal Roofs.
                    </span>
                  </label>
                  <div style={{ fontSize: 10, color: '#71717A', lineHeight: 1.7, marginBottom: 16, padding: '10px 12px', background: '#111113', borderRadius: 4, border: '1px solid #27272A' }}>
                    By submitting, you consent to being contacted by Metroplex Metal Roofs regarding your inquiry. Your information is never sold or shared with third parties.
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleAddressSubmit}
                disabled={!canSubmit}
                style={{ ...btnStyle, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = C.accentLight }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
              >
                {!address.trim() && !standaloneColor
                  ? 'Enter address & select material'
                  : !standaloneColor
                  ? 'Select a color to continue'
                  : !address.trim()
                  ? 'Enter your address to continue'
                  : 'Get My Estimate →'}
              </button>

              {/* Cross-link to visualizer */}
              <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 16 }}>
                Want to see your home with a metal roof first?{' '}
                <a href="/visualizer" style={{ color: C.accent, textDecoration: 'underline' }}>Try the AI Visualizer →</a>
              </p>
            </>
          ) : (
            <>
              {errorMsg && (
                <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: C.mutedLight, lineHeight: 1.7 }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 20 }}>
                Enter your home&apos;s details
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>
                  Approximate square footage of your home
                </div>
                <input
                  type="number"
                  value={manualSqFt}
                  onChange={e => setManualSqFt(e.target.value)}
                  placeholder="e.g. 2400"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
                  How many stories?
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {([['one', 'One story'], ['two', 'Two stories'], ['unknown', 'Not sure']] as [StoryOption, string][]).map(([val, label]) => (
                    <label
                      key={val}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                        padding: '10px 16px',
                        background: stories === val ? `${C.accentDark}33` : C.card,
                        border: `1px solid ${stories === val ? C.accentDark : C.border}`,
                        borderRadius: 4, fontSize: 13,
                        color: stories === val ? C.accent : C.mutedLight,
                        transition: 'all 0.15s', fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      <input type="radio" name="stories" value={val} checked={stories === val} onChange={() => setStories(val)} style={{ display: 'none' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleManualSubmit}
                style={btnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = C.accentLight }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
              >
                Calculate Anyway →
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
