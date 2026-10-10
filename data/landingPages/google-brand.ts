import type { LandingPageData } from '@/lib/landingPageTypes'
import { HERO_FOOTNOTE } from '@/lib/landingPageFootnotes'

export const GOOGLE_BRAND_DATA: LandingPageData = {
  slug: 'google-brand',
  channel: 'google_brand',
  meta: {
    title: 'Metroplex Metal Roofs: Free Roof Visualizer',
    description: 'See your own home in metal or Brava synthetic slate roofing, then get a real price range in under 60 seconds.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Brava Synthetic Slate · Dallas–Fort Worth',
    headline: 'See Your Roof',
    headlineAccent: 'Before You Buy It',
    subhead: 'Try the free visualizer. Pick a material, pick a color, see your actual home, and get a real price range in under 60 seconds.',
    microcopy: 'See your home in metal and get a free price range, no photo upload, no obligation.',
    backgroundImageSrc: '/MMR Hero Pic.png',
    trustBullets: ['50-Year Lifespan', 'Insurance Discount Eligible*', 'Class 4 Impact Rated'],
    trustBulletFootnote: HERO_FOOTNOTE,
  },
  trustStats: [
    { val: 50, suffix: '+ yrs', label: 'Roof Lifespan' },
    { val: 35, suffix: '%', display: '15–35%', label: 'Insurance Premium Savings*' },
    { val: 25, suffix: '%', display: '10–25%', label: 'Energy Cost Reduction*' },
    { val: 4, label: 'Highest Class Impact Rating' },
  ],
  ctaLabel: 'Try the Free Visualizer',
  ctaHref: '/visualizer',
  pricingIntro: "Here's a real price range for homes like yours",
  showPricingTable: true,
}
