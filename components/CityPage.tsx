'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'
import Counter from '@/components/Counter'
import ProductGallery from '@/components/ProductGallery'
import ProductsSection from '@/components/ProductsSection'
import { ASSESSMENT_CATEGORIES } from '@/lib/assessment'
import { GALLERY_ITEMS } from '@/lib/gallery'

/*
  ══════════════════════════════════════
  METROPLEX METAL ROOFS — CITY PAGE

  HOW TO USE:
  - Pass CITY_DATA as a prop from a server component
  - The server component handles metadata + FAQ schema
  - This client component handles all interactivity
  - For WordPress: pull CITY_DATA from WP REST API
  ══════════════════════════════════════
*/

export interface CityFAQ {
  q: string
  a: string
}

export interface CityData {
  name: string
  state: string
  county: string
  region: string
  zip: string
  slug: string
  metaTitle: string
  metaDesc: string
  heroHeadline: string
  heroSub: string
  localContext: string
  hoaNote: string
  localStat: { val: string; label: string; source: string }
  neighborhoods: string[]
  nearbyCities: { name: string; slug: string }[]
  review: { name: string; neighborhood: string; text: string; rating: number }
  faqs: CityFAQ[]
}

const DBA_NAME   = 'Metroplex Metal Roofs'
const PHONE      = '(817) 382-3338'
const PHONE_HREF = 'tel:+18173823338'
const SMS_HREF   = 'sms:+18173823338?body=ROOF'
const LEGAL_FULL = 'Metroplex Metal Roofs, a DBA of Allied Roofing Partners LLC'
const YEAR       = '2026'

/* ── Reveal on scroll ── */
const Reveal = ({ children, delay=0, style={} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.07 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: vis?1:0, transform: vis?'translateY(0)':'translateY(20px)', transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

/* ── Section heading helper ── */
/*
 * Sizing matched to Homepage.jsx's most common section-heading pattern
 * (Products/Gallery/Process/Metroplex Standard all use this exact clamp) --
 * was previously clamp(28px,4vw,50px)/10px eyebrow, visibly smaller than
 * every equivalent homepage heading.
 */
const SHead = ({ eyebrow, title, sub, center=false }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) => (
  <div style={{ textAlign: center?'center':'left', marginBottom: 52 }}>
    {eyebrow && <div style={{ fontSize: 15, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>{eyebrow}</div>}
    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3.75rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: sub?18:0 }}
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {sub && <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, maxWidth: center?580:'100%', margin: center?'0 auto':0 }}>{sub}</p>}
  </div>
)

/* ── Main component ── */
export default function CityPage({ city }: { city: CityData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const whyMetal = [
    { val: 50,  suffix: '+ yrs', label: 'Roof Lifespan' },
    { val: 35,  suffix: '%',     label: 'Insurance Savings' },
    { val: 25,  suffix: '%',     label: 'Energy Cost Reduction' },
    { val: 137, suffix: '%',     label: 'ROI vs. Asphalt', note: 'Based on 20-yr cost comparison: avoided replacement, insurance, and energy savings vs. upfront investment' },
    { display: '4–6%',          label: 'Resale Value Boost', note: "Based on Remodeling magazine's Cost vs. Value report. Figures are industry averages and vary by home, market, and roof system; actual resale value is not guaranteed. Consult a local real estate professional for market-specific figures." },
  ]

  const steps = [
    {
      n: '01',
      title: 'Visualize Your Roof',
      time: '~60 seconds',
      href: '/visualizer',
      body: 'Enter your address. Our AI visualizer pulls a satellite image of your home and renders it with your chosen metal roof style and color — before you commit to anything.',
    },
    {
      n: '02',
      title: 'Brief Consultation',
      time: '15 minutes, this week',
      href: 'https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR',
      body: "A quick call with our team. We confirm your home's scope, timeline, and whether metal is the right fit. No pressure, no obligation.",
    },
    {
      n: '03',
      title: '40-Point Roof & Structure Assessment',
      time: 'On-site, within days',
      href: '#assessment',
      body: "Our team visits your home to complete the free 40-Point Roof & Structure Assessment — decking, flashing, ventilation, attic, and every penetration. It's the same on-site diagnostic professional inspectors charge for.",
    },
    {
      n: '04',
      title: 'Precision Proposal',
      time: 'Presented in person',
      href: undefined,
      body: 'Using your assessment findings and satellite measurements, we build your firm proposal — one clear number, presented in person, with no post-signing surprises.',
    },
    {
      n: '05',
      title: 'Expert Installation',
      time: 'Warrantied from day one',
      href: undefined,
      body: 'Your roof is installed to manufacturer spec by a credentialed metal roofing specialist — licensed in Texas and fully insured — and covered by our 10-year workmanship warranty from day one.',
    },
  ]

  return (
    <>
      <style>{fonts + globalStyles}</style>
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <SiteNav/>

        {/* ── BREADCRUMB ── */}
        <div style={{ position: 'fixed', top: 84, left: 0, right: 0, zIndex: 190, background: `${C.black}EE`, borderBottom: `1px solid ${C.border}`, padding: '8px 40px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          <Link href="/" style={{ color: C.muted, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href="/#service-areas" style={{ color: C.muted, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >Service Areas</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: C.accent }}>Metal Roofing {city.name}, TX</span>
        </div>

        {/* ── HERO ── */}
        <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(150px,14vw,190px) clamp(24px,5vw,64px) clamp(80px,8vw,120px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0D0A 0%,#1A160E 45%,#0D0C0B 100%)', zIndex: 0 }}/>
          <div style={{ position: 'absolute', top: '20%', right: '15%', width: 800, height: 800, background: `radial-gradient(circle,${C.accentDark}14 0%,transparent 65%)`, pointerEvents: 'none', zIndex: 1 }}/>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: '72px 72px', opacity: 0.07 }}/>

          <div className="inner" style={{ position: 'relative', zIndex: 2, maxWidth: 1160, margin: '0 auto', width: '100%' }}>
            {/* City badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '8px 18px', border: `1px solid ${C.accentDark}`, borderRadius: 2, animation: 'fadeUp 0.6s ease both' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }}/>
              <span style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>
                {city.name}, {city.state} · {city.county} County
              </span>
            </div>

            <div className="g2" style={{ gap: 48, alignItems: 'center' }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(56px,5.5vw,112px)', fontWeight: 700, lineHeight: 1.05, color: C.white, marginBottom: 24, animation: 'fadeUp 0.7s ease 0.1s both', whiteSpace: 'pre-line' }}>
                  {city.heroHeadline.split('\n').map((line, i) => (
                    <span key={i}>{i === 1 ? <span style={{ color: C.accent, fontStyle: 'italic' }}>{line}</span> : line}{'\n'}</span>
                  ))}
                </h1>
                <p style={{ fontSize: 'clamp(1.125rem,1.3vw,1.1875rem)', color: C.mutedLight, lineHeight: 1.8, maxWidth: 480, marginBottom: 40, fontWeight: 300, animation: 'fadeUp 0.7s ease 0.2s both' }}>
                  {city.heroSub}
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.3s both' }}>
                  <a href="/visualizer"
                    style={{ padding: '15px 32px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                  >See Your Home With Metal →</a>
                </div>
                {/* Trust row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}`, animation: 'fadeUp 0.7s ease 0.4s both' }}>
                  {['10-Year Workmanship Warranty', 'Satellite Estimates', 'Class 4 Hail Rating', 'DFW Local'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, color: C.muted }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero stat card */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: C.card, border: `1px solid ${C.accentDark}`, borderRadius: 8, padding: '40px 48px', textAlign: 'center', minWidth: 220, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})` }}/>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 8 }}>
                    $<Counter to={parseFloat(city.localStat.val.replace(/[^0-9.]/g, ''))} suffix={city.localStat.val.replace(/[0-9.]/g, '').replace('$', '')} />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>{city.localStat.label}</div>
                  <div style={{ fontSize: 9, color: C.muted, opacity: 0.6 }}>{city.localStat.source}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOCAL CONTEXT ── */}
        <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div className="inner" style={{ padding: '56px 64px' }}>
            <Reveal>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 12 }}>
                Metal Roofing in {city.name}, TX
              </div>
              <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.85, maxWidth: 820, margin: 0 }}>
                {city.localContext}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── WHY METAL ── */}
        <section id="why-metal" className="sp">
          <div className="inner">
            <Reveal>
              <SHead
                eyebrow="Why Metal"
                title={`The Case for Metal Roofing<br/>in <em style="color:${C.accent}">${city.name}</em>`}
                sub={`In a North Texas hail zone with home values like ${city.name}'s, asphalt shingles are an expensive recurring cost — not a long-term solution.`}
                center
              />
            </Reveal>
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface, marginBottom: 48 }}>
              <div className="inner grid-5">
                {whyMetal.map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.07}>
                    <div style={{ padding: '44px 32px', borderRight: i < whyMetal.length - 1 ? `1px solid ${C.border}` : 'none', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,4vw,52px)', fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 8 }}>
                        {s.val !== undefined ? <Counter to={s.val} suffix={s.suffix}/> : s.display}
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted }}>{s.label}</div>
                      {s.note && (
                        <div style={{ fontSize: 10, color: C.muted, opacity: 0.55, lineHeight: 1.5, marginTop: 8, maxWidth: 170, marginLeft: 'auto', marginRight: 'auto' }}>
                          *{s.note}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: C.muted, maxWidth: 640, margin: '8px auto', lineHeight: 1.6, fontFamily: "'Outfit',sans-serif" }}>
                  Figures represent industry estimates and vary by home, carrier, and installation. Individual results will vary, and actual savings are not guaranteed. Consult your insurance and utility providers for personalized savings.
                </p>
              </div>
            </div>

            {/* Economics comparison */}
            <Reveal>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(28px,4vw,48px)', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: '#F87171', textTransform: 'uppercase', marginBottom: 10 }}>The Asphalt Reality in {city.name}</div>
                  <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                    With a 2% wind/hail deductible and {city.name}'s home values, a single claim means a five-figure out-of-pocket expense — often approaching or exceeding the full cost of a cash roof replacement. And that resets every 8–10 years.
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.accent, textTransform: 'uppercase', marginBottom: 10 }}>The Metal Calculus</div>
                  <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                    A metal roof eliminates the replacement cycle entirely. Add carrier discounts, reduced energy costs, and eliminated deductible exposure over 20–30 years — and the upgrade typically pays for itself well within the life of the home. It also typically adds 4–6% to resale value while recouping 60–85% of installation cost at closing, per Remodeling magazine's Cost vs. Value report.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <ProductsSection
          id="our-products"
          eyebrow="Our Products"
          heading={<>Metal Roofing Systems<br/>for {city.name} Homes</>}
          initialTab="stone"
        />

        {/* ── GALLERY ── */}
        <section id="gallery" className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <Reveal>
              <SHead eyebrow="Our Work" title="DFW Installations" center/>
            </Reveal>
            <div className="grid-3" style={{ gap: 14 }}>
              {GALLERY_ITEMS.map((item, i) => (
                <Reveal key={item.label} delay={i * 0.06}>
                  <div
                    onClick={() => setLightboxIndex(i)}
                    style={{ cursor: 'pointer', height: 240, overflow: 'hidden', borderRadius: 4, position: 'relative' }}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: item.objectPosition || 'center center', display: 'block', transition: 'transform 0.3s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ProductGallery
          items={GALLERY_ITEMS}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />

        {/* ── NEIGHBORHOODS ── */}
        <section className="sp-sm" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <Reveal>
              <SHead eyebrow={`${city.name} Neighborhoods`} title={`Areas We Serve in ${city.name}`}/>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: city.hoaNote ? 36 : 0 }}>
                {city.neighborhoods.map(n => (
                  <div key={n} style={{ padding: '9px 18px', border: `1px solid ${C.border}`, borderRadius: 2, fontSize: 12, color: C.mutedLight, letterSpacing: 0.5, transition: 'all 0.2s', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight }}
                  >{n}</div>
                ))}
              </div>
            </Reveal>
            {city.hoaNote && (
              <Reveal delay={0.15}>
                <div style={{ background: C.card, border: `1px solid ${C.accentDark}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)', display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})` }}/>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${C.accentDark}33`, border: `1px solid ${C.accentDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 10 L12 4 L21 10"/>
                      <path d="M5 10 V20 H19 V10"/>
                      <path d="M9 20 V14 H15 V20"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(22px,2.6vw,28px)', fontWeight: 700, color: C.white, lineHeight: 1.2 }}>The HOA Approval Kit</div>
                      <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, border: `1px solid ${C.accentDark}`, borderRadius: 20, padding: '4px 11px', whiteSpace: 'nowrap' }}>Free With Every Project</span>
                    </div>
                    <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{city.hoaNote}</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <Reveal>
              <SHead eyebrow="Our Process" title="From Visualization to Installation" center/>
            </Reveal>
            <div className="g5" style={{ gap: 2 }}>
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.09}>
                  {(() => {
                    const isExternal = s.href?.startsWith('http')
                    const Tag = s.href ? 'a' : 'div'
                    const linkProps = s.href ? {
                      href: s.href,
                      ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
                      style: { textDecoration: 'none', display: 'block', height: '100%' },
                    } : { style: { height: '100%' } }
                    return (
                      <Tag {...(linkProps as any)}>
                        <div style={{ padding: '36px 28px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, height: '100%', transition: 'border-color 0.3s', cursor: s.href ? 'pointer' : 'default' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = C.accentDark)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                        >
                          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: C.border, lineHeight: 1, marginBottom: 18, userSelect: 'none' }}>{s.n}</div>
                          <div style={{ width: 24, height: 2, background: C.accent, marginBottom: 14 }}/>
                          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.white, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                          {s.time && <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>{s.time}</div>}
                          <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{s.body}</p>
                        </div>
                      </Tag>
                    )
                  })()}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 40-POINT ASSESSMENT ── */}
        <section id="assessment" className="sp" style={{ background: C.black, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <Reveal>
              <SHead
                eyebrow="Included With Every Estimate — Free"
                title={`The 40-Point Roof<br/><em style="font-style:italic;color:${C.accent}">&amp; Structure Assessment</em>`}
                sub={`Before we build your ${city.name} proposal, we inspect structure, weatherproofing, ventilation, and every penetration — 40 points in all. It's the same diagnostic professional inspectors charge for, done free with every estimate, so your price is locked before installation day, not renegotiated after.`}
                center
              />
            </Reveal>
            <div className="g3">
              {ASSESSMENT_CATEGORIES.map((cat, i) => (
                <Reveal key={cat.label} delay={i * 0.07}>
                  <div style={{ padding: 22, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, gap: 10 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, color: C.white, fontWeight: 700 }}>{cat.label}</div>
                      <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, whiteSpace: 'nowrap' }}>{cat.count} pts</div>
                    </div>
                    <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.7, margin: 0 }}>{cat.example}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <a href="https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                >Book Your Free Consultation →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── THE METROPLEX STANDARD (compact) — replaces per-city placeholder
             review (was city.review, e.g. Southlake's "Robert M.") pending
             real reviews post-WF4. Same FTC/DTPA exposure as the homepage
             testimonials; id="standard" so SiteNav can target it in-page. ── */}
        <section id="standard" className="sp-sm" style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})` }}/>
          <div className="inner" style={{ maxWidth: 780, textAlign: 'center' }}>
            <Reveal>
              <div style={{ fontSize: 15, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>The Metroplex Standard</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3.75rem)', fontWeight: 700, color: C.white, lineHeight: 1.15, marginBottom: 32 }}>
                One Project Lead. <span style={{ fontStyle: 'italic', color: C.accent }}>One Warranty. Zero Chasing.</span>
              </h2>
            </Reveal>
            <div className="g3" style={{ textAlign: 'left' }}>
              {[
                { label: '10-Year Workmanship Warranty', body: 'Written into your contract. Not a handshake.', icon: 'shield' },
                { label: 'Manufacturer Material Warranty', body: 'Panel and finish coverage direct from the manufacturer, registered in your name.', icon: 'shield-check' },
                { label: 'Licensed & Insured in Texas', body: 'Class 4 impact-rated systems, engineered for DFW hail.', icon: 'badge' },
              ].map((p, i) => (
                <Reveal key={p.label} delay={i * 0.08}>
                  <div style={{ padding: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, height: '100%' }}>
                    <div style={{ marginBottom: 12 }}>
                      {p.icon === 'shield' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinejoin="round">
                          <path d="M12 2.5 L19.5 5.5 V11.2 C19.5 16.1 16.3 19.8 12 21.5 C7.7 19.8 4.5 16.1 4.5 11.2 V5.5 Z"/>
                        </svg>
                      )}
                      {p.icon === 'shield-check' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2.5 L19.5 5.5 V11.2 C19.5 16.1 16.3 19.8 12 21.5 C7.7 19.8 4.5 16.1 4.5 11.2 V5.5 Z"/>
                          <path d="M8.75 11.5 L10.8 13.5 L15.25 9"/>
                        </svg>
                      )}
                      {p.icon === 'badge' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8.5" r="5.5"/>
                          <path d="M9.5 8.5 L11.2 10.2 L14.5 6.5"/>
                          <path d="M8.3 13.3 L6.5 21.5 L12 18.3 L17.5 21.5 L15.7 13.3"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 12, letterSpacing: 0.5, color: C.accent, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{p.label}</div>
                    <div style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.65 }}>{p.body}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <Reveal>
              <SHead eyebrow="FAQ" title={`Metal Roofing Questions —<br/>${city.name}, TX`}/>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {city.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: '28px 0' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,2vw,22px)', fontWeight: 700, color: C.white, lineHeight: 1.3, marginBottom: 12 }}>
                      {faq.q}
                    </h3>
                    <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                </Reveal>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, padding: '28px 0 0', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  Still have a question? Text ROOF to{' '}
                  <a href={SMS_HREF} style={{ color: C.accent, textDecoration: 'underline' }}>{PHONE}</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT METROPLEX ── */}
        <section className="sp-sm" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <Reveal>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>About Metroplex Metal Roofs</div>
              <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.9, marginBottom: 20 }}>
                Metroplex Metal Roofs specializes exclusively in premium residential metal roofing across the Dallas–Fort Worth metroplex. Our focus is standing seam, stone-coated steel, copper, and R-panel — every project precision-measured by satellite, installed to manufacturer spec, and backed by our 10-year workmanship warranty.
              </p>
              <Link href="/about"
                style={{ fontSize: 12, color: C.accent, letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'underline', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Learn About Our Approach →</Link>
            </Reveal>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ textAlign: 'center' }}>
            <Reveal>
              <div style={{ fontSize: 15, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 20 }}>{city.name}, TX</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(30px,5vw,72px)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
                The Last Roof You'll Ever Put<br/><span style={{ color: C.accent, fontStyle: 'italic' }}>On Your {city.name} Home</span>
              </h2>
              <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px' }}>
                See your home with a metal roof before you commit to anything. Satellite-based estimate. No obligation.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/visualizer"
                  style={{ padding: '15px 36px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                >Get Your Roof Rendering & Estimate →</a>
                <a href={PHONE_HREF}
                  style={{ padding: '15px 28px', border: `1px solid ${C.border}`, color: C.mutedLight, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight }}
                >{PHONE}</a>
                <a href={SMS_HREF}
                  style={{ padding: '15px 28px', border: `1px solid ${C.border}`, color: C.mutedLight, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight }}
                >Text ROOF for quick questions</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── NEARBY CITIES (doubles as this page's "Service Areas" anchor target) ── */}
        <section id="service-areas" className="sp-sm" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <Reveal>
              <SHead eyebrow="Also Serving" title={`Metal Roofing Near ${city.name}`}/>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                {city.nearbyCities.map(c => (
                  <Link key={c.slug} href={`/metal-roofing-${c.slug}-tx`}
                    style={{ padding: '10px 20px', border: `1px solid ${C.border}`, borderRadius: 2, fontSize: 12, color: C.mutedLight, letterSpacing: 1, transition: 'all 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight }}
                  >Metal Roofing {c.name}, TX →</Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <SiteFooter/>
      </div>
    </>
  )
}
