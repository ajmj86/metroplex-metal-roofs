import type { Metadata } from 'next'
import Link from 'next/link'
import UtmLink from '@/components/UtmLink'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'

const BASE_URL = 'https://www.metroplexmetalroofs.com'
const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR'

export const metadata: Metadata = {
  title: 'Brava vs DaVinci Roofing Comparison | Metroplex',
  description: "Brava and DaVinci composite roofing side by side: profiles, thickness, wind, impact, fire, color, and warranty from each maker's published specs.",
  alternates: {
    canonical: '/brava-vs-davinci-roofing',
  },
}

/*
 * Spec table. Brava color facts: Brava Technical Bulletin TB-240402R1,
 * "UV Testing & Color Durability". Brava column: facts supplied by the owner from Brava's slate
 * and cedar shake spec sheets, brochures, and QAI report CERus-1014.
 * DaVinci column: DaVinci's own website only.
 *   Profiles:      https://www.davinciroofscapes.com/products/ (product menu)
 *   Thickness:     https://www.davinciroofscapes.com/products/slate/multi-width-slate/
 *                  ("Profiles range from 1/4-inch to 5/8-inch"; shown for Multi-Width Slate only)
 *   Wind, Impact:  https://www.davinciroofscapes.com/extreme-weather-hail/
 *                  ("Class 4 Impact Rating, 110 mph straight line Wind Rating,
 *                  and 180mph Hurricane Zone Winds")
 *   Fire:          https://www.davinciroofscapes.com/products/slate/
 *                  ("All DaVinci roofing products have a Class-A Fire Rating")
 *   Warranty:      https://www.davinciroofscapes.com/products/slate/multi-width-slate/
 *                  ("Lifetime Limited Material Warranty")
 * Not published on pages reachable for this build (shown as "See manufacturer"):
 * wind installation conditions, fire assembly conditions, color construction,
 * warranty terms.
 */
const SPECS: { label: string; brava: string; davinci: string }[] = [
  {
    label: 'Profiles',
    brava: 'Brava Slate, Brava Cedar Shake, Brava Spanish Barrel Tile',
    davinci: 'Slate (Multi-Width, Single-Width, Province, Inspire) and Shake (Multi-Width, Single-Width, Select)',
  },
  {
    label: 'Thickness',
    brava: 'Slate 1 inch. Cedar Shake 5/8 to 1 inch.',
    davinci: "Multi-Width Slate: 1/4 to 5/8 inch, per DaVinci's product page. See manufacturer for other profiles.",
  },
  {
    label: 'Wind',
    brava: 'Tested and approved to withstand up to 188 mph with nails and up to 211 mph with high-wind screw installation.',
    davinci: '110 mph straight-line wind rating and 180 mph for hurricane zones. See manufacturer for installation conditions.',
  },
  {
    label: 'Impact',
    brava: 'Class 4',
    davinci: 'Class 4',
  },
  {
    label: 'Fire',
    brava: 'Class A fire rating available. The rating depends on the roof assembly and installation.',
    davinci: 'Class A fire rating. See manufacturer for assembly conditions.',
  },
  {
    label: 'Color',
    brava: 'ColorCast mineral-infusion process. Mineral pigments through the full thickness of the tile, UV-tested for color durability.',
    davinci: 'See manufacturer',
  },
  {
    label: 'Warranty',
    brava: 'Limited Lifetime Warranty, defined by Brava as 50 years. See manufacturer for terms.',
    davinci: 'Lifetime limited material warranty. See manufacturer for terms.',
  },
]

const FAQS = [
  {
    q: 'Which is the right fit for North Texas, Brava or DaVinci?',
    a: "Both are premium composite roofs with a Class 4 impact rating, so the right choice depends on the profile you want, your home's style, and your HOA. We install Brava, and we are glad to walk through the published specifications of each with you.",
  },
  {
    q: 'Do both have a Class 4 impact rating?',
    a: 'Yes, both manufacturers publish a Class 4 impact rating for their composite roofing. Ratings depend on installation, so confirm the details for your roof with the manufacturer.',
  },
  {
    q: 'Which offers a Spanish tile look?',
    a: "Brava offers Spanish Barrel Tile, a traditional clay tile look for Spanish, Mediterranean, and Tuscan style homes. DaVinci's published lineup focuses on slate and shake.",
  },
  {
    q: 'Can I see Brava on my own home before deciding?',
    a: 'Yes. Our Free Roof Visualizer renders all three Brava profiles on your own home before you decide. Enter your address, choose a profile and color, and see the result in about a minute.',
  },
  {
    q: 'Do you install DaVinci?',
    a: 'We specialize in Brava and metal roofing, and that is what we install. If you are comparing the two, we are happy to walk through the published specifications and show Brava on your home.',
  },
]

function CompareSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/brava-vs-davinci-roofing/#page`,
        'url': `${BASE_URL}/brava-vs-davinci-roofing`,
        'name': 'Brava vs DaVinci Roofing Comparison',
        'description': metadata.description,
        'about': {
          '@type': 'RoofingContractor',
          'name': 'Metroplex Metal Roofs',
          'legalName': 'Allied Roofing Partners LLC',
          'telephone': '+18173823338',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/brava-vs-davinci-roofing/#faq`,
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
          { '@type': 'ListItem', 'position': 2, 'name': 'Brava Synthetic Slate Roofing', 'item': `${BASE_URL}/synthetic-slate-roofing/` },
          { '@type': 'ListItem', 'position': 3, 'name': 'Brava vs DaVinci Roofing', 'item': `${BASE_URL}/brava-vs-davinci-roofing/` },
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
    {sub && <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, maxWidth: center ? 620 : '100%', margin: center ? '0 auto' : 0 }}>{sub}</p>}
  </div>
)

export default function BravaVsDaVinciPage() {
  return (
    <>
      <style>{fonts + globalStyles}</style>
      {/* Server Component (metadata export), so hover states use plain CSS classes. */}
      <style>{`
        .cmp-breadcrumb-link { color: ${C.muted}; transition: color 0.2s; }
        .cmp-breadcrumb-link:hover { color: ${C.accent}; }
        .cmp-cta-primary { background: ${C.accent}; transition: background 0.2s; }
        .cmp-cta-primary:hover { background: ${C.accentLight}; }
        .cmp-cta-secondary { border: 1px solid ${C.border}; transition: border-color 0.2s; }
        .cmp-cta-secondary:hover { border-color: ${C.accentDark}; }
        .cmp-table-wrap { overflow-x: auto; border: 1px solid ${C.border}; border-radius: 8px; background: ${C.card}; }
        .cmp-table { width: 100%; min-width: 640px; border-collapse: collapse; }
        .cmp-table th, .cmp-table td { padding: 18px 22px; text-align: left; vertical-align: top; border-bottom: 1px solid ${C.border}; }
        .cmp-table tr:last-child td { border-bottom: none; }
        @media (max-width: 700px) {
          .cmp-table { min-width: 0; }
          .cmp-table thead { display: none; }
          .cmp-table, .cmp-table tbody, .cmp-table tr, .cmp-table td { display: block; width: 100%; }
          .cmp-table tr { border-bottom: 1px solid ${C.border}; padding: 8px 0; }
          .cmp-table tr:last-child { border-bottom: none; }
          .cmp-table td { border-bottom: none; padding: 8px 20px; }
          .cmp-table td[data-label]::before { content: attr(data-label); display: block; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.accent}; font-weight: 600; margin-bottom: 4px; }
          .cmp-table td.cmp-spec-name { padding-top: 14px; font-size: 13px; }
        }
      `}</style>
      <CompareSchema />
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <SiteNav />

        {/* ── BREADCRUMB ── */}
        <div style={{ position: 'fixed', top: 84, left: 0, right: 0, zIndex: 190, background: `${C.black}EE`, borderBottom: `1px solid ${C.border}`, padding: '8px 40px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          <Link href="/" className="cmp-breadcrumb-link">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href="/synthetic-slate-roofing" className="cmp-breadcrumb-link">Brava Synthetic Slate Roofing</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: C.accent }}>Brava vs DaVinci</span>
        </div>

        {/* ── HERO + INTRO ── */}
        <section style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(150px,14vw,190px) clamp(24px,5vw,64px) clamp(70px,8vw,110px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0D0A 0%,#1A160E 45%,#0D0C0B 100%)', zIndex: 0 }} />
          <div className="inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 'clamp(0.75rem,1.1vw,0.95rem)', letterSpacing: 3.5, color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>Composite Slate & Shake Comparison · Dallas–Fort Worth</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.75rem,5.5vw,5.5rem)', fontWeight: 700, lineHeight: 1.08, color: C.white, marginBottom: 24, maxWidth: 820 }}>
              Brava and DaVinci,<br/><span style={{ color: C.accent, fontStyle: 'italic' }}>Side by Side.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1.05rem,1.3vw,1.1875rem)', lineHeight: 1.8, color: C.mutedLight, maxWidth: 640, marginBottom: 16, fontWeight: 500 }}>
              Brava and DaVinci are both premium composite roofs that give a home the look of slate or shake without natural slate's weight and upkeep.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 640, marginBottom: 40 }}>
              Here are the published specifications from each manufacturer, laid out side by side so you can compare them on the facts.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <UtmLink href="/visualizer" className="cta-btn cmp-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >See Brava on Your Home →</UtmLink>
            </div>
          </div>
        </section>

        {/* ── SPEC TABLE ── */}
        <section id="specs" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead
              eyebrow="Specifications"
              title="The Published Specs"
              sub="Each column comes from that manufacturer's own published materials."
              center
            />
            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th style={{ width: '16%', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted, fontWeight: 600 }}>Specification</th>
                    <th style={{ width: '42%', fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.accent, fontWeight: 700 }}>Brava</th>
                    <th style={{ width: '42%', fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.white, fontWeight: 700 }}>DaVinci</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECS.map(row => (
                    <tr key={row.label}>
                      <td className="cmp-spec-name" style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, fontWeight: 600 }}>{row.label}</td>
                      <td data-label="Brava" style={{ fontSize: 15, color: C.text, lineHeight: 1.7 }}>{row.brava}</td>
                      <td data-label="DaVinci" style={{ fontSize: 15, color: row.davinci === 'See manufacturer' ? C.muted : C.text, lineHeight: 1.7 }}>{row.davinci}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, marginTop: 16, textAlign: 'center' }}>
              Specifications from each manufacturer's published materials as of October 2026. Ratings depend on installation and test method, so figures from different manufacturers may not be directly comparable.
            </p>
          </div>
        </section>

        {/* ── PROFILES ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead eyebrow="Profiles" title="Which Looks Are Available" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                Brava offers Spanish Barrel Tile for Spanish, Mediterranean, and Tuscan style homes. DaVinci's published lineup focuses on slate and shake.
              </p>
              <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                Brava Slate gives a crisp, dimensional slate look. Brava Cedar Shake gives a hand-split wood look. Brava Spanish Barrel Tile brings the traditional clay tile look. DaVinci offers its slate and shake looks in single-width and multi-width options.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY WE INSTALL BRAVA ── */}
        <section className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead eyebrow="Our Choice" title="Why We Install Brava" center />
            <div className="g3">
              {[
                {
                  label: 'Three Profiles',
                  val: 'Brava gives us slate, cedar shake, and Spanish barrel tile, so one manufacturer covers traditional, rustic, and Mediterranean homes.',
                },
                {
                  label: 'The Specs',
                  val: "Brava tiles are compression molded, which Brava says makes them stronger and more detailed. They carry a Class 4 impact rating. Color comes from Brava's ColorCast mineral-infusion process, which disperses mineral pigments through the full thickness of each tile, and the color is UV-tested for durability.",
                },
                {
                  label: 'See It on Your Home',
                  val: 'Homeowners can see Brava on their own home in our Free Roof Visualizer before they decide.',
                  link: true,
                },
              ].map(item => (
                <div key={item.label} style={{ padding: 'clamp(24px,3vw,32px)', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, height: '100%' }}>
                  <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, marginBottom: 10, fontWeight: 600 }}>{item.label}</div>
                  <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.75, margin: 0 }}>{item.val}</p>
                  {item.link && (
                    <UtmLink href="/visualizer" style={{ display: 'inline-block', marginTop: 14, fontSize: 12, color: C.accent, letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'underline' }}>
                      Try the Free Roof Visualizer →
                    </UtmLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead eyebrow="FAQ" title="Brava and DaVinci Questions" center />
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
        <section className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <div className="inner" style={{ maxWidth: 640 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3rem)', fontWeight: 700, color: C.white, lineHeight: 1.15, marginBottom: 20 }}>
              See Brava<br/><span style={{ fontStyle: 'italic', color: C.accent }}>On Your Own Home.</span>
            </h2>
            <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, marginBottom: 40 }}>
              Render your home with Brava Slate, Cedar Shake, or Spanish Barrel Tile, then talk through the specifications with our team. No pressure, no obligation.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <UtmLink href="/visualizer" className="cta-btn cmp-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get Your Roof Rendering & Estimate →</UtmLink>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn cmp-cta-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'transparent', color: C.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Book a Free Consultation</a>
            </div>
          </div>
        </section>

        {/* ── TRADEMARK NOTE ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px clamp(24px,5vw,64px)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
            DaVinci is a trademark of its owner. This page compares published specifications and is not sponsored by either manufacturer.
          </p>
        </div>

        <SiteFooter />
      </div>
    </>
  )
}
