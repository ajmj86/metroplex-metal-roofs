'use client'

import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { C, fonts, globalStyles, PHONE, EMAIL } from '@/components/brand'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import {
  ROOF_TYPE_ORDER,
  getRoofTypeLabel,
  stylesWithColors,
  productsForStyle,
  hasExactlyOneProduct,
  getAutoSelectedStyleAndProduct,
  type ColorOption,
} from '@/lib/roofProducts'

type Step = 'checking' | 'welcome-back' | 'address' | 'select' | 'gate' | 'loading' | 'results'

const STEP_LABELS = ['Address', 'Roof Type', 'About You', 'Rendering', 'Results']
const STEP_KEYS: Step[] = ['address', 'select', 'gate', 'loading', 'results']

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
      { value: 'just_researching', label: 'Still Exploring My Options', icon: '📚' },
    ],
  },
]

export default function VisualizerPage() {
  const [step, setStep] = useState<Step>('checking')

  // returning-visitor recognition (cookie-based, with an email/phone lookup
  // fallback) — see app/api/returning-visitor/route.ts and .../lookup/route.ts
  const [returningContact, setReturningContact] = useState<{
    contactId: string; firstName: string; phone: string; email: string; address: string
  } | null>(null)
  // true only when the user confirms "yes, same address" from the welcome-back
  // screen (Case A) — false for a first-time visitor and for a returning
  // visitor who picked "not this property" (Case B), both of which go through
  // the normal address+gate flow.
  const [returningSameAddress, setReturningSameAddress] = useState(false)
  const [showLookup, setShowLookup] = useState(false)
  const [lookupValue, setLookupValue] = useState('')
  const [lookupSubmitting, setLookupSubmitting] = useState(false)
  const [lookupError, setLookupError] = useState('')

  // address step
  const [address, setAddress] = useState('')
  const [locating, setLocating] = useState(false)
  const [addrError, setAddrError] = useState('')
  const addrRef = useRef<HTMLInputElement>(null)
  const acAttached = useRef(false)
  const gateSubmittedRef = useRef(false)

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
  // Case B auto-submit trigger (recognized contact, skips the contact-info
  // screen) — set by handleChoice, consumed by the effect below. Routing
  // through state rather than calling handleContactSubmit directly from the
  // gate-choice click handler keeps that handler free of any ref access.
  const [autoSubmitData, setAutoSubmitData] = useState<GateData | null>(null)

  // loading / results
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [renderUrl, setRenderUrl] = useState<string | null>(null)
  const [roofSquares, setRoofSquares] = useState<number | null>(null)
  const [estimateLow, setEstimateLow] = useState<string | null>(null)
  const [estimateHigh, setEstimateHigh] = useState<string | null>(null)
  const [noPriceEstimate, setNoPriceEstimate] = useState(false)
  const [estimateMessage, setEstimateMessage] = useState<string | null>(null)
  const [solarFailureReason, setSolarFailureReason] = useState<string | null>(null)

  // manual square-footage fallback (shown at results when Solar comes back empty)
  const [manualSqFt, setManualSqFt] = useState('')
  const [manualStories, setManualStories] = useState<'one' | 'two' | 'unknown' | ''>('')
  const [manualSubmitting, setManualSubmitting] = useState(false)
  const [manualError, setManualError] = useState('')

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
    return () => s.removeEventListener('load', attach)
  }, [step])

  // ── Silent returning-visitor check (cookie-only) ────────────────────────────
  // Runs once on mount, before anything else renders (step starts at
  // 'checking' specifically so a first-time visitor — the common case — never
  // sees a flash of the address form before this resolves).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/returning-visitor')
        const data = await res.json()
        if (!cancelled && data.recognized) {
          setReturningContact(data)
          setAddress(data.address)
          setGateData(d => ({ ...d, firstName: data.firstName, phone: data.phone, email: data.email }))
          setStep('welcome-back')
          return
        }
      } catch {
        // silently fall through to the normal first-time flow
      }
      if (!cancelled) setStep('address')
    })()
    return () => { cancelled = true }
  }, [])

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
            email: gateData.email,
            estimateRange: noPriceEstimate ? (estimateMessage ?? '') : (estimateLow && estimateHigh ? `${estimateLow} - ${estimateHigh}` : ''),
          }),
        })
        const data = await res.json()
        if (!cancelled) {
          // render route returns data.image (not data.renderUrl) on success.
          // A non-2xx status or a missing image both mean generation failed —
          // don't assume success just because the fetch itself didn't throw.
          if (res.ok && data.image) {
            setRenderUrl(data.image)
          } else {
            console.error('[visualizer] render request failed:', res.status, data?.error)
            setRenderUrl(null)
          }
          setStep('results')
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[visualizer] render request threw:', err)
          setRenderUrl(null)
          setStep('results')
        }
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ── Case B auto-submit (recognized contact, skips the contact-info screen) ──
  // See handleChoice / autoSubmitData above. autoSubmitData is set at most
  // once per visit (only from handleChoice's last-screen branch), so this
  // effect fires exactly once on that transition — no need to reset it back
  // to null afterward.
  useEffect(() => {
    if (!autoSubmitData) return
    handleContactSubmit(autoSubmitData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmitData])

  // ── Lightweight roofType/style/product/color prefill (products section CTAs) ──
  // Each param only gets applied if it resolves to a real option given the
  // ones already applied — an invalid/missing param just stops the chain
  // one step early rather than throwing or setting a bogus value.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)

    const rt = params.get('roofType')
    if (!rt || !(ROOF_TYPE_ORDER as readonly string[]).includes(rt)) return
    setSelType(rt)

    // Materials with only one real style (standing seam, r-panel, copper)
    // auto-resolve it, same as pickType() does on a tab click — no need to
    // require a redundant ?style= param when there's only one valid value.
    let style: string | null = null
    if (hasExactlyOneProduct(rt)) {
      style = getAutoSelectedStyleAndProduct(rt)?.style ?? null
    } else {
      const styleParam = params.get('style')
      const styleMatch = styleParam && stylesWithColors(rt).find(([sk]) => sk === styleParam)
      style = styleMatch ? styleParam : null
    }
    if (!style) return
    setSelStyle(style)

    // Same auto-resolution for a style with exactly one product (e.g. every
    // stone style except "shingle").
    const styleProducts = productsForStyle(rt, style)
    let product: string | null = null
    if (styleProducts.length === 1) {
      product = styleProducts[0][0]
    } else {
      const productParam = params.get('product')
      const productMatch = productParam && styleProducts.find(([pk]) => pk === productParam)
      product = productMatch ? productParam : null
    }
    if (!product) return
    setSelProduct(product)

    const colorParam = params.get('color')
    const colors = styleProducts.find(([pk]) => pk === product)?.[1].colors ?? []
    if (colorParam && colors.some(c => c.name === colorParam)) setSelColor(colorParam)
  }, [])

  // ── Partial lead capture on tab close / navigation away during gate ────────
  useEffect(() => {
    if (step !== 'gate') return

    function handleUnload() {
      if (gateSubmittedRef.current) return
      fetch('/api/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          partial: true,
          leadOrigin: 'visualizer_partial',
          address,
          roofType: selType,
          colorSelected: selColor,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {})
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [step, address, selType, selColor])

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

  // Fallback recognition path for a new device / cleared cookie — see
  // app/api/returning-visitor/lookup/route.ts. On a match it behaves the same
  // as the silent cookie check: fetch display data and show 'welcome-back'.
  async function handleLookup() {
    const value = lookupValue.trim()
    if (!value) { setLookupError('Enter your email or phone number.'); return }
    setLookupSubmitting(true)
    setLookupError('')
    try {
      const isEmail = value.includes('@')
      const res = await fetch('/api/returning-visitor/lookup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEmail ? { email: value } : { phone: value }),
      })
      const data = await res.json()
      if (data.matched) {
        const rvRes = await fetch('/api/returning-visitor')
        const rvData = await rvRes.json()
        if (rvData.recognized) {
          setReturningContact(rvData)
          setAddress(rvData.address)
          setGateData(d => ({ ...d, firstName: rvData.firstName, phone: rvData.phone, email: rvData.email }))
          setStep('welcome-back')
          return
        }
      }
      setLookupError("We couldn't find a match — you can start a new rendering below.")
    } catch {
      setLookupError('Something went wrong. Please try again.')
    } finally {
      setLookupSubmitting(false)
    }
  }

  function handleChoice(field: keyof GateData, value: string) {
    setPendingChoice(value)
    // Compute the merged object explicitly rather than relying on the
    // `gateData` state variable being fresh by the time the timeout below
    // fires — needed because a recognized returning contact (Case B) submits
    // directly from this same tick sequence, before a re-render would have
    // updated the closed-over `gateData`.
    const updated = { ...gateData, [field]: value }
    setGateData(updated)
    setTimeout(() => {
      setPendingChoice(null)
      // A recognized contact already has name/phone/email — skip straight to
      // submit after the last GATE_SCREENS choice instead of showing the
      // contact-info screen (gateScreen 4) again. Routed through state (rather
      // than calling handleContactSubmit directly here) so the effect below —
      // not this click handler — owns triggering it.
      if (gateScreen === GATE_SCREENS.length - 1 && returningContact) {
        setAutoSubmitData(updated)
      } else {
        setGateScreen(s => s + 1)
        setTimeout(() => window.scrollTo(0, 0), 0)
      }
    }, 220)
  }

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length < 4) return digits
    if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  function validateContact(data: GateData = gateData) {
    const e: Record<string, string> = {}

    if (!data.firstName.trim())
      e.firstName = 'Required'

    const digits = data.phone.replace(/\D/g, '')
    if (!data.phone.trim())
      e.phone = 'Required'
    else if (digits.length !== 10)
      e.phone = 'Enter a valid 10-digit phone number'

    if (!data.email.trim())
      e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()))
      e.email = 'Enter a valid email address'

    return e
  }

  // overrideGateData: used only by handleChoice's Case-B auto-submit (skips
  // the contact-info screen for a recognized returning contact), so the
  // just-selected timeline value is used immediately rather than waiting for
  // the `gateData` state to catch up on the next render.
  async function handleContactSubmit(overrideGateData?: GateData) {
    const data = overrideGateData ?? gateData
    gateSubmittedRef.current = true
    const e = validateContact(data)
    if (Object.keys(e).length) { setContactErrors(e); return }
    setGateLoading(true)

    let squares: number | null = null
    let low: string | null = null
    let high: string | null = null
    let noPrice = false
    let message: string | null = null
    let failureReason: string | null = null
    try {
      const roofRes = await fetch('/api/roof-size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, roofType: selType, color: selColor }),
      })
      const roofData = await roofRes.json()
      squares = roofData.squares
      low = roofData.estimateLow
      high = roofData.estimateHigh
      noPrice = roofData.noPriceEstimate ?? false
      message = roofData.estimateMessage ?? null
      failureReason = roofData.solarFailureReason ?? null
    } catch {
      // non-blocking — continue to lead-intake regardless
    }
    setRoofSquares(squares)
    setEstimateLow(low)
    setEstimateHigh(high)
    setNoPriceEstimate(noPrice)
    setEstimateMessage(message)
    setSolarFailureReason(failureReason)

    try {
      const utmSource = sessionStorage.getItem('utm_source') || ''
      const utmMedium = sessionStorage.getItem('utm_medium') || ''
      const utmCampaign = sessionStorage.getItem('utm_campaign') || ''
      await fetch('/api/lead-intake', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          smsConsent: data.smsConsent,
          emailConsent: data.emailConsent,
          address,
          currentRoofType: data.currentRoofType,
          reason: data.reason,
          insuranceClaim: data.insuranceClaim,
          timeline: data.timeline,
          selectedRoofType: selType,
          product: selProduct,
          color: selColor,
          leadOrigin: 'visualizer',
          utm: { source: utmSource, medium: utmMedium, campaign: utmCampaign },
          estimatedRoofSize: squares,
          estimateRange: noPrice ? (message ?? undefined) : (low && high ? `${low} - ${high}` : undefined),
          solarFailureReason: failureReason ?? undefined,
          roofSizeSource: squares != null ? 'solar' : undefined,
        }),
      })

      // Case B only (returning contact, different address — see the
      // welcome-back / "not this property" flow): n8n's own opportunity
      // dedupe is contact-only, not address-aware, so it would reuse the
      // existing opportunity instead of creating a new one for this property.
      // Called strictly after /api/lead-intake resolves so n8n's own dedupe
      // search has already completed — no race between the two writes.
      if (returningContact) {
        await fetch('/api/create-opportunity', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactId: returningContact.contactId,
            firstName: data.firstName,
            lastName: data.lastName,
            address,
            reason: data.reason,
            timeline: data.timeline,
          }),
        }).catch(() => { /* non-blocking — lead-intake already succeeded */ })
      }
    } catch { /* advance anyway */ }
    finally {
      setGateLoading(false)
      setPhraseIdx(0)
      setStep('loading')
    }
  }

  // ── Case A: recognized contact, confirmed same address ──────────────────────
  // Skips the whole gate step (roof condition/reason/insurance/timeline are
  // property-specific and already on file) and — critically — never calls
  // /api/lead-intake, so nothing is written back to the contact's stored GHL
  // fields or the opportunity. /api/render's existing visualizer_render
  // webhook branch (contact search + send email, no contact/opportunity
  // writes) handles the branded email exactly as it already does for a
  // first-time render.
  async function handleReturningSameAddressSubmit() {
    setGateLoading(true)
    let squares: number | null = null
    let low: string | null = null
    let high: string | null = null
    let noPrice = false
    let message: string | null = null
    try {
      const roofRes = await fetch('/api/roof-size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, roofType: selType, color: selColor }),
      })
      const roofData = await roofRes.json()
      squares = roofData.squares
      low = roofData.estimateLow
      high = roofData.estimateHigh
      noPrice = roofData.noPriceEstimate ?? false
      message = roofData.estimateMessage ?? null
    } catch {
      // non-blocking — render step still proceeds without a price
    }
    setRoofSquares(squares)
    setEstimateLow(low)
    setEstimateHigh(high)
    setNoPriceEstimate(noPrice)
    setEstimateMessage(message)
    setGateLoading(false)
    setPhraseIdx(0)
    setStep('loading')
  }

  // ── Manual square-footage fallback (Solar came back empty) ─────────────────
  async function handleManualSubmit() {
    const sqFt = Number(manualSqFt)
    if (!manualSqFt || Number.isNaN(sqFt) || sqFt <= 0) {
      setManualError('Please enter a valid square footage.')
      return
    }
    setManualSubmitting(true)
    setManualError('')
    try {
      const res = await fetch('/api/roof-size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roofType: selType, color: selColor, manualSqFt: sqFt, stories: manualStories || 'unknown' }),
      })
      const data = await res.json()
      if (data.squares == null || (!data.noPriceEstimate && (!data.estimateLow || !data.estimateHigh))) {
        setManualError('Something went wrong calculating your estimate. Please try again.')
        return
      }
      setRoofSquares(data.squares)
      setEstimateLow(data.estimateLow)
      setEstimateHigh(data.estimateHigh)
      setNoPriceEstimate(data.noPriceEstimate ?? false)
      setEstimateMessage(data.estimateMessage ?? null)

      const utmSource = sessionStorage.getItem('utm_source') || ''
      const utmMedium = sessionStorage.getItem('utm_medium') || ''
      const utmCampaign = sessionStorage.getItem('utm_campaign') || ''
      // Update path for a contact already created during handleContactSubmit —
      // suppressAlert avoids paging Andrew a second time for the same lead.
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
          utm: { source: utmSource, medium: utmMedium, campaign: utmCampaign },
          estimatedRoofSize: data.squares,
          estimateRange: data.noPriceEstimate ? (data.estimateMessage ?? undefined) : `${data.estimateLow} - ${data.estimateHigh}`,
          roofSizeSource: 'manual',
          suppressAlert: true,
        }),
      }).catch(() => { /* estimate already shown to user regardless */ })
    } catch {
      setManualError('Something went wrong calculating your estimate. Please try again.')
    } finally {
      setManualSubmitting(false)
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

  return (
    <>
      <style>{fonts + globalStyles + `
        @keyframes vspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes vfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes vchoice{0%{transform:scale(1)}50%{transform:scale(0.97)}100%{transform:scale(1)}}
      `}</style>
      <div style={{ background: C.black, minHeight: '100vh', color: C.white, fontFamily: "'Outfit',system-ui,sans-serif" }}>

        {(step === 'address' || step === 'welcome-back' || step === 'results') && <SiteNav/>}

        <div style={{ maxWidth: 700, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,48px) 120px', paddingTop: step === 'address' || step === 'welcome-back' || step === 'results' ? 'clamp(108px,12vw,140px)' : 40 }}>

          {/* ── step indicator ── */}
          {(
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: C.white, marginBottom: 24 }}>
                Metal Roof Visualizer
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, maxWidth: 400, margin: '0 auto' }}>
                {STEP_KEYS.map((s, i) => {
                  const currentIdx = STEP_KEYS.indexOf(step)
                  const isComplete = i < currentIdx
                  const isActive = i === currentIdx
                  return (
                    <React.Fragment key={s}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: isComplete || isActive ? C.accent : C.surface,
                        border: `2px solid ${isComplete || isActive ? C.accent : C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                        color: isComplete || isActive ? C.black : C.muted,
                        transition: 'all 0.3s',
                      }}>
                        {isComplete ? '✓' : i + 1}
                      </div>
                      {i < STEP_KEYS.length - 1 && (
                        <div style={{
                          flex: 1, height: 2,
                          background: i < currentIdx ? C.accent : C.border,
                          transition: 'background 0.3s',
                        }} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 400, margin: '8px auto 0', padding: '0 4px' }}>
                {STEP_LABELS.map((label, i) => {
                  const currentIdx = STEP_KEYS.indexOf(step)
                  return (
                    <div key={label} style={{
                      fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                      color: i <= currentIdx ? C.accent : C.muted,
                      width: 32, textAlign: 'center', lineHeight: 1.3,
                      fontFamily: "'Outfit',sans-serif",
                    }}>{label}</div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── address ── */}
          {/* ── welcome back (recognized returning contact) ── */}
          {step === 'welcome-back' && returningContact && (
            <div style={{ animation: 'vfade 0.3s ease', textAlign: 'center' }}>
              <div style={{ fontSize: 13, letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>Welcome Back</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 16 }}>
                Hi {returningContact.firstName || 'there'} — still at<br/><span style={{ color: C.accent }}>{returningContact.address}</span>?
              </h1>
              <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: 460, margin: '0 auto 32px' }}>
                See it in a different material or color — no need to re-answer everything.
              </p>
              <button
                onClick={() => { setReturningSameAddress(true); handleVisualize() }}
                disabled={locating}
                style={{ width: '100%', maxWidth: 420, margin: '0 auto', display: 'block', padding: '16px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 4, opacity: locating ? 0.45 : 1, border: 'none', cursor: locating ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif", marginBottom: 16, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!locating) e.currentTarget.style.background = C.accentLight }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
              >{locating ? 'Locating…' : 'Yes — Try a Different Color →'}</button>
              <button
                onClick={() => { setReturningSameAddress(false); setAddress(''); setStep('address') }}
                style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', fontFamily: "'Outfit',sans-serif" }}
              >Not this property? Enter a different address</button>
            </div>
          )}

          {step === 'address' && (
            <div style={{ animation: 'vfade 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <div style={{ fontSize: 13, letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>AI Roof Visualizer</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
                  See Your Home With<br /><span style={{ color: C.accent, fontStyle: 'italic' }}>a Metal Roof</span>
                </h1>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: 460, margin: '0 auto' }}>
                  Enter your address and choose a material. We'll render your home with a metal roof and give you a price range — in under 60 seconds. No upload required.
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
                    autoComplete="off"
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.white, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}
                  />
                </div>
                <button
                  onClick={handleVisualize}
                  disabled={locating}
                  style={{ padding: '13px 22px', background: C.accent, color: C.black, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, borderRadius: 6, whiteSpace: 'nowrap', opacity: locating ? 0.45 : 1, cursor: locating ? 'not-allowed' : 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (!locating) e.currentTarget.style.background = C.accentLight }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
                >{locating ? 'Locating…' : 'Visualize My Roof →'}</button>
              </div>
              {addrError && <div style={{ fontSize: 11, color: '#F87171', marginBottom: 8 }}>{addrError}</div>}
              {locating && (
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: C.muted }}>
                  Locating <span style={{ color: C.accentLight }}>{address}</span>…
                </div>
              )}
              <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 10 }}>No photo upload · No obligation · Under 60 seconds</p>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                {!showLookup ? (
                  <button
                    onClick={() => setShowLookup(true)}
                    style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Outfit',sans-serif" }}
                  >Already got a rendering? Try another material</button>
                ) : (
                  <div style={{ maxWidth: 360, margin: '0 auto' }}>
                    <input
                      value={lookupValue}
                      onChange={e => { setLookupValue(e.target.value); setLookupError('') }}
                      onKeyDown={e => e.key === 'Enter' && !lookupSubmitting && handleLookup()}
                      placeholder="Email or phone number"
                      style={{ ...iStyle, marginBottom: 8 }}
                    />
                    {lookupError && <div style={{ fontSize: 11, color: '#F87171', marginBottom: 8 }}>{lookupError}</div>}
                    <button
                      onClick={handleLookup}
                      disabled={lookupSubmitting}
                      style={{ width: '100%', padding: '10px', background: C.surface, border: `1px solid ${C.border}`, color: C.white, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', borderRadius: 4, cursor: lookupSubmitting ? 'not-allowed' : 'pointer', opacity: lookupSubmitting ? 0.6 : 1, fontFamily: "'Outfit',sans-serif" }}
                    >{lookupSubmitting ? 'Checking…' : 'Find My Rendering'}</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── select ── */}
          {step === 'select' && (
            <div style={{ animation: 'vfade 0.3s ease' }}>
              <button onClick={() => setStep('address')} style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', fontFamily: "'Outfit',sans-serif", marginBottom: 28, marginTop: 24 }}>← Back</button>

              {/* Satellite confirmation card */}
              <div style={{ ...sectionCard, padding: 0, overflow: 'hidden', marginBottom: 20 }}>
                {satelliteUrl ? (
                  <>
                    <img src={satelliteUrl} alt="Satellite view" style={{
                      width: '100%', height: 220, objectFit: 'cover',
                      borderRadius: '6px 6px 0 0', display: 'block'
                    }} />
                    <div style={{
                      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
                      borderTop: `1px solid ${C.border}`
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', background: '#16A34A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0
                      }}>✓</div>
                      <div>
                        <div style={{ fontSize: 11, color: '#4ADE80', fontWeight: 600, marginBottom: 2 }}>
                          Satellite image confirmed
                        </div>
                        <div style={{ fontSize: 12, color: C.mutedLight }}>{address}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 8, background: C.surface,
                      border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 24, flexShrink: 0
                    }}>🛰</div>
                    <div>
                      <div style={{ fontSize: 13, color: C.white, fontWeight: 500, marginBottom: 4 }}>{address}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontStyle: 'italic', lineHeight: 1.5 }}>
                        No satellite image found — your render will use your address and selected style.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Roof type tabs */}
              <div style={sectionCard}>
                <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Choose Your Material</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {(ROOF_TYPE_ORDER as readonly string[]).map(rt => (
                    <button key={rt} onClick={() => pickType(rt)} style={{
                      padding: '16px 20px',
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: 'uppercase' as const,
                      background: selType === rt ? C.accent : C.surface,
                      color: selType === rt ? C.black : C.mutedLight,
                      border: `1.5px solid ${selType === rt ? C.accent : C.border}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: selType === rt ? 700 : 500,
                      boxShadow: selType === rt ? `0 0 12px ${C.accentDark}44` : 'none',
                      textAlign: 'center' as const,
                    }}
                    onMouseEnter={e => { if (selType !== rt) { e.currentTarget.style.borderColor = C.accentDark; e.currentTarget.style.color = C.white; }}}
                    onMouseLeave={e => { if (selType !== rt) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight; }}}
                    >{getRoofTypeLabel(rt)}</button>
                  ))}
                </div>
              </div>

              {/* Style tabs */}
              {selType && selStyles.length > 1 && !hasExactlyOneProduct(selType) && (
                <div style={sectionCard}>
                  <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Style</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selStyles.map(([sk, so]) => {
                      // Styles with exactly one product show that product's name
                      // instead of the generic style name (e.g. "Pine-Crest Shake"
                      // rather than "Shake") to match the homepage products section.
                      const stylePillProducts = productsForStyle(selType, sk)
                      const pillLabel = stylePillProducts.length === 1 ? stylePillProducts[0][1].label : so.label
                      return (
                        <button key={sk} style={tabBtn(selStyle === sk)} onClick={() => {
                          setSelProduct(null); setSelColor(null); setSelStyle(sk)
                          const sp = productsForStyle(selType, sk)
                          if (sp.length === 1) { setSelProduct(sp[0][0]); if (sp[0][1].colors.length === 1) setSelColor(sp[0][1].colors[0].name) }
                        }}>{pillLabel}</button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Product grid */}
              {selType && selStyle && selProducts.length > 1 && (
                <div style={sectionCard}>
                  <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Product</div>
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

              {/* Color swatches */}
              {selType && selProduct && selColors.length > 0 && (
                <div style={sectionCard}>
                  <div style={{ fontSize: 13, letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Color</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {selColors.map((c: ColorOption) => (
                      <button key={c.name} onClick={() => setSelColor(c.name)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        <div style={{
                          borderRadius: 8, overflow: 'hidden',
                          border: `2px solid ${selColor === c.name ? C.accent : C.border}`,
                          boxShadow: selColor === c.name ? `0 0 0 1px ${C.accent}, 0 0 12px ${C.accentDark}44` : 'none',
                          transition: 'all 0.15s',
                        }}>
                          {c.image1 ? (
                            <img src={c.image1} alt={c.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                          ) : (
                            <div style={{ width: '100%', height: 120, background: c.hex ?? C.surface }} />
                          )}
                          <div style={{
                            padding: '8px 10px',
                            background: selColor === c.name ? `${C.accentDark}33` : C.card,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6
                          }}>
                            <span style={{ fontSize: 13, color: selColor === c.name ? C.accent : C.mutedLight, fontFamily: "'Outfit',sans-serif", lineHeight: 1.3 }}>{c.name}</span>
                            {selColor === c.name && <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>✓</span>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selType === 'standing_seam' && (
                <p style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 20 }}>
                  Standing seam panels are standard 24-gauge steel — a premium, highly durable choice resistant to dents, wind uplift, and oil canning. Fastening system (snaplock or double mechanical lock) is matched to your roof&apos;s slope during final measurement.
                </p>
              )}

              <button
                onClick={() => {
                  window.scrollTo(0, 0)
                  if (returningSameAddress) {
                    handleReturningSameAddressSubmit()
                  } else {
                    setStep('gate')
                  }
                }}
                disabled={!canProceed || gateLoading}
                style={{ width: '100%', padding: '16px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 4, opacity: canProceed && !gateLoading ? 1 : 0.45, cursor: canProceed && !gateLoading ? 'pointer' : 'not-allowed', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s', marginTop: 4 }}
                onMouseEnter={e => { if (canProceed) e.currentTarget.style.background = C.accentLight }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
              >
                {gateLoading
                  ? 'Generating…'
                  : canProceed
                    ? (returningSameAddress ? 'Generate My Visualization →' : 'Next: Enter Your Details →')
                    : selType ? 'Select a color to continue' : 'Select a material to continue'}
              </button>
            </div>
          )}

          {/* ── gate ── */}
          {step === 'gate' && (
            <div style={{ animation: 'vfade 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 0 }}>

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

                  {/* Screens 0–3: choice cards */}
                  {gateScreen < 4 && (() => {
                    const screen = GATE_SCREENS[gateScreen]
                    return (
                      <>
                        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 8 }}>
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
                    const formReady =
                      gateData.firstName.trim().length > 0 &&
                      gateData.phone.replace(/\D/g, '').length === 10 &&
                      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gateData.email.trim())
                    return (
                      <>
                        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 8 }}>
                          Almost there. How do we reach you?
                        </h2>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
                          {gateData.timeline === 'just_researching'
                            ? "We'll send your render and a ballpark price range so you have a starting point for when you're ready."
                            : "We'll send your AI-rendered roof design to this number — no spam, ever."}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                          <div>
                            <div style={labelStyle}>First Name *</div>
                            <input value={gateData.firstName}
                              onChange={e => setGateData(d => ({ ...d, firstName: e.target.value }))}
                              placeholder="Jane" style={iStyle} />
                            {contactErrors.firstName && <div style={errStyle}>{contactErrors.firstName}</div>}
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={labelStyle}>Phone *</div>
                          <input value={gateData.phone} type="tel"
                            onChange={e => setGateData(d => ({ ...d, phone: formatPhone(e.target.value) }))}
                            placeholder="(817) 555-0100" style={iStyle} />
                          {contactErrors.phone && <div style={errStyle}>{contactErrors.phone}</div>}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={labelStyle}>Email *</div>
                          <input value={gateData.email} type="email"
                            onChange={e => setGateData(d => ({ ...d, email: e.target.value }))}
                            placeholder="jane@email.com" style={iStyle} />
                          {contactErrors.email && <div style={errStyle}>{contactErrors.email}</div>}
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 0 }}>A copy of your rendering will be emailed to you.</div>
                        </div>
                        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
                          <input type="checkbox" checked={gateData.smsConsent}
                            onChange={e => setGateData(d => ({ ...d, smsConsent: e.target.checked }))}
                            style={{ marginTop: 2, accentColor: C.accent, width: 15, height: 15, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                            By checking this box, I agree to be contacted by Metroplex Metal Roofs regarding my roofing inquiry via phone, email, or text message. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for help.
                          </span>
                        </label>
                        <div style={{fontSize:12, color:C.muted, marginTop:4, marginBottom:4}}>
                          By opting in you agree to our{' '}
                          <a href="/privacy" style={{color:C.accent, textDecoration:'underline'}}>Privacy Policy</a>
                          {' '}and{' '}
                          <a href="/terms" style={{color:C.accent, textDecoration:'underline'}}>Terms of Service</a>.
                        </div>
                        {contactErrors.smsConsent && <div style={{ fontSize: 11, color: '#F87171', marginTop: -6, marginBottom: 8 }}>{contactErrors.smsConsent}</div>}
                        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, padding: '10px 12px', background: C.surface, borderRadius: 4, border: `1px solid ${C.border}` }}>
                          By submitting this form, you agree to be contacted regarding your roofing inquiry. Check the box above to also receive text messages. Your information is never sold or shared with third parties.
                        </div>
                        <button
                          onClick={() => handleContactSubmit()}
                          disabled={gateLoading || !formReady}
                          style={{
                            width: '100%', padding: '15px',
                            background: gateLoading || !formReady ? C.border : C.accent,
                            color: gateLoading || !formReady ? C.muted : C.black,
                            fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
                            borderRadius: 6,
                            cursor: gateLoading || !formReady ? 'not-allowed' : 'pointer',
                            border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { if (!gateLoading && formReady) e.currentTarget.style.background = C.accentLight }}
                          onMouseLeave={e => { e.currentTarget.style.background = gateLoading || !formReady ? C.border : C.accent }}
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
              <div style={{ fontSize: 12, color: C.muted, marginTop: 12, fontStyle: 'italic' }}>
                Your render takes about 60 seconds — worth the wait.
              </div>
            </div>
          )}

          {/* ── results ── */}
          {step === 'results' && (
            <div style={{ animation: 'vfade 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
                  Your Roof Visualization
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 8 }}>
                  {selColor} {getRoofTypeLabel(selType ?? '')}
                </h2>
                <p style={{ fontSize: 13, color: C.muted }}>{address}</p>
              </div>
              {renderUrl ? (
                <img src={renderUrl} alt="AI roof visualization" style={{ width: '100%', borderRadius: 8, display: 'block', marginBottom: 16, border: `1px solid ${C.border}` }} />
              ) : (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '48px 32px', textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, color: C.muted }}>
                    We hit an issue generating your visualization. Please try again in a few minutes, or contact us at {PHONE} or {EMAIL}{' '}and we&apos;ll take care of it.
                  </div>
                </div>
              )}
              <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                AI-generated visualization for reference only. Actual appearance may vary based on home architecture, lighting, and installation details.
              </p>
              {estimateLow && estimateHigh && (
                <p style={{ color: C.accent, fontFamily: "'Cormorant Garamond',serif", fontSize: 22, textAlign: 'center', marginBottom: 16 }}>
                  Estimated Investment: {estimateLow} – {estimateHigh}
                </p>
              )}
              {estimateLow && estimateHigh && (
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 16 }}>
                  This range is a general estimate based on roof size. Final investment may vary based on inspection of current roof condition, precise measurements, slope, and materials tailored to your individualized roofing system.
                </p>
              )}
              {noPriceEstimate && (
                <p style={{ color: C.accent, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>
                  {estimateMessage}
                </p>
              )}
              {!estimateLow && !estimateHigh && !noPriceEstimate && solarFailureReason && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(20px,4vw,28px)', marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.7, marginBottom: 20 }}>
                    We weren&apos;t able to automatically pull roof measurements for your address. Enter your home&apos;s approximate square footage below and we&apos;ll calculate your estimate.
                  </p>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>
                      Approximate square footage of your home
                    </div>
                    <input
                      type="number"
                      value={manualSqFt}
                      onChange={e => setManualSqFt(e.target.value)}
                      placeholder="e.g. 2400"
                      style={iStyle}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
                      How many stories?
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {([['one', 'One story'], ['two', 'Two stories'], ['unknown', 'Not sure']] as const).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => setManualStories(val)}
                          style={{
                            padding: '10px 16px',
                            background: manualStories === val ? `${C.accentDark}33` : C.surface,
                            border: `1px solid ${manualStories === val ? C.accentDark : C.border}`,
                            borderRadius: 4, fontSize: 13,
                            color: manualStories === val ? C.accent : C.mutedLight,
                            cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Outfit',sans-serif",
                          }}
                        >{label}</button>
                      ))}
                    </div>
                  </div>
                  {manualError && <div style={{ fontSize: 11, color: '#F87171', marginBottom: 12 }}>{manualError}</div>}
                  <button
                    onClick={handleManualSubmit}
                    disabled={manualSubmitting}
                    style={{
                      width: '100%', padding: '14px',
                      background: manualSubmitting ? C.border : C.accent,
                      color: manualSubmitting ? C.muted : C.black,
                      fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
                      borderRadius: 4, cursor: manualSubmitting ? 'not-allowed' : 'pointer',
                      border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!manualSubmitting) e.currentTarget.style.background = C.accentLight }}
                    onMouseLeave={e => { e.currentTarget.style.background = manualSubmitting ? C.border : C.accent }}
                  >{manualSubmitting ? 'Calculating…' : 'Calculate My Estimate →'}</button>
                </div>
              )}
              <a
                href="https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', padding: '16px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderRadius: 4, textDecoration: 'none', textAlign: 'center', transition: 'background 0.2s', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Schedule Your Free Consultation</a>
            </div>
          )}

        </div>
        {(step === 'address' || step === 'welcome-back') && <SiteFooter/>}
      </div>
    </>
  )
}
