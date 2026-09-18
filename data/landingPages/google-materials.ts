import type { LandingPageData } from '@/lib/landingPageTypes'

export const GOOGLE_MATERIALS_DATA: LandingPageData = {
  slug: 'google-materials',
  channel: 'google_materials',
  meta: {
    title: 'Standing Seam Metal vs. Synthetic Slate Roofing | Metroplex Metal Roofs',
    description: 'Compare standing seam metal and Brava synthetic slate roofing side by side — then see both on your actual home with our free visualizer.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Synthetic Slate · Dallas–Fort Worth',
    headline: 'Standing Seam Metal, or',
    headlineAccent: 'Synthetic Slate?',
    subhead: 'Two premium roofing materials, two different looks — see them both rendered on your actual home before deciding, and get a real price range for either.',
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
  ctaLabel: 'Compare on My Home',
  ctaHref: '/visualizer',
  pricingIntro: 'Price ranges for both materials, side by side',
  showPricingTable: true,
}
