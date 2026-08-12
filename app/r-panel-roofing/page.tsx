import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'
import PricingTable from '@/components/PricingTable'

const BASE_URL = 'https://www.metroplexmetalroofs.com'
const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR'

export const metadata: Metadata = {
  title: 'R-Panel Metal Roofing Dallas–Fort Worth | Metroplex Metal Roofs',
  description: 'R-panel exposed-fastener metal roofing for DFW homeowners — the most affordable entry into metal roofing, without sacrificing long-term durability. Free consultation.',
  alternates: {
    canonical: '/r-panel-roofing',
  },
}

const CITIES: [string, string][] = [
  ['Allen', 'allen'], ['Anna', 'anna'], ['Argyle', 'argyle'], ['Burleson', 'burleson'],
  ['Celina', 'celina'], ['Colleyville', 'colleyville'], ['Coppell', 'coppell'], ['Fate', 'fate'],
  ['Flower Mound', 'flower-mound'], ['Forney', 'forney'], ['Frisco', 'frisco'], ['Grapevine', 'grapevine'],
  ['Highland Village', 'highland-village'], ['Keller', 'keller'], ['Lewisville', 'lewisville'],
  ['Mansfield', 'mansfield'], ['McKinney', 'mckinney'], ['Midlothian', 'midlothian'], ['Northlake', 'northlake'],
  ['Plano', 'plano'], ['Prosper', 'prosper'], ['Richardson', 'richardson'], ['Roanoke', 'roanoke'],
  ['Rockwall', 'rockwall'], ['Royse City', 'royse-city'], ['Southlake', 'southlake'], ['Trophy Club', 'trophy-club'],
  ['Waxahachie', 'waxahachie'], ['Westlake', 'westlake'],
]

const R_PANEL_COLOR_NAMES = ['Bone White', 'Bronze', 'Burgundy', 'Charcoal Gray', 'Forest Green', 'True Black']

const FAQS = [
  {
    q: 'What is R-panel metal roofing?',
    a: 'R-panel is an exposed-fastener metal roofing system — ribbed steel panels installed with screws driven directly through the panel face. It\'s a proven, straightforward system widely used on both residential and agricultural buildings across Texas.',
  },
  {
    q: 'Is R-panel a good long-term roofing option?',
    a: 'Yes. R-panel typically lasts 40 to 60 years — far beyond asphalt shingles — and carries the same Class 4 hail rating as our other steel systems. The tradeoff versus standing seam is the exposed fastener pattern, not the underlying durability of the steel.',
  },
  {
    q: 'What colors does R-panel come in?',
    a: `Our R-panel systems come in six factory finishes: ${R_PANEL_COLOR_NAMES.join(', ')}. Every finish carries the same panel warranty and Class 4 rating.`,
  },
  {
    q: 'Does R-panel qualify for insurance discounts in DFW?',
    a: 'Yes. R-panel carries a Class 4 impact resistance rating — the highest available — which qualifies for meaningful premium discounts from most Texas carriers, the same as our other metal roofing systems.',
  },
  {
    q: 'How much does R-panel metal roofing cost per square foot in DFW?',
    a: 'R-panel is the most affordable metal roofing system we install, running about $7–$11 per square foot installed in the Dallas–Fort Worth market. On a representative 3,500 sq ft roof, that works out to roughly $24,500–$38,500 installed. Your exact number depends on roof size, pitch, and complexity — request a free estimate for your specific home.',
  },
]

function RPanelSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/r-panel-roofing/#service`,
        'name': 'R-Panel Metal Roofing',
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
        '@id': `${BASE_URL}/r-panel-roofing/#faq`,
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
          { '@type': 'ListItem', 'position': 2, 'name': 'R-Panel Roofing', 'item': `${BASE_URL}/r-panel-roofing/` },
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

export default function RPanelRoofingPage() {
  return (
    <>
      <style>{fonts + globalStyles}</style>
      <style>{`
        .rpanel-breadcrumb-home { color: ${C.muted}; transition: color 0.2s; }
        .rpanel-breadcrumb-home:hover { color: ${C.accent}; }
        .rpanel-cta-primary { background: ${C.accent}; transition: background 0.2s; }
        .rpanel-cta-primary:hover { background: ${C.accentLight}; }
        .rpanel-cta-secondary { border: 1px solid ${C.border}; transition: border-color 0.2s; }
        .rpanel-cta-secondary:hover { border-color: ${C.accentDark}; }
        .rpanel-city-pill { border: 1px solid ${C.border}; color: ${C.mutedLight}; transition: all 0.2s; }
        .rpanel-city-pill:hover { border-color: ${C.accent}; color: ${C.accent}; }
      `}</style>
      <RPanelSchema />
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <SiteNav />

        {/* ── BREADCRUMB ── */}
        <div style={{ position: 'fixed', top: 84, left: 0, right: 0, zIndex: 190, background: `${C.black}EE`, borderBottom: `1px solid ${C.border}`, padding: '8px 40px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          <Link href="/" className="rpanel-breadcrumb-home">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: C.accent }}>R-Panel Roofing</span>
        </div>

        {/* ── HERO ── */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(150px,14vw,190px) clamp(24px,5vw,64px) clamp(80px,8vw,120px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0D0A 0%,#1A160E 45%,#0D0C0B 100%)', zIndex: 0 }} />
          <div className="inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 'clamp(0.75rem,1.1vw,0.95rem)', letterSpacing: 3.5, color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>Premium Metal Roofing · Dallas–Fort Worth</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.75rem,5.5vw,5.5rem)', fontWeight: 700, lineHeight: 1.08, color: C.white, marginBottom: 24, maxWidth: 780 }}>
              The Smart Entry<br/><span style={{ color: C.accent, fontStyle: 'italic' }}>Into Metal Roofing.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1.05rem,1.3vw,1.1875rem)', lineHeight: 1.8, color: C.mutedLight, maxWidth: 560, marginBottom: 40, fontWeight: 500 }}>
              A proven exposed-fastener steel panel system offering exceptional durability and longevity — the most affordable way into metal roofing without sacrificing long-term performance.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn rpanel-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
              <Link href="/visualizer?roofType=r_panel" className="cta-btn rpanel-cta-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'transparent', color: C.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >See It On Your Home →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              {['Class 4 Hail Rating', '40–60 Year Lifespan', 'Most Affordable Metal Option', '10-Year Workmanship Warranty'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.muted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── R-PANEL VS ASPHALT ── */}
        <section className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead
              eyebrow="Why R-Panel"
              title="The Most Affordable Way Off Asphalt"
              sub="R-panel costs less per square foot than any other metal system we install, and still leaves asphalt shingles behind on every durability measure that matters."
              center
            />
            <div className="grid-2" style={{ gap: 3 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(28px,4vw,48px)', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#52525B', flexShrink: 0 }} />
                  <div style={{ fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: C.muted }}>Asphalt Shingles</div>
                </div>
                {[
                  { label: 'Lifespan', val: 'Typically 15–20 years before a full replacement is needed.' },
                  { label: 'Hail Resistance', val: 'No meaningful impact rating on standard shingles — hail damage is the most common claim in North Texas.' },
                  { label: 'Insurance', val: 'No Class 4 discount available on standard asphalt.' },
                  { label: 'Long-Term Cost', val: 'Lower upfront cost, but repeated replacement cycles over a 40-year ownership horizon.' },
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
                  <div style={{ fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: C.accent }}>R-Panel</div>
                </div>
                {[
                  { label: 'Lifespan', val: '40 to 60 years — two to three full asphalt cycles in one install.' },
                  { label: 'Hail Resistance', val: 'Class 4 impact rating — the highest available — the same rating as our premium systems.' },
                  { label: 'Insurance', val: 'Qualifies for meaningful premium discounts from most Texas carriers.' },
                  { label: 'Long-Term Cost', val: 'The lowest cost per square foot of any metal system we install, with metal-level durability.' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '18px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── R-PANEL VS STANDING SEAM ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead
              eyebrow="An Honest Comparison"
              title="R-Panel vs. Standing Seam"
              sub="We install both. Here's how we actually think about which one fits a given home — not a sales pitch for either."
              center
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose R-Panel If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  You want the lowest cost per square foot of any metal roofing system, and you don&apos;t need the fully concealed fastener line standing seam offers. It&apos;s a genuine, durable metal roof at the most accessible price point.
                </p>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Standing Seam If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  You want the longest possible lifespan (50–70 years vs. 40–60) and zero exposed fasteners, and the higher per-square-foot cost fits your budget. <Link href="/standing-seam-roofing" style={{ color: C.accent }}>See the full standing seam guide →</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <PricingTable
              title="R-Panel Metal Roofing Costs in DFW"
              intro="R-panel runs $7–$11/sq ft installed — the most affordable metal system we offer. Installed cost by material, based on current DFW-wide market rates."
            />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead eyebrow="FAQ" title="R-Panel Roofing Questions" center />
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

        {/* ── SERVICE AREAS ── */}
        <section id="service-areas" className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead eyebrow="Service Areas" title="R-Panel Roofing Across DFW" sub="We install R-panel metal roofing throughout the Dallas–Fort Worth Metroplex. Find your city below." center />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}>
              {CITIES.map(([name, slug]) => (
                <Link key={slug} href={`/metal-roofing-${slug}-tx`} className="rpanel-city-pill"
                  style={{ padding: '9px 18px', borderRadius: 2, fontSize: 12, letterSpacing: 1, textDecoration: 'none' }}
                >{name}</Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <div className="inner" style={{ maxWidth: 640 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3rem)', fontWeight: 700, color: C.white, lineHeight: 1.15, marginBottom: 20 }}>
              Ready For a Metal Roof<br/><span style={{ fontStyle: 'italic', color: C.accent }}>At the Right Price?</span>
            </h2>
            <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, marginBottom: 40 }}>
              A quick call with our team is the fastest way to find out if R-panel is the right fit for your home and your budget — no pressure, no obligation.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn rpanel-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
              <Link href="/#products" className="cta-btn rpanel-cta-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'transparent', color: C.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Explore Our Other Systems</Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}
