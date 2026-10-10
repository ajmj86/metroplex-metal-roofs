import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const ARGYLE_DATA: CityData = {
  name: 'Argyle',
  state: 'TX',
  county: 'Denton',
  region: 'North Fort Worth',
  zip: '76226',
  slug: 'argyle',
  metaTitle: 'Metal & Brava Synthetic Slate Roofing Argyle TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Argyle, TX. Serving Harvest and Canyon Falls.',
  heroHeadline: "Argyle Estate Homes\nDeserve More Than Asphalt",
  heroSub: "Argyle is one of the most sought-after communities in Denton County for a reason. The properties here deserve a roof that lasts as long as the investment.",
  localContext: "Argyle's rural character and Denton County location combine to create significant annual storm exposure with very few nearby services for rapid response. With estate home values regularly above $700,000 and 2% wind/hail deductibles standard on high-value policies, the financial case for metal is particularly strong in Argyle. Metal roofing eliminates the replacement cycle and qualifies for meaningful insurance savings. For Argyle homeowners drawn to a traditional slate or shake profile, Brava offers that look in a durable synthetic, so you can choose between metal and Brava on the merits of your own home.",
  hoaNote: "Argyle's estate communities maintain architectural standards for exterior materials. Standing seam and stone-coated steel in approved profiles are widely permitted and increasingly common on estate-level properties throughout the area. We provide complete HOA documentation support at no additional cost.",
  localStat: { val: '$720k', label: 'Median Home Value', source: 'Argyle, TX 2025' },
  neighborhoods: [
    'Harvest', 'Canyon Falls', 'Hilton Farms', 'Northwood Hills',
    'Vintage Oaks', 'Pecan Square', 'The Preserve', 'Bridlewood',
    'Argyle Proper', 'Lantana', 'Rock Hill', 'Whispering Oaks',
  ],
  nearbyCities: [
    { name: 'Flower Mound', slug: 'flower-mound' },
    { name: 'Highland Village', slug: 'highland-village' },
    { name: 'Northlake', slug: 'northlake' },
    { name: 'Roanoke', slug: 'roanoke' },
  ],
  review: {
    name: 'Todd W.',
    neighborhood: '',
    text: "We have a larger house on a decent piece of land and replacing the roof is always a serious project. The satellite estimate was more accurate than any in-person quote I had gotten before. Standing seam install was done in three days and the crew was great.",
    rating: 5,
  },
  faqs: [
    {
      q: 'What warranty comes with a metal roof in Argyle, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Argyle homeowners will never need to use.',
    },
    { q: 'How much does a metal roof cost in Argyle, TX?', a: `Metal roofing in Argyle is priced by the square foot, and your total depends on roof size, pitch, and material. Estate homes with larger footprints and more complex rooflines often carry a higher overall cost. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.` },
    { q: 'What metal and Brava roofing options are best for Argyle estate homes?', a: 'Standing seam is the most popular choice for Argyle estate properties due to its clean architectural lines and hidden fastener system. Copper is available for homeowners seeking the highest-tier permanent finish. Both carry the highest available impact resistance ratings. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.' },
    { q: 'Does a metal roof qualify for an insurance discount in Argyle?', a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. For Argyle homeowners with high-value policies, the combination of reduced annual premiums and eliminated deductible exposure over 20 to 30 years typically represents a strong financial return.' },
    { q: 'Will my Argyle HOA approve a metal roof?', a: 'Most Argyle estate communities permit standing seam and stone-coated steel in approved profiles and color palettes. We provide complete documentation packages for your HOA or architectural review committee at no additional cost.' },
    { q: 'How long does metal roof installation take in Argyle?', a: 'Most Argyle residential installations are completed in one to four days depending on roof size and complexity. Larger estate homes may take longer. We provide a specific timeline for your property during the estimate process.' },
    { q: 'How does metal roofing handle Denton County storms in a rural area?', a: 'Standing seam and stone-coated steel carry a Class 4 impact resistance rating, the highest available. In rural communities like Argyle where storm response services are farther away, having a roof that does not need emergency repair after every hail event is particularly valuable.' },
  ],
}
