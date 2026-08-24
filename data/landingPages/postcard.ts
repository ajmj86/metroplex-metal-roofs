import type { LandingPageData } from '@/lib/landingPageTypes'

// Lifespan and insurance-savings values match Homepage.jsx's own `stats`
// array exactly (StatItem-shaped, same numbers sitewide). Class 4 impact
// rating isn't in that array in {val,suffix,label} form -- it's stated
// sitewide only as trust-bullet text ("Class 4 Hail Rating" on the material
// pages, "Class 4 impact-rated" on CityPage.tsx) -- so it's reshaped into
// the same numeric StatItem shape here (val: 4, the real UL 2218 rating
// class, not an invented number) rather than adding a 4th, differently-typed
// section just for one stat.
export const POSTCARD_DATA: LandingPageData = {
  slug: 'postcard',
  channel: 'postcard',
  meta: {
    title: "Your Free Roof Preview | Metroplex Metal Roofs",
    description: "See your actual home in the metal roofing or Brava synthetic slate style, with a real price range in under 2 minutes.",
  },
  hero: {
    // Default eyebrow (no urgency-banner framing without a real mechanism
    // behind it). Swapped for "Mailed to homes in {area} · Dallas–Fort
    // Worth" by LandingPageHero.tsx when the URL carries ?area=, per-route
    // at QR-generation time.
    eyebrowText: 'Your Home, in Metal or Synthetic Slate · Dallas–Fort Worth',
    headline: 'The Last Roof',
    headlineAccent: "You'll Ever Need",
    // Kept to one short sentence, matching the homepage's own hero subhead --
    // the value props (lifespan/insurance/hail rating) live in trustBullets
    // below instead of being packed into this sentence.
    subhead: "For DFW homeowners ready to stop replacing asphalt roofs every decade — see it on your home and get a real price range in under 60 seconds.",
    // Same line Homepage.jsx's hero uses under its own CTA -- genuinely
    // applicable here too (same /visualizer destination, same claim), not
    // new copy invented for this page.
    microcopy: 'See your home in metal and get a free price range — no photo upload, no obligation.',
    backgroundImageSrc: '/MMR Hero Pic.png',
    // Same bullet-row/footnote pattern as Homepage.jsx's hero trust-bar,
    // rendered via the shared HeroTrustBullets component.
    trustBullets: ['50-Year Lifespan', 'Up to 35% Insurance Discount*', 'Class 4 Impact Rated'],
    trustBulletFootnote: '*Discount varies by home, roof system, and carrier — confirm eligibility with your insurance provider.',
  },
  trustStats: [
    { val: 50, suffix: '+ yrs', label: 'Roof Lifespan' },
    { val: 35, suffix: '%', label: 'Insurance Savings' },
    { val: 4, label: 'Highest Class Impact Rating' },
  ],
  ctaLabel: 'Free Visualizer + Estimate',
  ctaHref: '/visualizer',
  pricingIntro: "Here's what neighbors on your route are typically seeing",
  showPricingTable: true,
}
