import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const ARLINGTON_DATA: CityData = {
  name: 'Arlington',
  state: 'TX',
  county: 'Tarrant',
  region: 'Mid-Cities',
  zip: '76010',
  slug: 'arlington',
  metaTitle: 'Metal & Brava Slate Roofing Arlington TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Arlington, TX. Serving Viridian and North Arlington.',

  heroHeadline: "Arlington Weathers Every Season,\nYour Roof Should Too",
  heroSub: "Between Fort Worth and Dallas, Arlington sits directly in the path of North Texas's worst hail seasons. Metal roofing ends the cycle of asphalt replacement for good.",

  localContext: "Arlington's mix of established mid-century neighborhoods and newer master-planned communities like Viridian gives the city one of the widest ranges of roofing needs in the Mid-Cities. Tarrant County storm exposure hits North and South Arlington alike, and with the city's older housing stock aging past its original shingle life expectancy, more homeowners are opting to replace once and be done rather than reroof with asphalt every 12 to 15 years. Homeowners who want the look of natural slate, shake, or tile have an equally strong option in Brava synthetic slate, which we install alongside standing seam and stone-coated steel for homes in communities like Viridian and North Arlington.",

  hoaNote: "Viridian's architectural review process is well-established and metal roofing in approved profiles is already common throughout the community. Older, non-HOA neighborhoods across North and South Arlington have no such restrictions. Where an HOA does apply, we provide full documentation: material samples, color chips, and manufacturer spec sheets, at no additional cost.",

  localStat: {
    val: '$310k',
    label: 'Median Home Value',
    source: 'Arlington, TX 2025',
  },

  neighborhoods: [
    'Viridian',
    'North Arlington',
    'South Arlington',
    'Southwest Arlington',
    'Far South Arlington',
    'Downtown Arlington/UTA Corridor',
  ],

  nearbyCities: [
    { name: 'Grand Prairie', slug: 'grand-prairie' },
    { name: 'Mansfield', slug: 'mansfield' },
  ],


  faqs: [
    {
      q: 'What warranty comes with a metal roof in Arlington, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Arlington homeowners will never need to use.',
    },
    {
      q: 'How much does a metal roof cost in Arlington?',
      a: `Metal roofing in Arlington is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.`,
    },
    {
      q: 'Is metal roofing common in newer Arlington developments like Viridian?',
      a: 'Yes. Viridian\'s architectural guidelines already permit metal roofing in approved profiles, and it\'s an increasingly common choice among homeowners building or reroofing in the community given the neighborhood\'s exposure to the same Tarrant County hail corridor as the rest of Arlington.',
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Arlington?',
      a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Arlington sits in an active hail corridor between Fort Worth and Dallas, and homeowners who upgrade typically see a meaningful reduction in their wind/hail premium.',
    },
    {
      q: 'Will my Arlington HOA approve a metal roof?',
      a: 'Communities with an active architectural review process, like Viridian, generally approve metal roofing in pre-approved profiles and colors. Many older Arlington neighborhoods have no HOA at all. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.',
    },
    {
      q: 'How long does metal roof installation take in Arlington?',
      a: 'Most residential installations in Arlington are completed in one to three days. The exact timeline depends on roof size and material selection. We provide a specific estimate timeline for your home before any work begins.',
    },
    {
      q: 'What metal and Brava roofing styles work best for Arlington homes?',
      a: 'Standing seam suits the more contemporary builds going up in Viridian and other newer developments, while stone-coated steel is a strong match for the traditional ranch and mid-century homes common across North and South Arlington. Both carry Class 4 hail ratings and 50-plus year lifespans. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.',
    },
  ],
}
