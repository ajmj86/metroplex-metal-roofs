import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const MESQUITE_DATA: CityData = {
  name: 'Mesquite',
  state: 'TX',
  county: 'Dallas',
  region: 'East Dallas',
  zip: '75150',
  slug: 'mesquite',
  metaTitle: 'Metal & Brava Slate Roofing Mesquite TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Mesquite, TX. Serving Town East Estates and Solterra.',

  heroHeadline: "Mesquite Homes Have Weathered\nEnough Hail Seasons on Asphalt",
  heroSub: "From Town East Estates to the newer builds in Solterra, Mesquite homeowners are switching to a roof that outlasts the storm cycle instead of getting replaced by it.",

  localContext: "Mesquite's established East Dallas neighborhoods carry some of the area's oldest roofing stock, much of it already replaced once with asphalt after prior hail seasons. Dallas County's hail corridor runs directly through Mesquite, and with newer master-planned communities like Solterra bringing a wave of new construction to the city, metal roofing is increasingly the default choice for homeowners who don't want to repeat a reroof cycle every 12 to 15 years. Metal is not the only lasting choice here. Brava synthetic slate, shake, and Spanish barrel tile give Mesquite homes a premium, natural-material look, and we help you compare Brava and metal side by side before you decide.",

  hoaNote: "Solterra maintains an active HOA with standard architectural review for exterior changes, and metal roofing in approved profiles is already common in the community. Older neighborhoods like Town East Estates and Casa View Heights typically have no HOA restrictions. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.",

  localStat: {
    val: '$255k',
    label: 'Median Home Value',
    source: 'Mesquite, TX 2025',
  },

  neighborhoods: [
    "Town East Estates",
    'Casa View Heights',
    'Highland Hills',
    "Falcon's Lair",
    'Solterra',
    'Downtown Mesquite',
  ],

  nearbyCities: [
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Garland', slug: 'garland' },
    { name: 'Forney', slug: 'forney' },
  ],

  review: {
    name: 'Tammy R.',
    neighborhood: 'Town East Estates',
    text: "We'd been putting off the reroof for years knowing we'd just be back here again in a decade. Went with stone-coated steel this time and the difference in how the house looks is honestly bigger than we expected. Crew was done in two days.",
    rating: 5,
  },

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Mesquite, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Mesquite homeowners will never need to use.',
    },
    {
      q: 'How much does a metal roof cost in Mesquite?',
      a: `Metal roofing in Mesquite is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.`,
    },
    {
      q: 'Is metal roofing common in newer Mesquite developments like Solterra?',
      a: 'Yes. Solterra\'s architectural guidelines already permit metal roofing in approved profiles, and it\'s an increasingly common choice for homeowners building or reroofing in the community given the same hail exposure as the rest of Mesquite.',
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Mesquite?',
      a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Mesquite sits in Dallas County\'s active hail corridor, and homeowners who upgrade typically see a meaningful reduction in their wind/hail premium.',
    },
    {
      q: 'Will my Mesquite HOA approve a metal roof?',
      a: 'Communities with an active architectural review process, like Solterra, generally approve metal roofing in pre-approved profiles and colors. Many older Mesquite neighborhoods have no HOA at all. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.',
    },
    {
      q: 'How long does metal roof installation take in Mesquite?',
      a: 'Most residential installations in Mesquite are completed in one to three days. The exact timeline depends on roof size and material selection. We provide a specific estimate timeline for your home before any work begins.',
    },
    {
      q: 'What metal and Brava roofing style works best for Mesquite homes?',
      a: 'Stone-coated steel is a strong match for the traditional ranch homes common in Town East Estates and Casa View Heights, while standing seam suits the more contemporary builds going up in Solterra. Both carry Class 4 hail ratings and 50-plus year lifespans. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.',
    },
  ],
}
