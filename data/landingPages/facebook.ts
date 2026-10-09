import type { LandingPageData } from '@/lib/landingPageTypes'
import { HERO_FOOTNOTE } from '@/lib/landingPageFootnotes'

export const FACEBOOK_DATA: LandingPageData = {
  slug: 'facebook',
  channel: 'facebook',
  meta: {
    title: 'See Your Roof Before You Buy It | Metroplex Metal Roofs',
    description: 'Free visualizer — see your own home in metal or synthetic slate roofing, then get a real price range in under 60 seconds.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Synthetic Slate · Dallas–Fort Worth',
    headline: 'See Your Roof',
    headlineAccent: 'Before You Buy It',
    subhead: 'The only tool in DFW that renders YOUR actual home in metal and synthetic slate roofing — pick a material, pick a color, get a real price range in under 60 seconds.',
    microcopy: 'See your home in metal and get a free price range — no photo upload, no obligation.',
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
