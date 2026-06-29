'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'
import Counter from '@/components/Counter'

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
const SHead = ({ eyebrow, title, sub, center=false }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) => (
  <div style={{ textAlign: center?'center':'left', marginBottom: 52 }}>
    {eyebrow && <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>{eyebrow}</div>}
    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,4vw,50px)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: sub?18:0 }}
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {sub && <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: center?580:'100%', margin: center?'0 auto':0 }}>{sub}</p>}
  </div>
)

/* ── Main component ── */
export default function CityPage({ city }: { city: CityData }) {

  const products = [
    { id: 'standing', label: 'Standing Seam',       desc: 'The preferred choice for luxury DFW homes. Hidden fasteners, clean architectural lines, Class 4 hail rating, 50+ year lifespan.' },
    { id: 'copper',   label: 'Copper',               desc: 'The pinnacle of residential roofing. Develops a natural patina, lasts 100+ years, and makes a permanent statement on estate-level properties.' },
    { id: 'stone',    label: 'Stone-Coated Steel',   desc: 'Shingle aesthetics, steel strength. Widely approved by DFW HOAs and ideal for neighborhoods with traditional architectural guidelines.' },
    { id: 'rpanel',   label: 'R-Panel',               desc: 'Proven, durable, and cost-effective. A straightforward metal option with a 40–60 year lifespan and Class 4 impact rating.' },
  ]

  const whyMetal = [
    { n: '50+',     unit: 'Years',   label: 'Lifespan vs. 8–15 for asphalt' },
    { n: '35',      unit: '%',       label: 'Insurance premium discount' },
    { n: '15',      unit: '%',       label: 'Cooling cost reduction' },
    { n: 'Class 4', unit: '',        label: 'Highest hail impact rating' },
  ]

  const steps = [
    { n: '01', title: 'See Your Home',        body: 'Enter your address in our AI visualizer and see your exact home rendered with your chosen metal roof style and color — before committing to anything.' },
    { n: '02', title: 'Free Estimate',        body: 'We generate precise measurements using satellite imaging — no ladder, no clipboard, no obligation. Estimates typically ready within one business day.' },
    { n: '03', title: 'Project Placement',    body: 'Your project is assigned to a credentialed local installer — licensed in Texas, fully insured, metal-specific experience verified.' },
    { n: '04', title: 'Expert Installation',  body: 'Your new roof is installed to manufacturer specifications, with full documentation for your insurance carrier.' },
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
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px,5.5vw,80px)', fontWeight: 700, lineHeight: 1.05, color: C.white, marginBottom: 24, animation: 'fadeUp 0.7s ease 0.1s both', whiteSpace: 'pre-line' }}>
                  {city.heroHeadline.split('\n').map((line, i) => (
                    <span key={i}>{i === 1 ? <span style={{ color: C.accent, fontStyle: 'italic' }}>{line}</span> : line}{'\n'}</span>
                  ))}
                </h1>
                <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, maxWidth: 480, marginBottom: 40, fontWeight: 300, animation: 'fadeUp 0.7s ease 0.2s both' }}>
                  {city.heroSub}
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.3s both' }}>
                  <a href="/visualizer"
                    style={{ padding: '15px 32px', background: C.accent, color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                  >See Your Home With Metal →</a>
                  <a href="/estimate"
                    style={{ padding: '15px 24px', border: `1px solid ${C.borderLight}`, color: C.mutedLight, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.mutedLight }}
                  >Get a Free Estimate</a>
                </div>
                {/* Trust row */}
                <div style={{ display: 'flex', gap: 24, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}`, flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.4s both' }}>
                  {['Licensed TX Installers', 'Satellite Estimates', 'Class 4 Hail Rating', 'DFW Local'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }}/>
                      <span style={{ fontSize: 11, color: C.muted }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero stat card */}
              <Reveal style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: C.card, border: `1px solid ${C.accentDark}`, borderRadius: 8, padding: '40px 48px', textAlign: 'center', minWidth: 220, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})` }}/>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 8 }}>
                    $<Counter to={parseFloat(city.localStat.val.replace(/[^0-9.]/g, ''))} suffix={city.localStat.val.replace(/[0-9.]/g, '').replace('$', '')} />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>{city.localStat.label}</div>
                  <div style={{ fontSize: 9, color: C.muted, opacity: 0.6 }}>{city.localStat.source}</div>
                </div>
              </Reveal>
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
            <div className="g4" style={{ gap: 2, marginBottom: 56 }}>
              {whyMetal.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div style={{ padding: '40px 28px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, textAlign: 'center', height: '100%' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,52px)', fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 4 }}>
                      {s.n}<span style={{ fontSize: '0.5em', color: C.accentDark }}>{s.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginTop: 8 }}>{s.label}</div>
                  </div>
                </Reveal>
              ))}
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
                    A metal roof eliminates the replacement cycle entirely. Add carrier discounts, reduced energy costs, and eliminated deductible exposure over 20–30 years — and the upgrade typically pays for itself well within the life of the home.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section id="our-products" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <Reveal>
              <SHead eyebrow="Our Products" title={`Metal Roofing Systems<br/>for ${city.name} Homes`} center/>
            </Reveal>
            <div className="g2" style={{ gap: 3 }}>
              {products.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.07}>
                  <div style={{ background: C.black, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', height: '100%', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = C.accentDark)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                  >
                    <div style={{ padding: '28px 28px 24px' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 10 }}>{p.label}</div>
                      <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>🏛️</div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: C.accent, textTransform: 'uppercase', marginBottom: 6 }}>HOA Note</div>
                    <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{city.hoaNote}</p>
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
            <div className="g4" style={{ gap: 2 }}>
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.09}>
                  <div style={{ padding: '36px 28px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, height: '100%', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = C.accentDark)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                  >
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: C.border, lineHeight: 1, marginBottom: 18, userSelect: 'none' }}>{s.n}</div>
                    <div style={{ width: 24, height: 2, background: C.accent, marginBottom: 14 }}/>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, color: C.white, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEW ── */}
        <section className="sp-sm" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 720 }}>
            <Reveal>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(28px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})` }}/>
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                  {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: C.accent, fontSize: 18 }}>{s}</span>)}
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(18px,2.5vw,24px)', color: C.white, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 28 }}>
                  "{city.review.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{city.review.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3, letterSpacing: 1 }}>{city.review.neighborhood} · {city.name}, TX</div>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1.5, textTransform: 'uppercase' }}>Verified Google Review</div>
                </div>
              </div>
            </Reveal>
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
              <div style={{ borderTop: `1px solid ${C.border}` }}/>
            </div>
          </div>
        </section>

        {/* ── ABOUT METROPLEX ── */}
        <section className="sp-sm" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <Reveal>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>About Metroplex Metal Roofs</div>
              <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.9, marginBottom: 20 }}>
                Metroplex Metal Roofs specializes exclusively in premium residential metal roofing across the Dallas–Fort Worth metroplex. Our focus is standing seam, stone-coated steel, copper, and R-panel — each project precision-measured using satellite imaging and placed with credentialed installers who specialize in metal specifically.
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
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 20 }}>{city.name}, TX</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
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
                >See Your Home With Metal →</a>
                <a href={PHONE_HREF}
                  style={{ padding: '15px 28px', border: `1px solid ${C.border}`, color: C.mutedLight, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mutedLight }}
                >{PHONE}</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── NEARBY CITIES ── */}
        <section className="sp-sm" style={{ borderTop: `1px solid ${C.border}` }}>
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
