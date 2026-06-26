'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const C = {
  black:      '#09090A',
  surface:    '#111113',
  card:       '#18181B',
  border:     '#27272A',
  accent:     '#B8935A',
  accentLight:'#D4AE7A',
  accentDark: '#8C6A38',
  white:      '#F4F1EB',
  muted:      '#71717A',
  mutedLight: '#A1A1AA',
}

const PHONE = '(817) 382-3338'

function Logo({ size = 1 }: { size?: number }) {
  return (
    <svg width={240 * size} height={66 * size} viewBox="0 0 240 66" fill="none" style={{ display: 'block' }}>
      <path d="M6 48 L26 14 L40 32 L26 32 Z" fill={C.accent} />
      <path d="M40 32 L54 14 L64 48 L40 48 Z" fill={C.accent} opacity="0.72" />
      <line x1="26" y1="14" x2="54" y2="14" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="6"  y1="48" x2="64" y2="48" stroke={C.accent} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="19" y1="48" x2="33" y2="23" stroke="#000" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
      <line x1="52" y1="48" x2="46" y2="23" stroke="#000" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
      <text x="76" y="28" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="16" fontWeight="700" letterSpacing="3" fill={C.white}>METROPLEX</text>
      <text x="76" y="44" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="11" fontWeight="400" letterSpacing="5" fill={C.accent}>METAL ROOFS</text>
      <line x1="76" y1="49" x2="233" y2="49" stroke={C.accent} strokeWidth="0.4" opacity="0.4" />
      <text x="76" y="59" fontFamily="'Outfit',sans-serif" fontSize="7" letterSpacing="2.5" fill={C.white} opacity="0.38">DALLAS · FORT WORTH</text>
    </svg>
  )
}

type Step = 'entry' | 'loading' | 'gate' | 'done'

const ROOF_TYPES = [
  { id: 'standing_seam',       label: 'Standing Seam' },
  { id: 'copper_standing_seam',label: 'Copper' },
  { id: 'stone_coated_steel',  label: 'Stone-Coated Steel' },
  { id: 'r_panel',             label: 'R-Panel' },
]

export default function VisualizerPage() {
  const [step, setStep] = useState<Step>('entry')
  const [address, setAddress] = useState('')
  const [addrError, setAddrError] = useState('')
  const [roofType, setRoofType] = useState('standing_seam')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<boolean>(false)

  // Texas bounds for Places Autocomplete bias
  const TX_BOUNDS = {
    north: 36.5,
    south: 25.8,
    east:  -93.5,
    west:  -106.6,
  }

  useEffect(() => {
    if (step !== 'entry' || !inputRef.current) return

    function attach() {
      if (!inputRef.current || autocompleteRef.current || !(window as any).google?.maps?.places) return
      const bounds = new (window as any).google.maps.LatLngBounds(
        { lat: TX_BOUNDS.south, lng: TX_BOUNDS.west },
        { lat: TX_BOUNDS.north, lng: TX_BOUNDS.east }
      )
      const ac = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        bounds,
        strictBounds: false,
      })
      ac.addListener('place_changed', () => {
        const place = ac.getPlace()
        if (place?.formatted_address) setAddress(place.formatted_address)
      })
      autocompleteRef.current = true
    }

    if ((window as any).google?.maps?.places) { attach(); return }

    const existing = document.querySelector<HTMLScriptElement>('script[data-gmaps]')
    if (existing) { existing.addEventListener('load', attach); return () => existing.removeEventListener('load', attach) }

    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    s.async = true; s.defer = true; s.dataset.gmaps = 'true'
    s.addEventListener('load', attach)
    document.head.appendChild(s)
  }, [step])

  function handleVisualize() {
    if (!address.trim()) { setAddrError('Please enter your property address.'); return }
    setAddrError('')
    setStep('loading')
    setTimeout(() => setStep('gate'), 2400)
  }

  function validateForm() {
    const e: Record<string, string> = {}
    if (!form.name.trim())  e.name  = 'Name is required.'
    if (!form.phone.trim()) e.phone = 'Phone is required.'
    else if (!/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    return e
  }

  function handleSubmit() {
    const e = validateForm()
    if (Object.keys(e).length) { setFormErrors(e); return }
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setStep('done') }, 1000)
  }

  const iStyle: React.CSSProperties = {
    width: '100%', background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 4, padding: '12px 14px', color: C.white, fontSize: 14,
    outline: 'none', fontFamily: "'Outfit',sans-serif", boxSizing: 'border-box',
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap" />
      <style>{`@keyframes vspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ background: C.black, minHeight: '100vh', color: C.white, fontFamily: "'Outfit',system-ui,sans-serif" }}>
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'block', textDecoration: 'none' }}>
            <Logo size={0.75} />
          </Link>
          <Link href="/estimate" style={{ padding: '9px 20px', background: C.accent, color: C.black, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Get Estimate
          </Link>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,48px)' }}>

          {step === 'entry' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 12, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>AI Roof Visualizer</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
                  See Your Home With<br /><span style={{ color: C.accent, fontStyle: 'italic' }}>a Metal Roof</span>
                </h1>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
                  Enter your address. Our AI pulls a street-level image of your exact home and renders it with your chosen metal roof style — no imagination required.
                </p>
              </div>

              {/* Roof type selector */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>Select roof type</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ROOF_TYPES.map(rt => (
                    <button
                      key={rt.id}
                      onClick={() => setRoofType(rt.id)}
                      style={{
                        padding: '9px 16px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
                        background: roofType === rt.id ? C.accent : 'transparent',
                        color: roofType === rt.id ? C.black : C.mutedLight,
                        border: `1px solid ${roofType === rt.id ? C.accent : C.border}`,
                        borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >{rt.label}</button>
                  ))}
                </div>
              </div>

              {/* Address input */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', minWidth: 180 }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6.1c-.94 0-1.7-.76-1.7-1.7S7.06 4.2 8 4.2s1.7.76 1.7 1.7S8.94 7.6 8 7.6z" fill={C.muted} />
                  </svg>
                  <input
                    ref={inputRef}
                    value={address}
                    onChange={e => { setAddress(e.target.value); setAddrError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleVisualize()}
                    placeholder="Enter your home address…"
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.white, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}
                  />
                </div>
                <button
                  onClick={handleVisualize}
                  style={{ padding: '13px 22px', background: C.accent, color: C.black, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, borderRadius: 6, whiteSpace: 'nowrap', transition: 'background 0.2s', cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accentLight }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
                >Visualize →</button>
              </div>
              {addrError && <div style={{ fontSize: 11, color: '#F87171', marginBottom: 8 }}>{addrError}</div>}
              <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 8 }}>No photo upload · Under 30 seconds · No obligation</p>

              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 48, paddingTop: 24, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: C.muted }}>
                  Already know what you want?{' '}
                  <Link href="/estimate" style={{ color: C.accent, textDecoration: 'underline' }}>Get an instant estimate →</Link>
                </p>
              </div>
            </>
          )}

          {step === 'loading' && (
            <div style={{ textAlign: 'center', padding: '60px 32px' }}>
              <svg width="44" height="44" viewBox="0 0 44 44" style={{ animation: 'vspin 1.1s linear infinite', display: 'inline-block', marginBottom: 20 }}>
                <circle cx="22" cy="22" r="18" stroke={C.border} strokeWidth="3" fill="none" />
                <path d="M22 4 A18 18 0 0 1 40 22" stroke={C.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: C.white, marginBottom: 8 }}>Rendering your roof…</div>
              <div style={{ fontSize: 13, color: C.muted }}>Locating <span style={{ color: C.accentLight }}>{address}</span></div>
            </div>
          )}

          {step === 'gate' && (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: C.white, marginBottom: 6, textAlign: 'center' }}>Your render is ready</div>
              <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 32 }}>Enter your details to view it and receive a free estimate.</p>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,4vw,40px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Full Name *</div>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" style={iStyle} />
                    {formErrors.name && <div style={{ fontSize: 11, color: '#F87171', marginTop: 4 }}>{formErrors.name}</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Phone *</div>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(214) 555-0000" type="tel" style={iStyle} />
                    {formErrors.phone && <div style={{ fontSize: 11, color: '#F87171', marginTop: 4 }}>{formErrors.phone}</div>}
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Email *</div>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@email.com" type="email" style={iStyle} />
                  {formErrors.email && <div style={{ fontSize: 11, color: '#F87171', marginTop: 4 }}>{formErrors.email}</div>}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ width: '100%', padding: '15px', background: submitting ? C.accentDark : C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 4, cursor: submitting ? 'not-allowed' : 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentLight }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = C.accent }}
                >{submitting ? 'Submitting…' : 'View My Roof Rendering →'}</button>
              </div>
            </>
          )}

          {step === 'done' && (
            <div style={{ background: C.card, border: `1px solid ${C.accentDark}`, borderRadius: 8, padding: 'clamp(32px,5vw,52px)', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${C.accentDark}44`, border: `1px solid ${C.accentDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 20, color: C.accent }}>✓</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: C.white, marginBottom: 12 }}>You&apos;re all set.</div>
              <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
                Your visualization is being prepared. Our team will follow up with your full render and a free estimate — typically within one business day.
              </p>
              <Link
                href={`/estimate?address=${encodeURIComponent(address)}&roofType=${encodeURIComponent(roofType)}&leadOrigin=visualizer`}
                style={{ display: 'inline-block', padding: '14px 32px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none', marginBottom: 20 }}
              >Get Your Full Estimate →</Link>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>
                Questions? <a href={`tel:+18173823338`} style={{ color: C.accent }}>{PHONE}</a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
