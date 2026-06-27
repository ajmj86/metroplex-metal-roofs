'use client'

import React from 'react'
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

const EST_STEPS = ['Your Home', 'Your Details', 'Your Estimate']

type QualData = { currentRoofType: string; reason: string; insuranceClaim: string; timeline: string }
interface QualScreen { field: keyof QualData; headline: string; subtext: string; choices: { value: string; label: string; icon: string }[] }

const QUAL_SCREENS: QualScreen[] = [
  {
    field: 'currentRoofType',
    headline: "What's your roof looking like right now?",
    subtext: "No judgment — we're just figuring out your starting point.",
    choices: [
      { value: 'asphalt_shingles', label: 'Asphalt Shingles',    icon: '🏠' },
      { value: 'metal_old',        label: 'Old Metal / Tin',      icon: '🔩' },
      { value: 'tile',             label: 'Tile or Clay',          icon: '🏛️' },
      { value: 'flat',             label: 'Flat / TPO',            icon: '▬' },
      { value: 'unknown',          label: 'Not Sure',              icon: '🤷' },
    ],
  },
  {
    field: 'reason',
    headline: "What's driving this project?",
    subtext: "This helps us tailor your options and pricing approach.",
    choices: [
      { value: 'hail_damage',   label: 'Hail or Storm Damage',     icon: '⛈️' },
      { value: 'age_replace',   label: 'Aging Roof / End of Life', icon: '📅' },
      { value: 'upgrade',       label: 'Upgrading for Longevity',  icon: '💎' },
      { value: 'selling',       label: 'Selling the Home',         icon: '🏷️' },
      { value: 'new_build',     label: 'New Construction',         icon: '🏗️' },
    ],
  },
  {
    field: 'insuranceClaim',
    headline: "Have you filed an insurance claim yet?",
    subtext: "If damage is involved, we can walk you through the upgrade pathway.",
    choices: [
      { value: 'yes_approved',       label: 'Yes — Claim Approved',      icon: '✅' },
      { value: 'yes_pending',        label: 'Yes — Still Pending',       icon: '⏳' },
      { value: 'no_but_considering', label: 'No — But Considering It',   icon: '🤔' },
      { value: 'no_cash',            label: 'No — Paying Out of Pocket', icon: '💵' },
    ],
  },
  {
    field: 'timeline',
    headline: "When are you looking to get this done?",
    subtext: "We work on your timeline — not ours.",
    choices: [
      { value: 'asap',             label: 'As Soon as Possible',     icon: '🔥' },
      { value: '1_3_months',       label: 'Within 1–3 Months',      icon: '📆' },
      { value: '3_6_months',       label: '3–6 Months Out',         icon: '🗓️' },
      { value: 'just_researching', label: 'Just Researching for Now', icon: '📚' },
    ],
  },
]

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
  const addressInputRef             = useRef<HTMLInputElement>(null)
  const autocompleteAttachedRef     = useRef(false)
  const autoTriggeredRef            = useRef(false)

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

  // Qualifier flow — skip if coming from visualizer (already answered)
  const [showQualifier, setShowQualifier] = useState(!skipContactForm)
  const [qualScreen, setQualScreen] = useState(0)
  const [qualData, setQualData] = useState<QualData>({
    currentRoofType: '', reason: '', insuranceClaim: '', timeline: '',
  })
  const [pendingQual, setPendingQual] = useState<string | null>(null)

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

  function handleQualChoice(field: keyof QualData, value: string) {
    setPendingQual(value)
    setTimeout(() => {
      setQualData(d => ({ ...d, [field]: value }))
      setPendingQual(null)
      if (qualScreen < QUAL_SCREENS.length - 1) {
        setQualScreen(s => s + 1)
      } else {
        setShowQualifier(false)
      }
    }, 220)
  }

  function leadFields() {
    return {
      firstName: skipContactForm ? leadInfo?.firstName : contactFields.firstName,
      lastName: skipContactForm ? leadInfo?.lastName : contactFields.lastName,
      phone: skipContactForm ? leadInfo?.phone : contactFields.phone,
      email: skipContactForm ? leadInfo?.email : contactFields.email,
      smsConsent: contactFields.smsConsent,
      emailConsent: contactFields.emailConsent,
      currentRoofType: qualData.currentRoofType || undefined,
      reason: qualData.reason || leadInfo?.reason,
      insuranceClaim: qualData.insuranceClaim || leadInfo?.insuranceClaim,
      timeline: qualData.timeline || leadInfo?.timeline,
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
        <div style={{ paddingTop: 84, paddingBottom: 120 }}>
          <EstimateResult roofType={result.roofType} estimate={result.estimate} />
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <SiteNav/>
        <div style={{ paddingTop: 84, paddingBottom: 120 }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
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

  const estStepIdx = 0

  return (
    <>
      <SiteNav/>
      <div style={{ paddingTop: 84 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', paddingBottom: 120 }}>

          {/* 3-step indicator */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, maxWidth: 280, margin: '0 auto 8px' }}>
              {EST_STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: i <= estStepIdx ? C.accent : C.surface,
                    border: `2px solid ${i <= estStepIdx ? C.accent : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    color: i <= estStepIdx ? C.black : C.muted,
                  }}>
                    {i < estStepIdx ? '✓' : i + 1}
                  </div>
                  {i < EST_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: i < estStepIdx ? C.accent : C.border }} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 280, margin: '0 auto', padding: '0 2px' }}>
              {EST_STEPS.map((label, i) => (
                <div key={label} style={{
                  fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                  color: i <= estStepIdx ? C.accent : C.muted,
                  width: 28, textAlign: 'center', lineHeight: 1.3,
                  fontFamily: "'Outfit',sans-serif",
                }}>{label}</div>
              ))}
            </div>
          </div>

          {showQualifier ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
              <div style={{
                width: '100%', maxWidth: 460,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                overflow: 'hidden',
              }}>
                {/* Progress bar */}
                <div style={{ height: 3, background: C.card }}>
                  <div style={{
                    height: '100%',
                    width: `${((qualScreen + 1) / 4) * 100}%`,
                    background: C.accent,
                    transition: 'width 0.35s ease',
                  }} />
                </div>
                <div style={{ padding: 'clamp(24px,4vw,36px)' }}>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>
                    Step {qualScreen + 1} of 4
                  </div>
                  {(() => {
                    const screen = QUAL_SCREENS[qualScreen]
                    return (
                      <>
                        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(20px,3.5vw,26px)', fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 8 }}>
                          {screen.headline}
                        </h2>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
                          {screen.subtext}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {screen.choices.map(choice => {
                            const isPending  = pendingQual === choice.value
                            const isSelected = qualData[screen.field] === choice.value
                            return (
                              <button
                                key={choice.value}
                                onClick={() => handleQualChoice(screen.field, choice.value)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 14,
                                  background: isSelected || isPending ? `${C.accentDark}22` : C.card,
                                  border: `1.5px solid ${isSelected || isPending ? C.accent : C.border}`,
                                  borderRadius: 12,
                                  padding: '14px 18px',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.18s',
                                  boxShadow: isSelected || isPending ? `0 0 0 1px ${C.accentDark}, 0 0 12px ${C.accentDark}55` : 'none',
                                }}
                                onMouseEnter={e => {
                                  if (!isSelected) { e.currentTarget.style.borderColor = C.accentDark; e.currentTarget.style.background = `${C.accentDark}11` }
                                }}
                                onMouseLeave={e => {
                                  if (!isSelected) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card }
                                }}
                              >
                                <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{choice.icon}</span>
                                <span style={{ fontSize: 14, color: isSelected || isPending ? C.accent : C.white, fontFamily: "'Outfit',sans-serif", fontWeight: 500, lineHeight: 1.3 }}>
                                  {choice.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
              {qualScreen > 0 && (
                <button
                  onClick={() => setQualScreen(s => s - 1)}
                  style={{ marginTop: 16, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0', textDecoration: 'underline', fontFamily: "'Outfit',sans-serif" }}
                >← Back</button>
              )}
            </div>
          ) : (
            <>
              {!showManual ? (
                <>
                  {errorMsg && (
                    <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: C.mutedLight, lineHeight: 1.7 }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* Address field */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 6 }}>
                        Enter your property address
                      </div>
                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                        We&apos;ll use satellite data to calculate your exact roof size.
                      </p>
                    </div>
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
                      <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Material</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                        {(ROOF_TYPE_ORDER as readonly string[]).map(rt => (
                          <button key={rt} onClick={() => pickType(rt)} style={{
                            padding: '16px 20px',
                            fontSize: 12,
                            letterSpacing: 2,
                            textTransform: 'uppercase' as const,
                            background: standaloneType === rt ? C.accent : C.surface,
                            color: standaloneType === rt ? C.black : C.mutedLight,
                            border: `1.5px solid ${standaloneType === rt ? C.accent : C.border}`,
                            borderRadius: 6,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: "'Outfit',sans-serif",
                            fontWeight: standaloneType === rt ? 700 : 500,
                            boxShadow: standaloneType === rt ? `0 0 12px ${C.accentDark}44` : 'none',
                            textAlign: 'center' as const,
                          }}
                          onMouseEnter={e => { if (standaloneType !== rt) { e.currentTarget.style.borderColor = C.accentDark; e.currentTarget.style.color = C.white; }}}
                          onMouseLeave={e => { if (standaloneType !== rt) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight; }}}
                          >{getRoofTypeLabel(rt)}</button>
                        ))}
                      </div>
                    </div>

                    {/* Style tabs (stone-coated only) */}
                    {standaloneType && selStyles.length > 1 && !hasExactlyOneProduct(standaloneType) && (
                      <div style={cardStyle}>
                        <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Style</div>
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
                        <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Product</div>
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

                    {/* Color swatches */}
                    {standaloneType && standaloneProduct && selColors.length > 0 && (
                      <div style={cardStyle}>
                        <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Color</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                          {selColors.map((c: ColorOption) => (
                            <button key={c.name} onClick={() => setStandaloneColor(c.name)}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                              <div style={{
                                borderRadius: 8, overflow: 'hidden',
                                border: `2px solid ${standaloneColor === c.name ? C.accent : C.border}`,
                                boxShadow: standaloneColor === c.name ? `0 0 0 1px ${C.accent}, 0 0 12px ${C.accentDark}44` : 'none',
                                transition: 'all 0.15s',
                              }}>
                                {c.image1 ? (
                                  <img src={c.image1} alt={c.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                                ) : (
                                  <div style={{ width: '100%', height: 120, background: c.hex ?? C.surface }} />
                                )}
                                <div style={{
                                  padding: '8px 10px',
                                  background: standaloneColor === c.name ? `${C.accentDark}33` : C.card,
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6
                                }}>
                                  <span style={{ fontSize: 13, color: standaloneColor === c.name ? C.accent : C.mutedLight, fontFamily: "'Outfit',sans-serif", lineHeight: 1.3 }}>{c.name}</span>
                                  {standaloneColor === c.name && <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>✓</span>}
                                </div>
                              </div>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
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
                          By checking this box, I consent to receive automated SMS text messages from Metroplex Metal Roofs at the number provided regarding my estimate inquiry. Message frequency varies. Message &amp; data rates may apply. Text STOP to cancel, HELP for help. Consent is not a condition of purchase.
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
                    <a
                      href={`/visualizer?firstName=${encodeURIComponent(contactFields.firstName || '')}&lastName=${encodeURIComponent(contactFields.lastName || '')}&phone=${encodeURIComponent(contactFields.phone || '')}&email=${encodeURIComponent(contactFields.email || '')}&address=${encodeURIComponent(address || '')}&roofType=${encodeURIComponent(standaloneType || '')}&prefilled=true`}
                      style={{ color: C.accent, textDecoration: 'underline' }}
                    >Try the AI Visualizer →</a>
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
            </>
          )}
        </div>
      </div>
    </>
  )
}
