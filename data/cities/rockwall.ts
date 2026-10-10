import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const ROCKWALL_DATA: CityData = {
  name: 'Rockwall',
  state: 'TX',
  county: 'Rockwall',
  region: 'East Dallas',
  zip: '75087',
  slug: 'rockwall',
  metaTitle: 'Metal & Brava Slate Roofing Rockwall TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Rockwall, TX. Serving Lake Ray Hubbard Estates and Chandler Creek.',
  heroHeadline: "Rockwall Lakefront Homes\nDeserve a Permanent Roof",
  heroSub: "Rockwall homeowners on Lake Ray Hubbard face some of the most demanding weather in East Texas. Metal roofing is the only option built to handle it long term.",
  localContext: "Rockwall County's position along Lake Ray Hubbard places it in an active storm corridor where significant hail events are a reliable annual occurrence. With median home values near $450,000 and 2% wind/hail deductibles standard, Rockwall homeowners on asphalt face recurring out-of-pocket exposure that compounds over time. Metal roofing eliminates that cycle entirely. Homeowners who want the look of natural slate, shake, or tile have an equally strong option in Brava synthetic slate, which we install alongside standing seam and stone-coated steel for homes in communities like Lake Ray Hubbard Estates and Chandler Creek.",
  hoaNote: "Rockwall's lakefront and master-planned communities have established HOA review processes. Standing seam and stone-coated steel in approved profiles and color palettes are commonly permitted. We provide full HOA documentation support at no additional cost.",
  localStat: { val: '$450k', label: 'Median Home Value', source: 'Rockwall, TX 2025' },
  neighborhoods: [
    'Lake Ray Hubbard Estates', 'Chandler Creek', 'Quail Creek', 'Summerfield',
    'Lakeside Estates', 'Lakeview', 'Stone Creek', 'The Shores',
    'Meadowbrook', 'Sunset Bay', 'Heath Golf and Yacht Club', 'Buffalo Creek',
  ],
  nearbyCities: [
    { name: 'Forney', slug: 'forney' },
    { name: 'Fate', slug: 'fate' },
    { name: 'Royse City', slug: 'royse-city' },
  ],
  review: {
    name: 'Kevin L.',
    neighborhood: '',
    text: "Living near the lake means we get hit hard every storm season. After the fourth hail claim we were done with asphalt. The whole process was easy. Satellite estimate, render of the house, install in two days. The standing seam has been through two storms since then without a scratch.",
    rating: 5,
  },
  faqs: [
    {
      q: 'What warranty comes with a metal roof in Rockwall, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract — plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Rockwall homeowners will never need to use.',
    },
    { q: 'How much does a metal roof cost in Rockwall, TX?', a: `Metal roofing in Rockwall is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size — not a guess from the driveway — refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()} — see our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.` },
    { q: 'How does metal roofing handle the storms near Lake Ray Hubbard?', a: 'Standing seam and stone-coated steel carry a Class 4 impact resistance rating, the highest available. Rockwall County\'s position along Lake Ray Hubbard creates consistent annual storm exposure and Class 4 rated roofing provides strong protection while qualifying for maximum carrier discounts.' },
    { q: 'Does a metal roof qualify for an insurance discount in Rockwall County?', a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Rockwall homeowners typically see meaningful annual premium reductions after upgrading, along with eliminated deductible exposure on future hail claims.' },
    { q: 'Will my Rockwall HOA approve a metal roof?', a: 'Most Rockwall HOAs permit standing seam and stone-coated steel in approved profiles and neutral color palettes. We provide complete HOA documentation support at no additional cost.' },
    { q: 'How long does metal roof installation take in Rockwall?', a: 'Most Rockwall residential installations are completed in one to three days depending on roof size and material. We provide a specific timeline for your home during the estimate process.' },
    { q: 'What metal and Brava roofing styles are popular in Rockwall?', a: 'Standing seam is the most popular choice for Rockwall\'s lakefront and contemporary properties. Stone-coated steel is widely chosen in established neighborhoods with traditional architectural character. Both carry Class 4 hail ratings and 50-plus year lifespans. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.' },
  ],
}
