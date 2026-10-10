import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const HIGHLAND_VILLAGE_DATA: CityData = {
  name: 'Highland Village',
  state: 'TX',
  county: 'Denton',
  region: 'North Dallas',
  zip: '75077',
  slug: 'highland-village',
  metaTitle: 'Metal & Brava Slate Roofing Highland Village TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel, and Brava synthetic slate roofing in Highland Village, TX. Serving Lake Lewisville area neighborhoods.',
  heroHeadline: "Highland Village Homeowners\nAre Making the Switch to Metal",
  heroSub: "Highland Village sits along Lake Lewisville in one of Denton County's most established communities. A metal roof is the permanent upgrade that matches the quality of the homes here.",
  localContext: "Highland Village's lakeside position in Denton County places it in an active storm corridor with consistent annual hail exposure. With median home values approaching $500,000 and 2% wind/hail deductibles standard on most policies, Highland Village homeowners face recurring out-of-pocket exposure on asphalt. Metal roofing eliminates that cycle entirely. Homeowners who want the look of natural slate, shake, or tile have an equally strong option in Brava synthetic slate, which we install alongside standing seam and stone-coated steel for homes in communities like The Peninsula and Lakeside.",
  hoaNote: "Highland Village maintains well-established community standards. Standing seam and stone-coated steel in approved profiles and color palettes are widely permitted. We provide complete HOA documentation support at no additional cost.",
  localStat: { val: '$490k', label: 'Median Home Value', source: 'Highland Village, TX 2025' },
  neighborhoods: [
    'The Peninsula', 'Lakeside', 'Highland Shores', 'Remington Park',
    'Stone Hill', 'Tuscan Villa', 'Canyon Falls', 'Heritage Park',
    'The Bluffs', 'Twin Coves', 'Oak Hollow', 'Falcon Creek',
  ],
  nearbyCities: [
    { name: 'Flower Mound', slug: 'flower-mound' },
    { name: 'Lewisville', slug: 'lewisville' },
    { name: 'Coppell', slug: 'coppell' },
    { name: 'Argyle', slug: 'argyle' },
  ],
  faqs: [
    {
      q: 'What warranty comes with a metal roof in Highland Village, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Highland Village homeowners will never need to use.',
    },
    { q: 'How much does a metal roof cost in Highland Village, TX?', a: `Metal roofing in Highland Village is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.` },
    { q: 'Does a metal roof qualify for an insurance discount in Highland Village?', a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Highland Village homeowners in Denton County\'s active storm corridor typically see meaningful annual premium reductions after upgrading.' },
    { q: 'Will my Highland Village HOA approve a metal roof?', a: 'Most Highland Village communities permit standing seam and stone-coated steel in approved profiles and neutral color palettes. We provide complete HOA documentation support at no additional cost.' },
    { q: 'How long does metal roof installation take in Highland Village?', a: 'Most Highland Village residential installations are completed in one to three days. We provide a specific timeline for your home during the estimate process.' },
    { q: 'How does metal roofing handle storms near Lake Lewisville?', a: 'Standing seam and stone-coated steel carry a Class 4 impact resistance rating, the highest available. Highland Village\'s lakeside position in Denton County creates consistent storm exposure and Class 4 rated roofing provides strong protection while qualifying for maximum carrier discounts.' },
    { q: 'What metal and Brava roofing styles work best in Highland Village?', a: 'Standing seam and stone-coated steel are both popular in Highland Village. Standing seam suits the area\'s mix of contemporary and transitional lake-area homes. Stone-coated steel is widely chosen for traditional architecture throughout the community. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.' },
  ],
}
