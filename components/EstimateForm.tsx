'use client'

import { useState, useEffect, useRef } from 'react'
import EstimateResult from './EstimateResult'
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

  // Address arrived pre-confirmed via the visualizer's own Places Autocomplete
  // step, so this path skips the redundant re-confirmation click entirely.
  const shouldAutoTrigger = Boolean(carriedRoofType && initialSelection?.address)

  const [selectedRoofType, setSelectedRoofType] = useState<string | null>(carriedRoofType)
  const [selectedStyle, setSelectedStyle]       = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct]   = useState<string | null>(null)
  const [selectedColor, setSelectedColor]       = useState<string | null>(null)
  const [address, setAddress]     = useState(initialSelection?.address ?? '')
  const [loading, setLoading]     = useState(shouldAutoTrigger)
  const [showManual, setShowManual] = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [manualSqFt, setManualSqFt] = useState('')
  const [stories, setStories]     = useState<StoryOption>('one')
  const [result, setResult]       = useState<EstimateData | null>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)
  const autocompleteAttachedRef = useRef(false)
  const autoTriggeredRef = useRef(false)

  // Load Google Maps API and initialize Places Autocomplete.
  // The address input only exists in the DOM once selectedRoofType is set
  // AND loading is false (Step 2's loading branch pre-empts it on the
  // auto-trigger path), so this must re-run on either changing — not just
  // on mount — otherwise neither the cold-visit path nor the auto-trigger
  // failure fallback ever attaches it.
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
  }, [selectedRoofType, loading])

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

  // Passed through silently (no UI) so route.ts can forward identity/qualifying
  // data and lead source to the GHL webhook on both submission paths.
  function leadFields() {
    return {
      firstName: leadInfo?.firstName,
      lastName: leadInfo?.lastName,
      phone: leadInfo?.phone,
      email: leadInfo?.email,
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

  async function handleAddressSubmit(): Promise<boolean> {
    if (!address.trim()) return false
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, roofType: selectedRoofType, ...leadFields() }),
      })
      const data = await res.json()
      if (data.success && data.estimate && data.roofType) {
        setResult({ roofType: data.roofType, estimate: data.estimate })
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

  // Auto-trigger the calculation once on mount when arriving from the
  // visualizer with a pre-confirmed address. On failure, drop back to the
  // plain editable address screen (not the sqft fallback) so the user can
  // simply retry the same address rather than re-explaining their home.
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
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualSqFt: sqFt, stories, roofType: selectedRoofType, ...leadFields() }),
      })
      const data = await res.json()
      if (data.success && data.estimate && data.roofType) {
        setResult({ roofType: data.roofType, estimate: data.estimate })
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
    return <EstimateResult roofType={result.roofType} estimate={result.estimate} />
  }

  if (loading) {
    return (
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
    )
  }

  // Step 1 — material selector (roof type → style → product → color)
  if (!selectedRoofType) {
    return <MaterialSelector onSelect={(rt, style, product, color) => {
      setSelectedRoofType(rt)
      setSelectedStyle(style)
      setSelectedProduct(product)
      setSelectedColor(color)
    }} />
  }

  const selectedLabel = getRoofTypeLabel(selectedRoofType)

  // Step 2 — address input + optional manual fallback
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Back + selected type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => { setSelectedRoofType(null); setSelectedStyle(null); setSelectedProduct(null); setSelectedColor(null); setShowManual(false); setErrorMsg('') }}
          style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', fontFamily: "'Outfit',sans-serif" }}
        >
          ← Back
        </button>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {selectedLabel}
          {selectedProduct && selectedColor && (
            <span style={{ color: C.mutedLight }}> — {getProductLabel(selectedRoofType, selectedProduct)} · {selectedColor}</span>
          )}
        </div>
      </div>

      {carriedRoofType && selectedRoofType === carriedRoofType && carriedProductLabel && carriedColor && (
        <div style={{ fontSize: 12, color: C.mutedLight, marginBottom: 16, lineHeight: 1.6, fontFamily: "'Outfit',sans-serif" }}>
          Estimating for: {selectedLabel} — {carriedProductLabel} in {carriedColor}
        </div>
      )}

      {!showManual ? (
        <>
          {errorMsg && (
            <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: C.mutedLight, lineHeight: 1.7 }}>
              {errorMsg}
            </div>
          )}

          <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 8 }}>
            Enter your property address
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
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
                onKeyDown={e => e.key === 'Enter' && handleAddressSubmit()}
                placeholder="123 Main St, Southlake, TX"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.white, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}
              />
            </div>
            <button
              onClick={handleAddressSubmit}
              style={{ padding: '13px 20px', background: C.accent, color: C.black, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, borderRadius: 4, whiteSpace: 'nowrap', transition: 'background 0.2s', cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.accentLight }}
              onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
            >
              Calculate My Estimate →
            </button>
          </div>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    padding: '10px 16px',
                    background: stories === val ? `${C.accentDark}33` : C.card,
                    border: `1px solid ${stories === val ? C.accentDark : C.border}`,
                    borderRadius: 4,
                    fontSize: 13,
                    color: stories === val ? C.accent : C.mutedLight,
                    transition: 'all 0.15s',
                    fontFamily: "'Outfit',sans-serif",
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
  )
}

// ── Material Selector (Step 1) ────────────────────────────────────────────────

interface MaterialSelectorProps {
  onSelect: (roofType: string, style: string | null, product: string | null, color: string | null) => void
}

function MaterialSelector({ onSelect }: MaterialSelectorProps) {
  const [roofType, setRoofType] = useState<string | null>(null)
  const [style, setStyle]       = useState<string | null>(null)
  const [product, setProduct]   = useState<string | null>(null)
  const [color, setColor]       = useState<string | null>(null)

  const styles   = roofType ? stylesWithColors(roofType) : []
  const hasStyles = styles.length > 0
  const products  = roofType && style ? productsForStyle(roofType, style) : []
  const colors    = roofType && product
    ? productsForStyle(roofType, style ?? '').find(([k]) => k === product)?.[1].colors ?? []
    : []

  function selectRoofType(rt: string) {
    setStyle(null); setProduct(null); setColor(null); setRoofType(rt)
    if (hasExactlyOneProduct(rt)) {
      const auto = getAutoSelectedStyleAndProduct(rt)
      if (auto) {
        setStyle(auto.style); setProduct(auto.product)
        const autoColors = productsForStyle(rt, auto.style).find(([k]) => k === auto.product)?.[1].colors ?? []
        if (autoColors.length === 1) setColor(autoColors[0].name)
      }
    }
  }

  const isComplete = Boolean(roofType && style && product && color)

  const sectionStyle: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 12,
  }
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '10px 16px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' as const,
    background: active ? C.accent : 'transparent',
    color: active ? C.black : C.mutedLight,
    border: `1px solid ${active ? C.accent : C.border}`,
    borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Outfit',sans-serif",
  })

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <p style={{ fontSize: 13, color: C.mutedLight, marginBottom: 24, textAlign: 'center', lineHeight: 1.6 }}>
        Select your material to get started.
      </p>

      {/* Roof type tabs */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Material</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(ROOF_TYPE_ORDER as readonly string[]).map(rt => (
            <button key={rt} onClick={() => selectRoofType(rt)} style={tabBtn(roofType === rt)}>
              {getRoofTypeLabel(rt)}
            </button>
          ))}
        </div>
      </div>

      {/* Style selector (stone-coated only) */}
      {roofType && hasStyles && !hasExactlyOneProduct(roofType) && (
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Style</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {styles.map(([sk, so]) => (
              <button key={sk} style={tabBtn(style === sk)} onClick={() => {
                setProduct(null); setColor(null); setStyle(sk)
                const sp = productsForStyle(roofType, sk)
                if (sp.length === 1) {
                  setProduct(sp[0][0])
                  if (sp[0][1].colors.length === 1) setColor(sp[0][1].colors[0].name)
                }
              }}>{so.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Product cards (stone-coated styles with multiple products) */}
      {roofType && hasStyles && style && products.length > 1 && (
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Product</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {products.map(([pk, po]) => (
              <button key={pk} onClick={() => { setColor(null); setProduct(pk) }}
                style={{ background: product === pk ? `${C.accentDark}33` : C.surface, border: `1px solid ${product === pk ? C.accentDark : C.border}`, borderRadius: 6, padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: product === pk ? C.accent : C.white, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>{po.label}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{po.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color swatches with product images */}
      {roofType && hasStyles && product && colors.length > 0 && (
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Color</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {colors.map((c: ColorOption) => (
              <button key={c.name} onClick={() => setColor(c.name)}
                style={{ background: color === c.name ? `${C.accentDark}33` : C.surface, border: `1px solid ${color === c.name ? C.accentDark : C.border}`, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
              >
                {c.image1 && (
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img src={c.image1} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, color: color === c.name ? C.accent : C.white, fontFamily: "'Outfit',sans-serif" }}>{c.name}</span>
                  {c.hex && <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.hex, border: `1px solid ${C.border}`, flexShrink: 0, display: 'inline-block' }}/>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => { if (roofType) onSelect(roofType, style, product, color) }}
        disabled={!isComplete}
        style={{ ...btnStyle, opacity: isComplete ? 1 : 0.45, cursor: isComplete ? 'pointer' : 'not-allowed', marginTop: 8 }}
        onMouseEnter={e => { if (isComplete) e.currentTarget.style.background = C.accentLight }}
        onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
      >
        {!roofType ? 'Select a material to continue' : !isComplete ? 'Select a color to continue' : 'Get My Estimate →'}
      </button>

      <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 16 }}>
        Want to see your home with a metal roof first?{' '}
        <a href="/visualizer" style={{ color: C.accent, textDecoration: 'underline' }}>Try the AI Visualizer →</a>
      </p>
    </div>
  )
}
