import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const UNIVERSITY_PARK_DATA: CityData = {
  name: 'University Park',
  state: 'TX',
  county: 'Dallas',
  region: 'Park Cities',
  zip: '75225',
  slug: 'university-park',
  leadWithBrava: true,
  metaTitle: 'Brava Slate & Metal Roofing University Park TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing for University Park, TX Tudor and Colonial homes. Free 40-point assessment.',

  heroHeadline: "University Park Character\nDeserves a Lasting Roof",
  heroSub: "Tudor and Colonial rooflines on tree-lined blocks near SMU are part of what makes University Park special. A durable roof protects the look and the investment.",

  localContext: "University Park is an incorporated city of its own, not part of Dallas, and together with Highland Park it makes up the Park Cities. Lots here are smaller and homes sit closer together, with plenty of Tudor, Colonial, and other traditional houses near the SMU campus. Roofs are a mix of composition shingle, slate, and tile, and on tight lots careful staging and cleanup matter as much as the material. Brava synthetic slate and shake suit traditional Tudor and Colonial rooflines, with stone-coated steel and standing seam as strong metal alternatives, especially on newer builds. Highland Park next door has larger lots and a different scale of home, and has its own page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. We provide material samples, color chips, and manufacturer spec sheets for any review or HOA package at no additional cost.",

  localStat: {
    val: '$2.5M',
    label: 'Median Home Value',
    source: 'University Park, TX, Trulia, May 2026',
  },

  neighborhoods: [
    'Snider Plaza area',
    'Caruth Boulevard',
    'SMU area',
    'Hillcrest Avenue',
  ],

  nearbyCities: [
    { name: 'Highland Park',  slug: 'highland-park' },
    { name: 'Dallas',         slug: 'dallas' },
    { name: 'Lakewood',       slug: 'lakewood-dallas' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in University Park, TX?',
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most University Park homeowners will never need to use.",
    },
    {
      q: 'Will a metal or Brava synthetic slate roof suit a Tudor or Colonial home?',
      a: "Yes. Brava synthetic slate and shake are made to match the traditional profiles found on Tudor and Colonial homes, and stone-coated steel is a lasting metal alternative. From the street they look like slate or shake. We bring samples to your house so you can judge color against your brick and trim.",
    },
    {
      q: 'How do you handle a roof replacement on a smaller University Park lot?',
      a: "We plan staging, material drop-off, and daily cleanup around your lot before work starts. Tight lots and close neighbors are normal here, so we agree on where equipment goes and protect landscaping and driveways. Most installs take one to three days.",
    },
    {
      q: 'Does a new roof in University Park need a permit or design review?',
      a: "Permit and design review requirements vary by project, and we handle the submission. University Park and Highland Park are separate municipalities with their own permitting, even though homeowners often think of them together as the Park Cities. We confirm what applies to your address and prepare the samples and spec sheets.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in University Park?',
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. Ask your agent for a quote once you know which material you want. We can provide the product documentation your carrier asks for.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in University Park?',
      a: `Cost depends on roof size, pitch, and complexity, and many University Park roofs are moderate in size with several gables and dormers. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for Brava synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
  ],
}
