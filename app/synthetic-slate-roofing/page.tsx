import type { Metadata } from 'next'
import Link from 'next/link'
import UtmLink from '@/components/UtmLink'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { C, fonts, globalStyles } from '@/components/brand'
import PricingTable from '@/components/PricingTable'
import { BRAVA_PROFILES } from '@/lib/bravaColors'
import { FAQ_RATE } from '@/lib/pricingData'
import { ALL_CITIES } from '@/data/cities'

const BASE_URL = 'https://www.metroplexmetalroofs.com'
const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR'

export const metadata: Metadata = {
  title: 'Brava Synthetic Slate Roofing DFW | Metroplex Metal Roofs',
  description: "Brava synthetic slate roofing for DFW homeowners who want slate's timeless look without the weight or upkeep. Class 4 rated. Free consultation.",
  alternates: {
    // No trailing slash -- trailingSlash isn't enabled in next.config.ts,
    // so this matches the actual served URL exactly (same fix applied to
    // the city pages' canonicals in CityPageSchema.tsx).
    canonical: '/synthetic-slate-roofing',
  },
}

// Descriptive copy + which colors to surface as flavor examples, keyed to
// BRAVA_PROFILES so the name/color data has one source of truth (lib/bravaColors.ts)
// instead of drifting if that file's color list ever changes.
const BRAVA_PROFILE_COPY: Record<string, { desc: string; flavorColors: [string, string] }> = {
  'spanish-barrel-tile': {
    desc: "A rounded, high-relief barrel profile that reads as authentic clay tile from the curb, popular on Mediterranean, Spanish Colonial, and Tuscan-style homes across DFW.",
    flavorColors: ['Aged Mission', 'Tuscan Clay'],
  },
  'cedar-shake': {
    desc: "A deeply textured, hand-split shake profile for homeowners who want a rustic, natural-wood look without cedar's fire risk, rot, or ongoing upkeep.",
    flavorColors: ['Aged Cedar', 'Natural Cedar'],
  },
  'slate': {
    desc: "A crisp, dimensional slate profile, the closest match to authentic quarried slate, suited to historic-style, French Country, and traditional architecture.",
    flavorColors: ['Arendale', 'Onyx'],
  },
}

// Service Areas chips: every city page flagged leadWithBrava in its data, so the
// list follows the data instead of a hardcoded set of slugs. Neighborhood pages
// (parentCity set) show as "Name, Parent".
const CITIES: [string, string][] = ALL_CITIES
  .filter(c => c.leadWithBrava)
  .map(c => [c.parentCity ? `${c.name}, ${c.parentCity}` : c.name, c.slug] as [string, string])
  .sort((x, y) => x[0].localeCompare(y[0]))

const FAQS = [
  {
    q: 'What Brava synthetic slate and tile styles does Metroplex Metal Roofs install?',
    a: 'We install three Brava composite profiles: Brava Spanish Barrel Tile (a rounded clay-tile profile for Mediterranean and Spanish Colonial-style homes), Brava Cedar Shake (a textured, hand-split wood-shake look without the fire risk or upkeep of real cedar), and Brava Slate (a crisp, dimensional profile that\'s the closest match to authentic quarried slate). Each comes in a range of factory colors. We\'ll walk through samples for your specific home during your free consultation.',
  },
  {
    q: 'Does Brava synthetic slate fade over time?',
    a: 'Brava\'s color comes from mineral pigments that run through the full thickness of each tile, rather than from a surface coating. Sun and weather will still age any exterior material gradually, so we recommend looking at samples in daylight. Ask us about the color durability testing Brava publishes.',
  },
  {
    q: 'Does synthetic slate curl or warp?',
    a: 'Curling and warping usually trace back to how a roof was installed, not to the tile itself. Following Brava\'s published installation guide is the safeguard, and that is how our crews install Brava. We are glad to explain the installation steps before you decide.',
  },
  {
    q: 'Can Brava crack in Texas heat or a hard freeze?',
    a: 'Brava\'s spec sheets list the tiles as freeze and thaw resistant, and they are compression molded with a Class 4 impact rating. For Texas heat, proper installation matters, including the expansion spacing in Brava\'s installation guide. We install to that guide, and we are honest that no roof is immune to every condition.',
  },
  {
    q: 'Composite roofing is newer than slate. Why trust it?',
    a: 'Brava\'s products are tested and evaluated for weather, wind, fire, and hail resistance under the building codes. They are also backed by a 50-year limited warranty from Brava. Because composite is a newer category, we suggest judging it for yourself: we bring samples to your inspection, and the Free Roof Visualizer shows each profile on your own home.',
  },
  {
    q: 'Does Brava look fake or like plastic up close?',
    a: 'Brava is made to look like natural slate, shake, or tile, with natural color variation from tile to tile. The surest test is to see it in person, so we bring samples to your inspection. You can also preview each profile on your own home in the Free Roof Visualizer.',
  },
  {
    q: 'How does Brava hold up to hail?',
    a: 'Brava carries a Class 4 impact rating, the highest rating available for impact resistance. That rating is why many homeowners in hail-prone areas consider it, and why most Texas insurers discount Class 4 roofs. Check with your insurance carrier for the specifics on your policy.',
  },
  {
    q: 'Is Brava fire rated?',
    a: 'A Class A fire rating is available with Brava when it is installed as a complete Brava roof system. The rating depends on the roof assembly and installation, so we confirm the right assembly for your home and local requirements.',
  },
  {
    q: 'What is Brava made from?',
    a: 'Brava is a composite made with recycled material, and the tiles are fully recyclable. Each tile is compression molded, which Brava says makes the tiles stronger and more detailed.',
  },
  {
    q: 'How long does a Brava roof last?',
    a: 'Brava is built as a long-term roof and is backed by a 50-year limited warranty from Brava. We do not quote an exact lifespan, since installation and care matter, but we are glad to walk through the warranty terms with you.',
  },
]

function SlateSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/synthetic-slate-roofing/#service`,
        'name': 'Brava Synthetic Slate Roofing',
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
          { '@type': 'ListItem', 'position': 2, 'name': 'Brava Synthetic Slate Roofing', 'item': `${BASE_URL}/synthetic-slate-roofing/` },
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
        .slate-city-pill { border: 1px solid ${C.border}; color: ${C.mutedLight}; transition: all 0.2s; }
        .slate-city-pill:hover { border-color: ${C.accent}; color: ${C.accent}; }
      `}</style>
      <SlateSchema />
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <SiteNav />

        {/* ── BREADCRUMB ── */}
        <div style={{ position: 'fixed', top: 84, left: 0, right: 0, zIndex: 190, background: `${C.black}EE`, borderBottom: `1px solid ${C.border}`, padding: '8px 40px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          <Link href="/" className="slate-breadcrumb-home">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: C.accent }}>Brava Synthetic Slate Roofing</span>
        </div>

        {/* ── HERO ── */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(150px,14vw,190px) clamp(24px,5vw,64px) clamp(80px,8vw,120px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0D0A 0%,#1A160E 45%,#0D0C0B 100%)', zIndex: 0 }} />
          <div className="inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 'clamp(0.75rem,1.1vw,0.95rem)', letterSpacing: 3.5, color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>Premium Brava Synthetic Slate Roofing · Dallas–Fort Worth</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.75rem,5.5vw,5.5rem)', fontWeight: 700, lineHeight: 1.08, color: C.white, marginBottom: 24, maxWidth: 780 }}>
              Slate's Look.<br/><span style={{ color: C.accent, fontStyle: 'italic' }}>None of Slate's Problems.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1.05rem,1.3vw,1.1875rem)', lineHeight: 1.8, color: C.mutedLight, maxWidth: 560, marginBottom: 16, fontWeight: 500 }}>
              Brava synthetic slate roofing for DFW homeowners who want a traditional, dimensional roofline, without real slate's weight, fragility, or cost.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 560, marginBottom: 40 }}>
              We install <strong style={{ color: C.mutedLight, fontWeight: 600 }}>Brava</strong> composite roofing in three profiles: Spanish Barrel Tile, Cedar Shake, and Slate. Brava is the manufacturer behind every synthetic profile on this page.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn slate-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
              {['Class 4 Hail Rating', 'Far Lighter Than Natural Slate', '10-Year Workmanship Warranty'].map(t => (
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
              eyebrow="Why Brava Synthetic Slate"
              title="The Problem With Real Slate and What Solves It"
              sub="Real slate has always been one of the most beautiful roofing materials, and one of the most impractical. Brava synthetic slate exists to solve that."
              center
            />
            <div className="grid-2" style={{ gap: 3 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(28px,4vw,48px)', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#52525B', flexShrink: 0 }} />
                  <div style={{ fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: C.muted }}>Real Slate</div>
                </div>
                {[
                  { label: 'Weight', val: 'Often 800–1,500+ lbs per square, which frequently requires structural reinforcement most homes were never built for.' },
                  { label: 'Fragility', val: "Brittle underfoot and prone to cracking in hail, the exact condition North Texas roofs face every spring." },
                  { label: 'Cost', val: 'One of the most expensive roofing materials available, installed by a small pool of specialized crews.' },
                  { label: 'Maintenance', val: 'Individual tiles crack and need periodic replacement over the roof\'s life, rarely a one-and-done install.' },
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
                  <div style={{ fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: C.accent }}>Brava Synthetic Slate</div>
                </div>
                {[
                  { label: 'Weight', val: 'Far lighter than natural slate or clay tile, so most homes can take Brava without added structural support. We confirm your roof deck and framing during the inspection.' },
                  { label: 'Durability', val: 'Class 4 impact-rated composite construction, built to withstand North Texas hail without cracking.' },
                  { label: 'Cost', val: 'A fraction of real slate\'s installed cost, closer to premium metal or high-end stone-coated steel.' },
                  { label: 'Maintenance', val: 'A single system installed once, backed by a 50-year limited warranty from Brava, not a roof you\'re periodically patching.' },
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

        {/* ── BRAVA PROFILES ── */}
        <section className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead
              eyebrow="By Brava"
              title="Three Profiles. One Manufacturer."
              sub="We install Brava composite roofing exclusively for Brava synthetic slate and tile. Here's what each profile actually looks like on a roof."
              center
            />
            <div className="grid-3" style={{ gap: 3 }}>
              {BRAVA_PROFILES.map(profile => {
                const copy = BRAVA_PROFILE_COPY[profile.key]
                return (
                  <div key={profile.key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)', height: '100%' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 12 }}>{profile.name}</div>
                    <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.75, margin: 0 }}>
                      {copy.desc} Comes in tones like {copy.flavorColors[0]} and {copy.flavorColors[1]}.
                    </p>
                  </div>
                )
              })}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              padding: '20px 24px', marginTop: 32,
              background: `${C.accentDark}18`, borderLeft: `3px solid ${C.accent}`, borderRadius: 6,
            }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.accent, fontWeight: 600, flexShrink: 0 }}>Try It Now</div>
              <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.7, margin: 0, flex: 1, minWidth: 240 }}>
                All three Brava profiles (Spanish Barrel Tile, Cedar Shake, and Slate) are live in our Free Roof Visualizer, so you can see each one rendered on your own home before you decide.
              </p>
              <UtmLink href="/visualizer" style={{ fontSize: 12, color: C.accent, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>See it on your home →</UtmLink>
            </div>
          </div>
        </section>

        {/* ── WHY WE CHOSE BRAVA ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead
              eyebrow="Our Manufacturer"
              title="Why We Chose Brava"
              sub="We vet every manufacturer we install. Here's specifically what earned Brava a place in our lineup, not just a name on a brochure."
              center
            />
            <div className="grid-2" style={{ gap: 3 }}>
              {[
                {
                  label: 'Wind Performance',
                  val: "Brava tiles are tested and approved to withstand wind speeds of up to 188 mph with nail installation and up to 211 mph with high-wind screw installation. Ratings depend on the installation method.",
                },
                {
                  label: 'Fire Performance',
                  val: "A Class A fire rating is available with Brava when installed as a complete Brava roof system. Fire ratings depend on the roof assembly and installation.",
                },
                {
                  label: 'Authentic Texture, Three Profiles',
                  val: "Brava gives homeowners the look of natural slate, shake, or tile, with natural variation so no two tiles look alike, in a lightweight composite. Choose Brava Slate for a crisp, dimensional look, Brava Cedar Shake for a hand-split wood look, or Brava Spanish Barrel Tile, which brings the traditional clay tile look to Spanish, Mediterranean, and Tuscan style homes.",
                },
                {
                  label: 'Built Tough for North Texas',
                  val: "Every Brava tile is compression molded, which Brava says makes the tiles stronger and more detailed. Tiles are up to 1 inch thick, carry a Class 4 impact rating, the highest available, and the color runs through the full thickness of each tile.",
                },
              ].map(item => (
                <div key={item.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)', height: '100%' }}>
                  <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, marginBottom: 10, fontWeight: 600 }}>{item.label}</div>
                  <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.75, margin: 0 }}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SYNTHETIC SLATE VS. METAL ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead
              eyebrow="An Honest Comparison"
              title="Brava Synthetic Slate vs. Metal Roofing"
              sub="We install both. Here's how we actually think about which one fits a given home, not a sales pitch for either."
              center
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Metal If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  You want a 50–70 year lifespan (standing seam), strong insurance discounts, and a clean, modern architectural line. Metal is a high-durability, high-savings choice over a 20–30 year horizon.
                </p>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontSize: 13, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Choose Brava Synthetic Slate If</div>
                <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.85, margin: 0 }}>
                  Your home's architecture or your HOA's design guidelines call for a traditional, dimensional slate profile specifically, and you want that look without real slate's weight, fragility, or maintenance. Brava synthetic slate is still a genuine upgrade over asphalt, just a different tradeoff than metal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <PricingTable
              title="Brava Synthetic Slate & Metal Roofing Costs in DFW"
              intro="Brava synthetic slate is a premium option, priced above standard standing seam and exposed-fastener metal, but well below real slate or copper. Installed cost by material, based on current DFW-wide market rates."
            />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="sp" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div className="inner" style={{ maxWidth: 820 }}>
            <SHead eyebrow="FAQ" title="Brava Synthetic Slate Roofing Questions" center />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {FAQS.map(f => (
                <div key={f.q} style={{ padding: '24px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 10 }}>{f.q}</div>
                  <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, margin: '28px 0 0', textAlign: 'center' }}>
              Comparing Brava and DaVinci?{' '}
              <Link href="/brava-vs-davinci-roofing" style={{ color: C.accent, textDecoration: 'underline' }}>See the side-by-side.</Link>
            </p>
          </div>
        </section>

        {/* ── SERVICE AREAS ── */}
        <section id="service-areas" className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
          <div className="inner">
            <SHead eyebrow="Service Areas" title="Brava Synthetic Slate Roofing Across DFW" sub="We install Brava synthetic slate roofing throughout the Dallas–Fort Worth Metroplex. Find your city below." center />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}>
              {CITIES.map(([name, slug]) => (
                <Link key={slug} href={`/metal-roofing-${slug}-tx`} className="slate-city-pill"
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
              Not Sure If Brava Synthetic Slate<br/><span style={{ fontStyle: 'italic', color: C.accent }}>Or Metal Is Right For You?</span>
            </h2>
            <p style={{ fontSize: 16, color: C.mutedLight, lineHeight: 1.8, marginBottom: 40 }}>
              A quick call with our team is the fastest way to find out. We'll talk through your home, your HOA's guidelines if you have one, and give you an honest read on which material actually fits, no pressure, no obligation.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="cta-btn slate-cta-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', color: C.black, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Get a Free Consultation →</a>
              <UtmLink href="/#products" className="cta-btn slate-cta-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: 'transparent', color: C.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', textDecoration: 'none' }}
              >Explore Our Metal Roofing Systems</UtmLink>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}
