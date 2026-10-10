import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const GRAND_PRAIRIE_DATA: CityData = {
  name: 'Grand Prairie',
  state: 'TX',
  county: 'Dallas',
  region: 'Mid-Cities',
  zip: '75052',
  slug: 'grand-prairie',
  metaTitle: 'Metal & Brava Slate Roofing Grand Prairie TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Grand Prairie, TX. Serving Mira Lagos and Westchester.',

  heroHeadline: "Grand Prairie Is Building Fast,\nBuild the Roof Right the First Time",
  heroSub: "From Mira Lagos to CentrePort, Grand Prairie's newest neighborhoods are setting a higher standard, and metal roofing is part of it.",

  localContext: "Grand Prairie sits at the center of the Mid-Cities, between Arlington, Irving, and Dallas, and its newer master-planned communities like Mira Lagos and Sheffield are drawing homeowners who want their roof to match the quality of the rest of the build. Dallas County's hail corridor covers Grand Prairie the same as its neighbors, and with home values rising steadily across the city's newer developments, a Class 4 impact-rated metal roof is increasingly the standard rather than the upgrade. For Grand Prairie homeowners drawn to a traditional slate or shake profile, Brava offers that look in a durable synthetic, so you can choose between metal and Brava on the merits of your own home.",

  hoaNote: "Mira Lagos, Westchester, and Sheffield all maintain active HOAs with architectural review for exterior changes, and metal roofing in approved profiles is already common throughout each. Older neighborhoods closer to Downtown Grand Prairie typically have no HOA restrictions. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.",

  localStat: {
    val: '$330k',
    label: 'Median Home Value',
    source: 'Grand Prairie, TX 2025',
  },

  neighborhoods: [
    'Mira Lagos',
    'Westchester',
    'Lynn Creek',
    'Nottingham',
    'Forum Estates',
    'Sheffield',
    'CentrePort',
  ],

  nearbyCities: [
    { name: 'Arlington', slug: 'arlington' },
    { name: 'Irving', slug: 'irving' },
    { name: 'Mansfield', slug: 'mansfield' },
    { name: 'Dallas', slug: 'dallas' },
  ],

  review: {
    name: 'Carlos M.',
    neighborhood: 'Mira Lagos',
    text: "We built in Mira Lagos and the builder-grade shingle roof was the one thing that felt out of place with the rest of the house. Upgraded to standing seam about a year in and it made a bigger difference to the curb appeal than almost anything else we've done.",
    rating: 5,
  },

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Grand Prairie, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Grand Prairie homeowners will never need to use.',
    },
    {
      q: 'How much does a metal roof cost in Grand Prairie?',
      a: `Metal roofing in Grand Prairie is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.`,
    },
    {
      q: 'Is metal roofing common in newer Grand Prairie communities like Mira Lagos?',
      a: 'Yes. Mira Lagos, Sheffield, and Westchester all have architectural guidelines that already permit metal roofing in approved profiles, and it\'s an increasingly common choice among homeowners building or upgrading in these communities.',
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Grand Prairie?',
      a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Grand Prairie sits in the Dallas County hail corridor, and homeowners who upgrade typically see a meaningful reduction in their wind/hail premium.',
    },
    {
      q: 'Will my Grand Prairie HOA approve a metal roof?',
      a: 'Communities with an active architectural review process, like Mira Lagos and Sheffield, generally approve metal roofing in pre-approved profiles and colors. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.',
    },
    {
      q: 'How long does metal roof installation take in Grand Prairie?',
      a: 'Most residential installations in Grand Prairie are completed in one to three days. The exact timeline depends on roof size and material selection. We provide a specific estimate timeline for your home before any work begins.',
    },
    {
      q: 'What metal and Brava roofing style works best for Grand Prairie homes?',
      a: 'Standing seam suits the contemporary architecture common in newer communities like Mira Lagos and CentrePort-adjacent builds, while stone-coated steel is a strong match for the more traditional homes closer to Downtown Grand Prairie. Both carry Class 4 hail ratings and 50-plus year lifespans. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.',
    },
  ],
}
