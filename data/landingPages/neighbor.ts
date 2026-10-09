import type { LandingPageData } from '@/lib/landingPageTypes'

// Addressed-mail (Campaign 2) "your neighbor just got Brava" page. The {street}
// and {town} tokens are filled client-side by LandingPageHero.tsx from the
// ?street= / ?town= params the /n/[code] redirect attaches; with no params they
// fall back to "your street" / "your neighborhood", so no raw token or the word
// "undefined" can ever render.
export const NEIGHBOR_DATA: LandingPageData = {
  slug: 'neighbor',
  channel: 'neighbor',
  meta: {
    title: 'Your Neighbor Chose Brava Slate | Metroplex Metal Roofs',
    description:
      'A Brava synthetic slate roof was just installed near you. See it on your home, with a real price range, in under 60 seconds.',
  },
  hero: {
    eyebrowText: 'Mailed to homes near {street} · {town}',
    headline: 'Your neighbor chose Brava slate.',
    headlineAccent: 'See it on your home.',
    subhead:
      'A Brava synthetic slate roof was just installed on {street}. Enter your address to see the same roof on your house, with a real price range, in under 60 seconds.',
    backgroundImageSrc: '/products/synthetic_slate/slate/washington.jpg',
    trustBullets: ['50-Year Lifespan', 'Class 4 Impact Rated', 'Insurance Discount Eligible'],
    trustBulletFootnote:
      'Insurance discounts vary by home, roof system, and carrier — confirm eligibility with your insurance provider.',
  },
  trustStats: [
    { val: 50, suffix: '+ yrs', label: 'Roof Lifespan' },
    { val: 35, suffix: '%', label: 'Insurance Savings' },
    { val: 4, label: 'Highest Class Impact Rating' },
  ],
  ctaLabel: 'Free Visualizer + Estimate',
  // /visualizer pre-selects from ?roofType=&style= (Brava slate is the only product under that style).
  ctaHref: '/visualizer?roofType=synthetic_slate&style=slate',
  pricingIntro: 'What a Brava roof typically runs on homes like yours.',
  showPricingTable: true,
}
