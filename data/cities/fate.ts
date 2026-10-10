import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const FATE_DATA: CityData = {
  name: 'Fate',
  state: 'TX',
  county: 'Rockwall',
  region: 'East Dallas',
  zip: '75087',
  slug: 'fate',
  metaTitle: 'Metal & Brava Synthetic Slate Roofing Fate TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Fate, TX. Serving Woodcreek and Williamsburg.',
  heroHeadline: "Fate Is One of Texas's\nFastest-Growing Cities",
  heroSub: "New homes are going up across Fate every week. Build your roof to last longer than the shingles the builder put on.",
  localContext: "Fate has become one of the most rapidly expanding communities in Rockwall County, with new construction setting strong quality standards throughout the city. Located in an active storm corridor east of Dallas, Fate homeowners face consistent annual hail exposure. Metal roofing is increasingly specified on new builds and represents a strong permanent upgrade for any existing homeowner ready to end the replacement cycle. Homeowners who want the look of natural slate, shake, or tile have an equally strong option in Brava synthetic slate, which we install alongside standing seam and stone-coated steel for homes in communities like Woodcreek and Williamsburg.",
  hoaNote: "Fate's growing master-planned communities have established architectural review processes. Metal roofing in approved profiles and colors is widely permitted. We provide complete HOA documentation support at no additional cost.",
  localStat: { val: '$360k', label: 'Median Home Value', source: 'Fate, TX 2025' },
  neighborhoods: [
    'Woodcreek', 'Williamsburg', 'Chamberlain Crossing', 'Falcon Creek',
    'Edgewater', 'Summerfield', 'Lakeview', 'Brockdale',
    'Cinco Ranch', 'Rolling Hills', 'Prairie Ranch', 'Heartland',
  ],
  nearbyCities: [
    { name: 'Rockwall', slug: 'rockwall' },
    { name: 'Royse City', slug: 'royse-city' },
    { name: 'Forney', slug: 'forney' },
  ],
  faqs: [
    {
      q: 'What warranty comes with a metal roof in Fate, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Fate homeowners will never need to use.',
    },
    { q: 'How much does a metal roof cost in Fate, TX?', a: `Metal roofing in Fate is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.` },
    { q: 'Is metal roofing a good choice for new construction in Fate?', a: 'Yes. Metal roofing is increasingly common on new construction throughout Fate and the surrounding Rockwall County area. Many homeowners in newer developments are upgrading from builder-grade shingles to standing seam or stone-coated steel after the first hail season.' },
    { q: 'Does a metal roof qualify for an insurance discount in Rockwall County?', a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Fate homeowners in Rockwall County\'s active storm corridor typically see meaningful annual premium reductions after upgrading.' },
    { q: 'Will my Fate HOA approve a metal roof?', a: 'Most Fate communities permit metal roofing in approved profiles and neutral color palettes. We provide complete HOA documentation support at no additional cost.' },
    { q: 'How long does metal roof installation take in Fate?', a: 'Most Fate residential installations are completed in one to three days. We provide a specific timeline for your home during the estimate process.' },
    { q: 'What metal and Brava roofing styles work best in Fate?', a: 'Stone-coated steel in shingle and shake profiles is popular throughout Fate\'s newer traditional developments. Standing seam is preferred for more contemporary homes. Both carry Class 4 hail ratings and 50-plus year lifespans. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.' },
  ],
}
