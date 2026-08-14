import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'
import PricingTable from '@/components/PricingTable'

const BASE_URL = 'https://www.metroplexmetalroofs.com'
const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR'

export const metadata: Metadata = {
  title: 'Copper Roofing Dallas–Fort Worth | Metroplex Metal Roofs',
  description: 'Copper roofing for DFW estate homes — a 100+ year lifespan and a natural patina that evolves for generations. The most premium material in residential roofing. Free consultation.',
  alternates: {
    canonical: '/copper-roofing',
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

const FAQS = [
  {
    q: 'How long does a copper roof last?',
    a: 'Copper roofing routinely lasts 100 years or more — it is, by a wide margin, the longest-lived material in residential roofing. Many copper roofs installed in the early 1900s are still fully functional today.',
  },
  {
    q: 'Why does copper change color over time?',
    a: 'Copper develops a protective oxide layer through natural weathering: bright copper for roughly the first year, shifting to brown tones over the following decade, and eventually settling into the green verdigris patina copper is known for after 20–30+ years. That patina layer is what protects the metal underneath — it is a feature, not wear.',
  },
  {
    q: 'How much does copper roofing cost per square foot in DFW?',
    a: 'Copper runs about $25–$40+ per square foot installed in the Dallas–Fort Worth market — the highest cost of any material we install, reflecting both the raw material and the specialized installation it requires. On a representative 3,500 sq ft roof, that works out to roughly $87,500–$140,000+ installed. Full copper roofs are most common on estate-level homes; many homeowners use copper selectively as an accent (dormers, entries, bay windows) alongside a standing seam main roof.',
  },
  {
    q: 'Does copper roofing require maintenance?',
    a: 'Very little. Once the patina layer forms, it is essentially self-protecting and does not need repainting, recoating, or the periodic upkeep other roofing materials require. It is among the lowest-maintenance materials available.',
  },
  {
    q: 'Can I use copper as an accent instead of a full roof?',
    a: 'Yes — copper accents on dormers, entryways, bay windows, or porch roofs are a common way to bring copper\'s look and permanence into a project without the cost of a full copper roof, typically paired with standing seam steel on the main roof planes.',
  },
]

function CopperSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/copper-roofing/#service`,
        'name': 'Copper Roofing',
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
        '@id': `${BASE_URL}/copper-roofing/#faq`,
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
          { '@type': 'ListItem', 'position': 2, 'name': 'Copper Roofing', 'item': `${BASE_URL}/copper-roofing/` },
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

export default function CopperRoofingPage() {
  return (
    <>
      <style>{fonts + globalStyles}</style>
      <style>{`
        .copper-breadcrumb-home { color: ${C.muted}; transition: color 0.2s; }
        .copper-breadcrumb-home:hover { color: ${C.accent}; }
        .copper-cta-primary { background: ${C.accent}; transition: background 0.2s; }
        .copper-cta-primary:hover { background: ${C.accentLight}; }
        .copper-cta-secondary { border: 1px solid ${C.border}; transition: border-color 0.2s; }
        .copper-cta-secondary:hover { border-color: ${C.accentDark}; }
        .copper-city-pill { border: 1px solid ${C.border}; color: ${C.mutedLight}; transition: all 0.2s; }
        .copper-city-pill:hover { border-color: ${C.accent}; color: ${C.accent}; }
      `}</style>
      <CopperSchema />
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <SiteNav />

        {/* ── BREADCRUMB ── */}
        <div style={{ position: 'fixed', top: 84, left: 0, right: 0, zIndex: 190, background: `${C.black}EE`, borderBottom: `1px solid ${C.border}`, padding: '8px 40px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          <Link href="/" className="copper-breadcrumb-home">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: C.accent }}>Copper Roofing</span>
        </div>

        {/* ── HERO ── */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(150px,14vw,190px) clamp(24px,5vw,64px) clamp(80px,8vw,120px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0D0A 0%,#1A160E 45%,#0D0C0B 100%)', zIndex: 0 }} />
          <div className="inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 'clamp(0.75rem,1.1vw,0.95rem)', letterSpacing: 3.5, color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>Premium Copper Roofing · Dallas–Fort Worth</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.75rem,5.5vw,5.5rem)', fontWeight: 700, lineHeight: 1.08, color: C.white, marginBottom: 24, maxWidth: 780 }}>
              A Roof That<br/><span style={{ color: C.accent, fontStyle: 'italic' }}>Outlives the Mortgage.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1.05rem,1.3vw,1.1875rem)', lineHeight: 1.8, color: C.mutedLight, maxWidth: 560, marginBottom: 40, fontWeight: 500 }}>
              One material whose finish evolves for generations. Copper roofing lasts 100+ years and signals enduring quality most materials can&apos;t match.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn copper-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
              <Link href="/visualizer?roofType=copper_standing_seam" className="cta-btn copper-cta-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'transparent', color: C.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >See It On Your Home →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              {['100+ Year Lifespan', 'Natural, Self-Protecting Patina', 'Near-Zero Maintenance', '10-Year Workmanship Warranty'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.muted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE PATINA TIMELINE ── */}
        <section className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead
              eyebrow="A Living Finish"
              title="Copper Isn't Chosen From a Color Chart"
              sub="It's one material whose surface evolves for decades — and every stage of that evolution is protecting the roof underneath, not wearing it down."
              center
            />
            <div className="grid-2" style={{ gap: 3, gridTemplateColumns: 'repeat(3,1fr)' }}>
              {[
                { stage: 'Year 1', title: 'Bright Copper', desc: 'The roof installs with copper\'s familiar bright, warm metallic tone — the same look as a new penny.' },
                { stage: '~Year 10', title: 'Brown Tones', desc: 'Natural oxidation shifts the surface through a range of brown and russet tones as the protective layer builds.' },
                { stage: 'Year 30+', title: 'Green Verdigris', desc: 'The surface settles into the green-blue verdigris patina copper is known for — fully self-protecting at this stage.' },
              ].map(item => (
                <div key={item.stage} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>{item.stage}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 10 }}>{item.title}</div>
                  <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COPPER VS STANDING SEAM ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead
              eyebrow="An Honest Comparison"
              title="Copper vs. Standing Seam Steel"
              sub="We install both. Here's how we actually think about which one fits a given home — not a sales pitch for either."
              center
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Copper If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  You want the longest possible lifespan (100+ years), a living finish that evolves for generations, and you&apos;re building or renovating an estate-level home where cost is secondary to permanence and craft.
                </p>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Standing Seam If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  You want a 50–70 year lifespan and the same hidden-fastener architectural line at roughly half the cost per square foot — or you want to reserve copper for an accent instead of the full roof. <Link href="/standing-seam-roofing" style={{ color: C.accent }}>See the full standing seam guide →</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <PricingTable
              title="Copper Roofing Costs in DFW"
              intro="Copper runs $25–$40+/sq ft installed — the highest cost of any material we install, and the longest lifespan. Installed cost by material, based on current DFW-wide market rates."
            />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead eyebrow="FAQ" title="Copper Roofing Questions" center />
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
            <SHead eyebrow="Service Areas" title="Copper Roofing Across DFW" sub="We install copper roofing — full roofs and accents — throughout the Dallas–Fort Worth Metroplex. Find your city below." center />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}>
              {CITIES.map(([name, slug]) => (
                <Link key={slug} href={`/metal-roofing-${slug}-tx`} className="copper-city-pill"
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
              Building Something<br/><span style={{ fontStyle: 'italic', color: C.accent }}>Meant to Last Generations?</span>
            </h2>
            <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, marginBottom: 40 }}>
              A quick call with our team is the fastest way to find out if copper — full roof or accent — is the right fit for your home. No pressure, no obligation.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn copper-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
              <Link href="/#products" className="cta-btn copper-cta-secondary"
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
