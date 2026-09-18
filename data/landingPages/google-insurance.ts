import type { LandingPageData } from '@/lib/landingPageTypes'

export const GOOGLE_INSURANCE_DATA: LandingPageData = {
  slug: 'google-insurance',
  channel: 'google_insurance',
  meta: {
    title: 'Class 4 Impact-Rated Roofing — Up to 35% Insurance Discount | Metroplex Metal Roofs',
    description: 'Metal and synthetic slate roofing with Class 4 impact rating can qualify DFW homeowners for a meaningful homeowners insurance discount. See your options free.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Synthetic Slate · Dallas–Fort Worth',
    headline: 'A Roof That Can Lower',
    headlineAccent: 'Your Insurance Bill',
    subhead: 'Class 4 impact-rated metal and synthetic slate roofing can qualify DFW homeowners for up to a 35% insurance discount* — see your home in the visualizer and get a real price range first.',
    microcopy: 'See your home in metal and get a free price range — no photo upload, no obligation.',
    backgroundImageSrc: '/MMR Hero Pic.png',
    // Same trustBullets/trustBulletFootnote mechanism postcard uses for the
    // 35% figure's disclaimer (Hero.tsx only renders the footnote when
    // trustBullets is non-empty) -- required verbatim sentence below.
    trustBullets: ['Up to 35% Insurance Discount*', '50-Year Lifespan', 'Class 4 Impact Rated'],
    trustBulletFootnote: '*Actual discount varies by carrier and policy.',
  },
  trustStats: [
    { val: 50, suffix: '+ yrs', label: 'Roof Lifespan' },
    { val: 35, suffix: '%', label: 'Insurance Savings' },
    { val: 4, label: 'Highest Class Impact Rating' },
  ],
  ctaLabel: 'See If I Qualify',
  ctaHref: '/visualizer',
  pricingIntro: "Here's what the upgrade typically costs, insurance savings aside",
  showPricingTable: true,
}
