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
      a: "Each roof we build in Arlington carries a 10-year workmanship warranty covering how it was installed. The metal itself carries the manufacturer's material warranty for the panels and their finish. Both are explained in plain language during your estimate, so nothing comes as a surprise later. Questions about either one are welcome at any point.",
    },
    {
      q: 'How much does a metal roof cost in Arlington?',
      a: "What you pay for metal in Arlington depends on the size and pitch of the roof and the material, and it is quoted by the square foot. A satellite measurement of your roof gives us a reliable starting range, and the free on-site assessment turns it into a firm price. Compare systems in the pricing table above, and let the free visualizer work out a number for your home. Two similar-looking houses can price differently once the roof structure is measured.",
    },
    {
      q: 'Is metal roofing common in newer Arlington developments like Viridian?',
      a: "Many associations accept metal in approved profiles and colors; we confirm yours. Newer developments like Viridian share the same Tarrant County hail exposure as the rest of Arlington, so roof material is a common question for owners there.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Arlington?',
      a: "Most Texas insurers discount Class 4 roofs, so upgrading to a Class 4 metal roof in Arlington can reduce what you pay. For an Arlington home, it helps to talk with your agent before choosing a material. Because discounts vary, check with your insurance carrier and keep our documentation handy.",
    },
    {
      q: 'Will my Arlington HOA approve a metal roof?',
      a: "Whether your Arlington HOA approves depends on its architectural guidelines, and many accept metal and Brava in approved profiles and colors. If you live in Viridian or North Arlington, check your association's guidelines early. We help with the paperwork and submission, and the committee makes the final call.",
    },
    {
      q: 'How long does metal roof installation take in Arlington?',
      a: "Most Arlington homes are done in one to three days, though roof size and complexity can stretch that. You will have a clear schedule for your own home as part of the estimate. Staging and material delivery are planned around your driveway and neighbors.",
    },
    {
      q: 'What metal and Brava roofing styles suit Arlington homes?',
      a: "We offer standing seam, stone-coated steel, and Brava in Arlington, each suited to different rooflines. Standing seam suits the more contemporary builds going up in Viridian and other newer developments, while stone-coated steel is a strong match for the traditional ranch and mid-century homes common across North and South Arlington. If you lean toward a slate or tile appearance, Brava's three profiles are worth a look. We are happy to compare options side by side during your free assessment.",
    },
    {
      q: "What is oil canning, and should Arlington homeowners worry about it?",
      a: "Oil canning is a slight visible waviness that can appear on flat metal panels. It is cosmetic and does not affect performance. Panel choice and installation help reduce it, and we point out your options for Arlington homes.",
    },
  ],
}
