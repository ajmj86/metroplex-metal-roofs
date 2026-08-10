import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'

const BASE_URL = 'https://www.metroplexmetalroofs.com'
const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR'

export const metadata: Metadata = {
  title: 'Synthetic Slate Roofing Dallas–Fort Worth | Metroplex Metal Roofs',
  description: "Synthetic slate roofing for DFW homeowners who want slate's timeless profile without the weight, fragility, or upkeep. Class 4 hail-rated. Free consultation.",
  alternates: {
    // No trailing slash -- trailingSlash isn't enabled in next.config.ts,
    // so this matches the actual served URL exactly (same fix applied to
    // the city pages' canonicals in CityPageSchema.tsx).
    canonical: '/synthetic-slate-roofing',
  },
}

const FAQS = [
  {
    q: 'How much does synthetic slate roofing cost compared to real slate?',
    a: "Synthetic slate typically runs a fraction of real slate's installed cost. Real slate requires specialized installers, structural reinforcement for the extra weight, and slate itself is one of the most expensive roofing materials available. Synthetic slate delivers a comparable look at a cost much closer to premium metal or high-end stone-coated steel — we'll give you an exact number for your home during your free consultation.",
  },
  {
    q: 'How long does synthetic slate roofing last?',
    a: "Most synthetic slate systems carry manufacturer warranties in the 40–50 year range, with the material engineered to resist cracking, fading, and impact damage over that span. That falls short of standing seam metal's 50–70 year lifespan, but it's well beyond asphalt shingles and far more durable than real slate, which is prone to cracking underfoot and in hail regardless of its long theoretical lifespan.",
  },
  {
    q: 'Is synthetic slate roofing heavier than asphalt or metal?',
    a: "Synthetic slate is engineered to be lightweight — typically comparable to or only slightly heavier than asphalt shingles, and it doesn't require the structural reinforcement real slate often demands. That makes it a viable option on homes where authentic slate was never structurally practical.",
  },
  {
    q: 'Synthetic slate vs. metal roofing — which is better for my home?',
    a: "It depends on what you're optimizing for. Standing seam metal offers the longest lifespan, the strongest insurance discounts, and a cleaner architectural line. Synthetic slate offers a traditional, dimensional profile that some HOAs and historic-style homes call for specifically, in a system still built for North Texas hail. We install both, and we'll tell you honestly which one fits your home and your HOA's guidelines — not just push whichever is easier to sell.",
  },
  {
    q: 'Does synthetic slate qualify for insurance discounts like metal does?',
    a: 'Many carriers offer premium discounts for Class 4 impact-rated roofing, and synthetic slate systems are commonly rated Class 4 — but discount programs vary by carrier and aren\'t always as deep as the discounts available for standing seam metal. We\'ll walk through what your specific carrier offers for each material during your consultation.',
  },
]

function SlateSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/synthetic-slate-roofing/#service`,
        'name': 'Synthetic Slate Roofing',
        'provider': {
          '@type': 'RoofingContractor',
          'name': 'Metroplex Metal Roofs',
          'legalName': 'Allied Roofing Partners LLC',
          'telephone': '+18173823338',
        },
        'areaServed': {
          '@type': 'State',
          'name': 'Texas',
        },
        'description': metadata.description,
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/synthetic-slate-roofing/#faq`,
        'mainEntity': FAQS.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Synthetic Slate Roofing', 'item': `${BASE_URL}/synthetic-slate-roofing/` },
        ],
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

const SHead = ({ eyebrow, title, sub, center = false }: { eyebrow?: string; title: React.ReactNode; sub?: string; center?: boolean }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 52 }}>
    {eyebrow && <div style={{ fontSize: 15, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>{eyebrow}</div>}
    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3.75rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: sub ? 18 : 0 }}>
      {title}
    </h2>
    {sub && <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, maxWidth: center ? 580 : '100%', margin: center ? '0 auto' : 0 }}>{sub}</p>}
  </div>
)

export default function SyntheticSlateRoofingPage() {
  return (
    <>
      <style>{fonts + globalStyles}</style>
      {/*
       * This page has to stay a Server Component (metadata export requires
       * it), so hover states use plain CSS classes instead of the
       * onMouseEnter/onMouseLeave handlers CityPage.tsx/Homepage.jsx use --
       * those are Client Components. Scoped, low-specificity class names to
       * avoid colliding with anything in globalStyles.
       */}
      <style>{`
        .slate-breadcrumb-home { color: ${C.muted}; transition: color 0.2s; }
        .slate-breadcrumb-home:hover { color: ${C.accent}; }
        .slate-cta-primary { background: ${C.accent}; transition: background 0.2s; }
        .slate-cta-primary:hover { background: ${C.accentLight}; }
        .slate-cta-secondary { border: 1px solid ${C.border}; transition: border-color 0.2s; }
        .slate-cta-secondary:hover { border-color: ${C.accentDark}; }
      `}</style>
      <SlateSchema />
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <SiteNav />

        {/* ── BREADCRUMB ── */}
        <div style={{ position: 'fixed', top: 84, left: 0, right: 0, zIndex: 190, background: `${C.black}EE`, borderBottom: `1px solid ${C.border}`, padding: '8px 40px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          <Link href="/" className="slate-breadcrumb-home">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: C.accent }}>Synthetic Slate Roofing</span>
        </div>

        {/* ── HERO ── */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(150px,14vw,190px) clamp(24px,5vw,64px) clamp(80px,8vw,120px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0D0A 0%,#1A160E 45%,#0D0C0B 100%)', zIndex: 0 }} />
          <div className="inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 'clamp(0.75rem,1.1vw,0.95rem)', letterSpacing: 3.5, color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>Premium Roofing · Dallas–Fort Worth</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.75rem,5.5vw,5.5rem)', fontWeight: 700, lineHeight: 1.08, color: C.white, marginBottom: 24, maxWidth: 780 }}>
              Slate's Look.<br/><span style={{ color: C.accent, fontStyle: 'italic' }}>None of Slate's Problems.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1.05rem,1.3vw,1.1875rem)', lineHeight: 1.8, color: C.mutedLight, maxWidth: 560, marginBottom: 40, fontWeight: 500 }}>
              Synthetic slate roofing for DFW homeowners who want a traditional, dimensional roofline — without real slate's weight, fragility, or cost.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn slate-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              {['Class 4 Hail Rating', 'Lightweight — No Structural Reinforcement Needed', '10-Year Workmanship Warranty'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.muted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY SYNTHETIC SLATE ── */}
        <section className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead
              eyebrow="Why Synthetic Slate"
              title="The Problem With Real Slate — And What Solves It"
              sub="Real slate has always been one of the most beautiful roofing materials — and one of the most impractical. Synthetic slate exists to solve that."
              center
            />
            <div className="grid-2" style={{ gap: 3 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(28px,4vw,48px)', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#52525B', flexShrink: 0 }} />
                  <div style={{ fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: C.muted }}>Real Slate</div>
                </div>
                {[
                  { label: 'Weight', val: 'Often 800–1,500+ lbs per square — frequently requires structural reinforcement most homes were never built for.' },
                  { label: 'Fragility', val: "Brittle underfoot and prone to cracking in hail — the exact condition North Texas roofs face every spring." },
                  { label: 'Cost', val: 'One of the most expensive roofing materials available, installed by a small pool of specialized crews.' },
                  { label: 'Maintenance', val: 'Individual tiles crack and need periodic replacement over the roof\'s life — rarely a one-and-done install.' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '18px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(28px,4vw,48px)', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
                  <div style={{ fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: C.accent }}>Synthetic Slate</div>
                </div>
                {[
                  { label: 'Weight', val: 'Engineered to be lightweight — comparable to asphalt shingles, with no structural reinforcement required.' },
                  { label: 'Durability', val: 'Class 4 impact-rated composite construction, built to withstand North Texas hail without cracking.' },
                  { label: 'Cost', val: 'A fraction of real slate\'s installed cost, closer to premium metal or high-end stone-coated steel.' },
                  { label: 'Maintenance', val: 'A single system installed once, warrantied 40–50 years — not a roof you\'re periodically patching.' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '18px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SYNTHETIC SLATE VS. METAL ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead
              eyebrow="An Honest Comparison"
              title="Synthetic Slate vs. Metal Roofing"
              sub="We install both. Here's how we actually think about which one fits a given home — not a sales pitch for either."
              center
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Metal If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  You want the longest possible lifespan (standing seam runs 50–70 years), the strongest available insurance discounts, and a clean, modern architectural line. Metal is the higher-durability, higher-savings choice over a 20–30 year horizon.
                </p>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Synthetic Slate If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  Your home's architecture or your HOA's design guidelines call for a traditional, dimensional slate profile specifically — and you want that look without real slate's weight, fragility, or maintenance. Synthetic slate is still a genuine upgrade over asphalt, just a different tradeoff than metal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead eyebrow="FAQ" title="Synthetic Slate Roofing Questions" center />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {FAQS.map(f => (
                <div key={f.q} style={{ padding: '24px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 10 }}>{f.q}</div>
                  <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <div className="inner" style={{ maxWidth: 640 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3rem)', fontWeight: 700, color: C.white, lineHeight: 1.15, marginBottom: 20 }}>
              Not Sure If Synthetic Slate<br/><span style={{ fontStyle: 'italic', color: C.accent }}>Or Metal Is Right For You?</span>
            </h2>
            <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, marginBottom: 40 }}>
              A quick call with our team is the fastest way to find out. We'll talk through your home, your HOA's guidelines if you have one, and give you an honest read on which material actually fits — no pressure, no obligation.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn slate-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
              <Link href="/#products" className="cta-btn slate-cta-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'transparent', color: C.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Explore Our Metal Roofing Systems</Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}
