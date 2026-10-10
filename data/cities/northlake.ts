import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const NORTHLAKE_DATA: CityData = {
  name: 'Northlake',
  state: 'TX',
  county: 'Denton',
  region: 'North Fort Worth',
  zip: '76247',
  slug: 'northlake',
  metaTitle: 'Metal & Brava Slate Roofing Northlake TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Northlake, TX. Serving Canyon Falls and Pecan Square.',
  heroHeadline: "Northlake Is Building Fast.\nBuild Your Roof Right",
  heroSub: "Northlake is one of the fastest-growing communities in Denton County. The homes going up today are setting a permanent standard. Metal roofing is part of that.",
  localContext: "Northlake has emerged as one of North Texas's most rapidly growing communities, with premium master-planned developments setting new construction standards throughout the city. Located in Denton County's active storm corridor, Northlake homeowners face significant annual hail exposure. Metal roofing is increasingly specified on new builds and makes strong financial sense for any existing homeowner ready to stop replacing asphalt. Homeowners who want the look of natural slate, shake, or tile have an equally strong option in Brava synthetic slate, which we install alongside standing seam and stone-coated steel for homes in communities like Canyon Falls and Pecan Square.",
  hoaNote: "Northlake's master-planned communities have established architectural review processes. Metal roofing in approved profiles and color palettes is widely permitted throughout the city's newer developments. We provide complete HOA documentation support at no additional cost.",
  localStat: { val: '$520k', label: 'Median Home Value', source: 'Northlake, TX 2025' },
  neighborhoods: [
    'Canyon Falls', 'Pecan Square', 'Harvest', 'Wildflower Ranch',
    'Sixteen Ranch', 'Silver Sage', 'Heritage Ranch', 'Entrada',
    'Mesa Verde', 'Thornbury', 'Lilyana', 'Frisco Ranch',
  ],
  nearbyCities: [
    { name: 'Argyle', slug: 'argyle' },
    { name: 'Flower Mound', slug: 'flower-mound' },
    { name: 'Trophy Club', slug: 'trophy-club' },
    { name: 'Roanoke', slug: 'roanoke' },
  ],
  faqs: [
    {
      q: 'What warranty comes with a metal roof in Northlake, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Northlake homeowners will never need to use.',
    },
    { q: 'How much does a metal roof cost in Northlake, TX?', a: `Metal roofing in Northlake is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.` },
    { q: 'Is metal roofing common on new construction in Northlake?', a: 'Yes. Metal roofing is increasingly specified on new construction throughout Northlake\'s master-planned communities. Builders in the area are incorporating standing seam and stone-coated steel as standard or upgraded options given the area\'s storm exposure and long-term cost advantages.' },
    { q: 'Does a metal roof qualify for an insurance discount in Northlake?', a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Northlake homeowners in Denton County\'s active storm corridor typically see meaningful annual premium reductions after upgrading.' },
    { q: 'Will my Northlake HOA approve a metal roof?', a: 'Most Northlake master-planned communities permit metal roofing in approved profiles and neutral color palettes. We provide complete HOA documentation support at no additional cost.' },
    { q: 'How long does metal roof installation take in Northlake?', a: 'Most Northlake residential installations are completed in one to three days depending on roof size and material. We provide a specific timeline during the estimate process.' },
    { q: 'What metal and Brava roofing styles work best in Northlake?', a: 'Standing seam and stone-coated steel are both popular in Northlake\'s newer developments. Stone-coated steel in shingle and shake profiles suits traditional new construction throughout the area. Standing seam is preferred for more contemporary architecture. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.' },
  ],
}
