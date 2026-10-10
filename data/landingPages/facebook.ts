import type { LandingPageData } from '@/lib/landingPageTypes'
import { HERO_FOOTNOTE } from '@/lib/landingPageFootnotes'

export const FACEBOOK_DATA: LandingPageData = {
  slug: 'facebook',
  channel: 'facebook',
  meta: {
    title: 'See Your Roof Before You Buy It | Metroplex Metal Roofs',
    description: 'Free visualizer. See your own home in metal or Brava synthetic slate roofing, then get a real price range in under 60 seconds.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Brava Synthetic Slate · Dallas–Fort Worth',
    headline: 'See Your Roof',
    headlineAccent: 'Before You Buy It',
    subhead: 'A free tool that renders YOUR actual home in metal and Brava synthetic slate roofing. Pick a material, pick a color, get a real price range in under 60 seconds.',
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
