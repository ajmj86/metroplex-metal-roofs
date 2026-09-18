import type { LandingPageData } from '@/lib/landingPageTypes'

export const GOOGLE_COST_DATA: LandingPageData = {
  slug: 'google-cost',
  channel: 'google_cost',
  meta: {
    title: 'Metal Roof Cost in DFW — Real Price Range in 60 Seconds | Metroplex Metal Roofs',
    description: 'See a real price range for metal or synthetic slate roofing on your actual home — free visualizer, no obligation, under 60 seconds.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Synthetic Slate · Dallas–Fort Worth',
    headline: 'What Does a Metal Roof',
    headlineAccent: 'Actually Cost?',
    subhead: 'Skip the vague estimate ranges — see your own home in metal or synthetic slate roofing and get a real price range built for your exact house, free, in under 60 seconds.',
    microcopy: 'See your home in metal and get a free price range — no photo upload, no obligation.',
    backgroundImageSrc: '/MMR Hero Pic.png',
    trustBullets: ['50-Year Lifespan', 'Up to 35% Insurance Discount*', 'Class 4 Impact Rated'],
    trustBulletFootnote: '*Discount varies by home, roof system, and carrier — confirm eligibility with your insurance provider.',
  },
  trustStats: [
    { val: 50, suffix: '+ yrs', label: 'Roof Lifespan' },
    { val: 35, suffix: '%', label: 'Insurance Savings' },
    { val: 4, label: 'Highest Class Impact Rating' },
  ],
  ctaLabel: 'See My Price Range',
  ctaHref: '/visualizer',
  pricingIntro: 'Real price ranges for DFW homes like yours',
  showPricingTable: true,
}
