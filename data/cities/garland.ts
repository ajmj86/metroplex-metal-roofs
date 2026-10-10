import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const GARLAND_DATA: CityData = {
  name: 'Garland',
  state: 'TX',
  county: 'Dallas',
  region: 'East Dallas',
  zip: '75044',
  slug: 'garland',
  metaTitle: 'Metal & Brava Slate Roofing Garland TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Garland, TX. Serving Firewheel and Spring Park.',

  heroHeadline: "Garland Homeowners Are Done\nReplacing Shingles Every Storm Season",
  heroSub: "From Firewheel to Downtown Garland, more homeowners are making the one-time switch to metal instead of budgeting for another asphalt reroof.",

  localContext: "Garland's housing stock ranges from the newer developments around Firewheel to the established mid-century neighborhoods closer to Downtown Garland, giving the city one of the widest roof-age ranges in East Dallas. Dallas County's hail corridor runs straight through Garland, and homeowners with roofs original to their home, or already replaced once with asphalt, are increasingly choosing metal to end the cycle rather than repeat it a third time. Metal is not the only lasting choice here. Brava synthetic slate, shake, and Spanish barrel tile give Garland homes a premium, natural-material look, and we help you compare Brava and metal side by side before you decide.",

  hoaNote: "Newer communities near Firewheel and Rose Hill maintain standard HOA architectural review, while many of Garland's older neighborhoods near Downtown and Club Hill have no HOA restrictions at all. Where an HOA does apply, we provide full documentation: material samples, color chips, and manufacturer spec sheets, at no additional cost.",

  localStat: {
    val: '$285k',
    label: 'Median Home Value',
    source: 'Garland, TX 2025',
  },

  neighborhoods: [
    'Firewheel',
    'Spring Park',
    'Club Hill',
    'Camelot',
    'Rose Hill',
    'Downtown Garland',
  ],

  nearbyCities: [
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Richardson', slug: 'richardson' },
    { name: 'Mesquite', slug: 'mesquite' },
  ],


  faqs: [
    {
      q: 'What warranty comes with a metal roof in Garland, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Garland homeowners will never need to use.',
    },
    {
      q: 'How much does a metal roof cost in Garland?',
      a: `Metal roofing in Garland is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.`,
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Garland?',
      a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Garland sits in Dallas County\'s active hail corridor, and homeowners who upgrade typically see a meaningful reduction in their wind/hail premium.',
    },
    {
      q: 'Will my Garland HOA approve a metal roof?',
      a: 'Most Garland HOAs, including communities near Firewheel and Rose Hill, permit metal roofing in approved profiles and neutral color palettes. Many older neighborhoods have no HOA at all. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.',
    },
    {
      q: 'How long does metal roof installation take in Garland?',
      a: 'Most residential installations in Garland are completed in one to three days. The exact timeline depends on roof size and material selection. We provide a specific estimate timeline for your home before any work begins.',
    },
    {
      q: 'What metal and Brava roofing style works best for Garland homes?',
      a: 'Stone-coated steel is a popular match for the traditional ranch and split-level homes common throughout Garland\'s older neighborhoods, while standing seam suits the newer builds near Firewheel. Both carry Class 4 hail ratings and 50-plus year lifespans. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.',
    },
  ],
}
