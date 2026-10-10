import type { LandingPageData } from '@/lib/landingPageTypes'
import { HERO_FOOTNOTE } from '@/lib/landingPageFootnotes'

export const GOOGLE_MATERIALS_DATA: LandingPageData = {
  slug: 'google-materials',
  channel: 'google_materials',
  meta: {
    title: 'Metal vs. Brava Synthetic Slate Roofing | Metroplex',
    description: 'Compare standing seam metal and Brava synthetic slate roofing side by side, then see both on your actual home with our free visualizer.',
  },
  hero: {
    eyebrowText: 'Your Home, in Metal or Brava Synthetic Slate · Dallas–Fort Worth',
    headline: 'Standing Seam Metal, or',
    headlineAccent: 'Brava Synthetic Slate?',
    subhead: 'Two premium roofing materials, two different looks. See them both rendered on your actual home before deciding, and get a real price range for either.',
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
  ctaLabel: 'Compare on My Home',
  ctaHref: '/visualizer',
  pricingIntro: 'Price ranges for both materials, side by side',
  showPricingTable: true,
}
