'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { C, fonts, globalStyles } from '@/components/brand'
import SiteNav from '@/components/SiteNav'
import {
  ROOF_TYPE_ORDER,
  getRoofTypeLabel,
  stylesWithColors,
  productsForStyle,
  hasExactlyOneProduct,
  getAutoSelectedStyleAndProduct,
  type ColorOption,
} from '@/lib/roofProducts'

type Step = 'address' | 'select' | 'gate' | 'loading' | 'results'

const LOADING_PHRASES = [
  'Pulling satellite imagery for your property…',
  'Analyzing your roofline geometry…',
  'Applying your chosen material and color…',
  'Running the AI render engine…',
  'Adding realistic lighting and shadows…',
  'Almost there — finalizing your visualization…',
]

const TX_BOUNDS = { north: 36.5, south: 25.8, east: -93.5, west: -106.6 }

const iStyle: React.CSSProperties = {
  width: '100%', background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 4, padding: '14px 16px', color: C.white, fontSize: 15,
  outline: 'none', fontFamily: "'Outfit',sans-serif", boxSizing: 'border-box',
}

// ── Gate screen definitions ────────────────────────────────────────────────────

interface GateChoice { value: string; label: string; icon: string }
interface GateScreen { field: keyof GateData; headline: string; subtext: string; choices: GateChoice[] }

interface GateData {
  currentRoofType: string
  reason: string
  insuranceClaim: string
  timeline: string
  firstName: string
  lastName: string
  phone: string
  email: string
  smsConsent: boolean
  emailConsent: boolean
}

const GATE_SCREENS: GateScreen[] = [
  {
    field: 'currentRoofType',
    headline: "What's your roof looking like right now?",
    subtext: "No judgment — we're just figuring out your starting point.",
    choices: [
      { value: 'asphalt_shingles',  label: 'Asphalt Shingles',    icon: '🏠' },
      { value: 'metal_old',         label: 'Old Metal / Tin',      icon: '🔩' },
      { value: 'tile',              label: 'Tile or Clay',          icon: '🏛️' },
      { value: 'flat',              label: 'Flat / TPO',            icon: '▬' },
      { value: 'unknown',           label: 'Not Sure',              icon: '🤷' },
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
      { value: 'yes_approved',         label: 'Yes — Claim Approved',       icon: '✅' },
      { value: 'yes_pending',          label: 'Yes — Still Pending',        icon: '⏳' },
      { value: 'no_but_considering',   label: 'No — But Considering It',    icon: '🤔' },
      { value: 'no_cash',              label: 'No — Paying Out of Pocket',  icon: '💵' },
    ],
  },
  {
    field: 'timeline',
    headline: "When are you looking to get this done?",
    subtext: "We work on your timeline — not ours.",
    choices: [
      { value: 'asap',             label: 'As Soon as Possible',    icon: '🔥' },
      { value: '1_3_months',       label: 'Within 1–3 Months',     icon: '📆' },
      { value: '3_6_months',       label: '3–6 Months Out',        icon: '🗓️' },
      { value: 'just_researching', label: 'Just Researching for Now', icon: '📚' },
    ],
  },
]

export default function VisualizerPage() {
  const [step, setStep] = useState<Step>('address')

  // address step
  const [address, setAddress] = useState('')
  const [locating, setLocating] = useState(false)
  const [addrError, setAddrError] = useState('')
  const addrRef = useRef<HTMLInputElement>(null)
  const acAttached = useRef(false)

  // select step
  const [satelliteUrl, setSatelliteUrl] = useState<string | null>(null)
  const [selType, setSelType] = useState<string | null>(null)
  const [selStyle, setSelStyle] = useState<string | null>(null)
  const [selProduct, setSelProduct] = useState<string | null>(null)
  const [selColor, setSelColor] = useState<string | null>(null)

  // gate step
  const [gateScreen, setGateScreen] = useState(0)
  const [gateData, setGateData] = useState<GateData>({
    currentRoofType: '', reason: '', insuranceClaim: '', timeline: '',
    firstName: '', lastName: '', phone: '', email: '',
    smsConsent: false, emailConsent: false,
  })
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})
  const [gateLoading, setGateLoading] = useState(false)
  // tracks which choice was just selected (for animation flash)
  const [pendingChoice, setPendingChoice] = useState<string | null>(null)

  // loading / results
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [renderUrl, setRenderUrl] = useState<string | null>(null)

  // ── Google Places ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'address' || !addrRef.current) return
    function attach() {
      if (!addrRef.current || acAttached.current || !(window as any).google?.maps?.places) return
      const bounds = new (window as any).google.maps.LatLngBounds(
        { lat: TX_BOUNDS.south, lng: TX_BOUNDS.west },
        { lat: TX_BOUNDS.north, lng: TX_BOUNDS.east }
      )
      const ac = new (window as any).google.maps.places.Autocomplete(addrRef.current, {
        types: ['address'], componentRestrictions: { country: 'us' }, bounds, strictBounds: false,
      })
      ac.addListener('place_changed', () => {
        const p = ac.getPlace()
        if (p?.formatted_address) setAddress(p.formatted_address)
      })
      acAttached.current = true
    }
    if ((window as any).google?.maps?.places) { attach(); return }
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps-places]')
    if (existing) { existing.addEventListener('load', attach); return () => existing.removeEventListener('load', attach) }
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    s.async = true; s.defer = true; s.dataset.googleMapsPlaces = 'true'
    s.addEventListener('load', attach)
    document.head.appendChild(s)
  }, [step])

  // ── Rotate loading phrases every 15s ──────────────────────────────────────
  useEffect(() => {
    if (step !== 'loading') return
    const id = setInterval(() => setPhraseIdx(i => (i + 1) % LOADING_PHRASES.length), 15000)
    return () => clearInterval(id)
  }, [step])

  // ── Render API call ────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'loading') return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            satelliteImageUrl: satelliteUrl,  // field name the render route expects
            roofType: selType,
            style: selStyle,
            product: selProduct,
            color: selColor,
            firstName: gateData.firstName,
          }),
        })
        const data = await res.json()
        if (!cancelled) {
          // render route returns data.image (not data.renderUrl)
          setRenderUrl(data.image ?? null)
          setStep('results')
        }
      } catch {
        if (!cancelled) { setRenderUrl(null); setStep('results') }
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleVisualize() {
    if (!address.trim()) { setAddrError('Please enter your home address.'); return }
    setAddrError(''); setLocating(true)
    try {
      const res = await fetch('/api/resolve-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      // resolve-image returns { address, satellite: { imageUrl } }
      setSatelliteUrl(data.satellite?.imageUrl ?? null)
    } catch {
      setSatelliteUrl(null)
    } finally {
      setLocating(false)
      setStep('select')
    }
  }

  function handleChoice(field: keyof GateData, value: string) {
    setPendingChoice(value)
    setGateData(d => ({ ...d, [field]: value }))
    setTimeout(() => {
      setPendingChoice(null)
      setGateScreen(s => s + 1)
    }, 220)
  }

  function validateContact() {
    const e: Record<string, string> = {}
    if (!gateData.firstName.trim()) e.firstName = 'Required'
    if (!gateData.lastName.trim()) e.lastName = 'Required'
    if (!gateData.phone.trim()) e.phone = 'Required'
    else if (!/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(gateData.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number'
    if (!gateData.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gateData.email)) e.email = 'Invalid email'
    return e
  }

  async function handleContactSubmit() {
    const e = validateContact()
    if (Object.keys(e).length) { setContactErrors(e); return }
    setGateLoading(true)
    try {
      await fetch('/api/lead-intake', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: gateData.firstName,
          lastName: gateData.lastName,
          phone: gateData.phone,
          email: gateData.email,
          smsConsent: gateData.smsConsent,
          emailConsent: gateData.emailConsent,
          address,
          currentRoofType: gateData.currentRoofType,
          reason: gateData.reason,
          insuranceClaim: gateData.insuranceClaim,
          timeline: gateData.timeline,
          selectedRoofType: selType,
          product: selProduct,
          color: selColor,
          leadOrigin: 'visualizer',
        }),
      })
    } catch { /* advance anyway */ }
    finally {
      setGateLoading(false)
      setPhraseIdx(0)
      setStep('loading')
    }
  }

  // ── Material selector helpers ──────────────────────────────────────────────
  function pickType(rt: string) {
    setSelStyle(null); setSelProduct(null); setSelColor(null); setSelType(rt)
    if (hasExactlyOneProduct(rt)) {
      const auto = getAutoSelectedStyleAndProduct(rt)
      if (auto) {
        setSelStyle(auto.style); setSelProduct(auto.product)
        const autoColors = productsForStyle(rt, auto.style).find(([k]) => k === auto.product)?.[1].colors ?? []
        if (autoColors.length === 1) setSelColor(autoColors[0].name)
      }
    }
  }

  const selStyles   = selType ? stylesWithColors(selType) : []
  const selProducts = selType && selStyle ? productsForStyle(selType, selStyle) : []
  const selColors: ColorOption[] = selType && selProduct
    ? (productsForStyle(selType, selStyle ?? '').find(([k]) => k === selProduct)?.[1].colors ?? [])
    : []

  const canProceed = Boolean(selType && selColor)

  // ── Shared style helpers ───────────────────────────────────────────────────
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '9px 16px', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const,
    background: active ? C.accent : 'transparent',
    color: active ? C.black : C.mutedLight,
    border: `1px solid ${active ? C.accent : C.border}`,
    borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: "'Outfit',sans-serif", fontWeight: 500,
  })

  const sectionCard: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: '20px 24px', marginBottom: 12,
  }

  const estimateHref = `/estimate?address=${encodeURIComponent(address)}&roofType=${encodeURIComponent(selType ?? '')}&product=${encodeURIComponent(selProduct ?? '')}&color=${encodeURIComponent(selColor ?? '')}&firstName=${encodeURIComponent(gateData.firstName)}&phone=${encodeURIComponent(gateData.phone)}&leadOrigin=visualizer`

  return (
    <>
      <style>{fonts + globalStyles + `
        @keyframes vspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes vfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes vchoice{0%{transform:scale(1)}50%{transform:scale(0.97)}100%{transform:scale(1)}}
      `}</style>
      <div style={{ background: C.black, minHeight: '100vh', color: C.white, fontFamily: "'Outfit',system-ui,sans-serif" }}>

        <SiteNav/>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,48px)', paddingTop: 84 }}>

          {/* ── address ── */}
          {step === 'address' && (
            <div style={{ animation: 'vfade 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>AI Roof Visualizer</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
                  See Your Home With<br /><span style={{ color: C.accent, fontStyle: 'italic' }}>a Metal Roof</span>
                </h1>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: 460, margin: '0 auto' }}>
                  Enter your address and choose a material. Our AI renders your home with a metal roof in under 60 seconds — no upload required.
                </p>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', minWidth: 180 }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6.1c-.94 0-1.7-.76-1.7-1.7S7.06 4.2 8 4.2s1.7.76 1.7 1.7S8.94 7.6 8 7.6z" fill={C.muted} />
                  </svg>
                  <input
                    ref={addrRef}
                    value={address}
                    onChange={e => { setAddress(e.target.value); setAddrError('') }}
                    onKeyDown={e => e.key === 'Enter' && !locating && handleVisualize()}
                    placeholder="Enter your home address…"
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.white, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}
                  />
                </div>
                <button
                  onClick={handleVisualize}
                  disabled={locating}
                  style={{ padding: '13px 22px', background: locating ? C.accentDark : C.accent, color: C.black, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, borderRadius: 6, whiteSpace: 'nowrap', cursor: locating ? 'not-allowed' : 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (!locating) e.currentTarget.style.background = C.accentLight }}
                  onMouseLeave={e => { e.currentTarget.style.background = locating ? C.accentDark : C.accent }}
                >{locating ? 'Locating…' : 'Visualize My Roof →'}</button>
              </div>
              {addrError && <div style={{ fontSize: 11, color: '#F87171', marginBottom: 8 }}>{addrError}</div>}
              {locating && (
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: C.muted }}>
                  Locating <span style={{ color: C.accentLight }}>{address}</span>…
                </div>
              )}
              <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 10 }}>No photo upload · No obligation · Under 60 seconds</p>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 40, paddingTop: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: C.muted }}>
                  Already know what you want?{' '}
                  <Link href="/estimate" style={{ color: C.accent, textDecoration: 'underline' }}>Get an instant estimate →</Link>
                </p>
              </div>
            </div>
          )}

          {/* ── select ── */}
          {step === 'select' && (
            <div style={{ animation: 'vfade 0.3s ease' }}>
              <button onClick={() => setStep('address')} style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', fontFamily: "'Outfit',sans-serif", marginBottom: 28 }}>← Back</button>

              {/* Satellite confirmation card */}
              <div style={{ ...sectionCard, marginBottom: 20 }}>
                {satelliteUrl ? (
                  <>
                    <img src={satelliteUrl} alt="Satellite view" style={{ width: '100%', maxWidth: 480, height: 260, objectFit: 'cover', borderRadius: 8, display: 'block', marginBottom: 12 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0 }}>✓</div>
                      <div style={{ fontSize: 11, color: C.muted }}>Satellite image confirmed</div>
                      <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{address}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: '100%', maxWidth: 480, height: 260, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 12 }}>🛰</div>
                    <div>
                      <div style={{ fontSize: 13, color: C.white, fontWeight: 500, marginBottom: 4 }}>{address}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>Satellite image unavailable — your render will be based on your address</div>
                    </div>
                  </>
                )}
              </div>

              {/* Roof type tabs */}
              <div style={sectionCard}>
                <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Choose Your Material</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(ROOF_TYPE_ORDER as readonly string[]).map(rt => (
                    <button key={rt} onClick={() => pickType(rt)} style={tabBtn(selType === rt)}>{getRoofTypeLabel(rt)}</button>
                  ))}
                </div>
              </div>

              {/* Style tabs */}
              {selType && selStyles.length > 1 && !hasExactlyOneProduct(selType) && (
                <div style={sectionCard}>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Style</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selStyles.map(([sk, so]) => (
                      <button key={sk} style={tabBtn(selStyle === sk)} onClick={() => {
                        setSelProduct(null); setSelColor(null); setSelStyle(sk)
                        const sp = productsForStyle(selType, sk)
                        if (sp.length === 1) { setSelProduct(sp[0][0]); if (sp[0][1].colors.length === 1) setSelColor(sp[0][1].colors[0].name) }
                      }}>{so.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product grid */}
              {selType && selStyle && selProducts.length > 1 && (
                <div style={sectionCard}>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Product</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {selProducts.map(([pk, po]) => (
                      <button key={pk} onClick={() => { setSelColor(null); setSelProduct(pk) }}
                        style={{ background: selProduct === pk ? `${C.accentDark}33` : C.surface, border: `1px solid ${selProduct === pk ? C.accentDark : C.border}`, borderRadius: 6, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: selProduct === pk ? C.accent : C.white, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>{po.label}</div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{po.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Circular color swatches */}
              {selType && selProduct && selColors.length > 0 && (
                <div style={sectionCard}>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Color</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {selColors.map((c: ColorOption) => (
                      <button key={c.name} onClick={() => setSelColor(c.name)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                      >
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
                          border: `2px solid ${selColor === c.name ? C.accent : C.border}`,
                          boxShadow: selColor === c.name ? `0 0 0 2px ${C.accent}` : 'none',
                          background: c.hex ?? C.surface, transition: 'all 0.15s',
                        }}>
                          {c.image1 && <img src={c.image1} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                        </div>
                        <span style={{ fontSize: 10, color: selColor === c.name ? C.accent : C.muted, textAlign: 'center', lineHeight: 1.3, fontFamily: "'Outfit',sans-serif", maxWidth: 60 }}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep('gate')}
                disabled={!canProceed}
                style={{ width: '100%', padding: '16px', background: canProceed ? C.accent : C.border, color: canProceed ? C.black : C.muted, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 4, cursor: canProceed ? 'pointer' : 'not-allowed', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s', marginTop: 4 }}
                onMouseEnter={e => { if (canProceed) e.currentTarget.style.background = C.accentLight }}
                onMouseLeave={e => { e.currentTarget.style.background = canProceed ? C.accent : C.border }}
              >
                {canProceed ? 'Next: Enter Your Details →' : selType ? 'Select a color to continue' : 'Select a material to continue'}
              </button>
            </div>
          )}

          {/* ── gate ── */}
          {step === 'gate' && (
            <div style={{ animation: 'vfade 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* Card container */}
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
                    width: `${((gateScreen + 1) / 5) * 100}%`,
                    background: C.accent,
                    transition: 'width 0.35s ease',
                  }} />
                </div>

                <div style={{ padding: 'clamp(24px,4vw,36px)' }}>

                  {/* Step label */}
                  <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>
                    Step {gateScreen + 1} of 5
                  </div>

                  {/* Screens 0–3: choice cards */}
                  {gateScreen < 4 && (() => {
                    const screen = GATE_SCREENS[gateScreen]
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
                            const isSelected = gateData[screen.field] === choice.value
                            const isPending  = pendingChoice === choice.value
                            return (
                              <button
                                key={choice.value}
                                onClick={() => handleChoice(screen.field, choice.value)}
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
                                  animation: isPending ? 'vchoice 0.22s ease' : 'none',
                                }}
                                onMouseEnter={e => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = C.accentDark
                                    e.currentTarget.style.background = `${C.accentDark}11`
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = C.border
                                    e.currentTarget.style.background = C.card
                                  }
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

                  {/* Screen 4: contact form */}
                  {gateScreen === 4 && (() => {
                    const labelStyle = { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: C.muted, marginBottom: 6 }
                    const errStyle = { fontSize: 11, color: '#F87171', marginTop: 4 }
                    return (
                      <>
                        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(20px,3.5vw,26px)', fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 8 }}>
                          Almost there. How do we reach you?
                        </h2>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
                          We&apos;ll send your AI-rendered roof design to this number — no spam, ever.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                          <div>
                            <div style={labelStyle}>First Name *</div>
                            <input value={gateData.firstName}
                              onChange={e => setGateData(d => ({ ...d, firstName: e.target.value }))}
                              placeholder="Jane" style={iStyle} />
                            {contactErrors.firstName && <div style={errStyle}>{contactErrors.firstName}</div>}
                          </div>
                          <div>
                            <div style={labelStyle}>Last Name *</div>
                            <input value={gateData.lastName}
                              onChange={e => setGateData(d => ({ ...d, lastName: e.target.value }))}
                              placeholder="Smith" style={iStyle} />
                            {contactErrors.lastName && <div style={errStyle}>{contactErrors.lastName}</div>}
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={labelStyle}>Phone *</div>
                          <input value={gateData.phone} type="tel"
                            onChange={e => setGateData(d => ({ ...d, phone: e.target.value }))}
                            placeholder="(817) 555-0100" style={iStyle} />
                          {contactErrors.phone && <div style={errStyle}>{contactErrors.phone}</div>}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={labelStyle}>Email *</div>
                          <input value={gateData.email} type="email"
                            onChange={e => setGateData(d => ({ ...d, email: e.target.value }))}
                            placeholder="jane@email.com" style={iStyle} />
                          {contactErrors.email && <div style={errStyle}>{contactErrors.email}</div>}
                        </div>
                        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
                          <input type="checkbox" checked={gateData.smsConsent}
                            onChange={e => setGateData(d => ({ ...d, smsConsent: e.target.checked }))}
                            style={{ marginTop: 2, accentColor: C.accent, width: 15, height: 15, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                            I agree to receive SMS messages about my roof visualization and estimate. Message &amp; data rates may apply. Reply STOP to opt out.
                          </span>
                        </label>
                        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16, cursor: 'pointer' }}>
                          <input type="checkbox" checked={gateData.emailConsent}
                            onChange={e => setGateData(d => ({ ...d, emailConsent: e.target.checked }))}
                            style={{ marginTop: 2, accentColor: C.accent, width: 15, height: 15, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                            I agree to receive email updates about my estimate and Metroplex Metal Roofs promotions.
                          </span>
                        </label>
                        <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.7, marginBottom: 16, padding: '10px 12px', background: C.surface, borderRadius: 4, border: `1px solid ${C.border}` }}>
                          By submitting, you consent to being contacted by Metroplex Metal Roofs regarding your inquiry. Your information is never sold or shared with third parties.
                        </div>
                        <button
                          onClick={handleContactSubmit}
                          disabled={gateLoading}
                          style={{ width: '100%', padding: '15px', background: gateLoading ? C.accentDark : C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 6, cursor: gateLoading ? 'not-allowed' : 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
                          onMouseEnter={e => { if (!gateLoading) e.currentTarget.style.background = C.accentLight }}
                          onMouseLeave={e => { e.currentTarget.style.background = gateLoading ? C.accentDark : C.accent }}
                        >{gateLoading ? 'Submitting…' : 'Generate My Visualization →'}</button>
                      </>
                    )
                  })()}

                </div>
              </div>

              {/* Back button (below card, screens 1–4) */}
              {gateScreen > 0 && (
                <button
                  onClick={() => setGateScreen(s => s - 1)}
                  style={{ marginTop: 16, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0', textDecoration: 'underline', fontFamily: "'Outfit',sans-serif" }}
                >
                  ← Back
                </button>
              )}
              {gateScreen === 0 && (
                <button
                  onClick={() => setStep('select')}
                  style={{ marginTop: 16, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0', textDecoration: 'underline', fontFamily: "'Outfit',sans-serif" }}
                >
                  ← Back to material selection
                </button>
              )}

            </div>
          )}

          {/* ── loading ── */}
          {step === 'loading' && (
            <div style={{ textAlign: 'center', padding: '80px 32px', animation: 'vfade 0.3s ease' }}>
              <svg width="52" height="52" viewBox="0 0 44 44" style={{ animation: 'vspin 1.1s linear infinite', display: 'inline-block', marginBottom: 24 }}>
                <circle cx="22" cy="22" r="18" stroke={C.border} strokeWidth="3" fill="none" />
                <path d="M22 4 A18 18 0 0 1 40 22" stroke={C.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,3vw,24px)', color: C.white, marginBottom: 12, lineHeight: 1.4 }}>
                {LOADING_PHRASES[phraseIdx]}
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>
                Rendering <span style={{ color: C.accentLight }}>{selColor} {getRoofTypeLabel(selType ?? '')}</span>
                {gateData.firstName ? ` for ${gateData.firstName}` : ''}
              </div>
            </div>
          )}

          {/* ── results ── */}
          {step === 'results' && (
            <div style={{ animation: 'vfade 0.3s ease' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: C.white, marginBottom: 8, textAlign: 'center' }}>Your Roof Visualization</div>
              <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 24 }}>
                {selColor} {getRoofTypeLabel(selType ?? '')} · {address}
              </p>
              {renderUrl ? (
                <img src={renderUrl} alt="AI roof visualization" style={{ width: '100%', borderRadius: 8, display: 'block', marginBottom: 16, border: `1px solid ${C.border}` }} />
              ) : (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '48px 32px', textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, color: C.muted }}>Visualization processing — you&apos;ll receive it by email shortly.</div>
                </div>
              )}
              <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                AI-generated visualization for reference only. Actual appearance may vary based on home architecture, lighting, and installation details.
              </p>
              <a
                href={estimateHref}
                style={{ display: 'block', padding: '16px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 4, textDecoration: 'none', textAlign: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Get Your Full Estimate →</a>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
