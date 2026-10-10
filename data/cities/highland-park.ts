import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const HIGHLAND_PARK_DATA: CityData = {
  name: 'Highland Park',
  state: 'TX',
  county: 'Dallas',
  region: 'Park Cities',
  zip: '75205',
  slug: 'highland-park',
  leadWithBrava: true,
  metaTitle: 'Brava Slate & Metal Roofing Highland Park TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing for Highland Park, TX estates. Free 40-point assessment and HOA-ready documents.',

  heroHeadline: "Highland Park Estates\nDeserve a Roof That Lasts",
  heroSub: "Clay tile, slate, and Tudor rooflines define Highland Park. When it is time to replace them, a roof built to last protects the architecture as well as the house.",

  localContext: "Highland Park is an incorporated town of its own, not part of Dallas, and together with University Park it makes up the Park Cities. Its larger lots and estate-scale homes were built over many decades, and many still carry original clay tile, slate, or heavy composition roofs that are now costly to repair and hard to match. Brava synthetic slate, shake, and tile reproduce those profiles on a roof that is far lighter than natural slate or clay, with stone-coated steel and standing seam as strong metal alternatives, especially on newer and more modern homes. Next door, University Park has smaller lots and its own mix of home styles, and has its own page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. We provide material samples, color chips, and manufacturer spec sheets for any review or HOA package at no additional cost.",

  localStat: {
    val: '$2.9M',
    label: 'Median Home Value',
    source: 'Highland Park, TX, Trulia, April 2026',
  },

  neighborhoods: [
    'Highland Park Village area',
    'Beverly Drive',
    'Armstrong Parkway',
    'Lakeside Drive',
    'Turtle Creek corridor',
  ],

  nearbyCities: [
    { name: 'University Park', slug: 'university-park' },
    { name: 'Dallas',          slug: 'dallas' },
    { name: 'Preston Hollow',  slug: 'preston-hollow-dallas' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Highland Park, TX?',
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most Highland Park homeowners will never need to use.",
    },
    {
      q: 'What can replace a clay tile or slate roof on a Highland Park home?',
      a: "Brava synthetic slate and tile are the closest matches to the clay tile and slate roofs common in Highland Park, with stone-coated steel as a lasting metal alternative. They look like the original material from the street and are far lighter, which matters on older framing. We confirm the details during your free on-site assessment.",
    },
    {
      q: 'Does a new roof in Highland Park need design review or a permit?',
      a: "Permit and design review requirements vary by project and street, and we handle the submission for you. That applies across the Park Cities, so we confirm what your specific address involves before you choose a material. We prepare samples, color chips, and spec sheets so the package is complete the first time.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Highland Park?',
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. On a high-value Highland Park home, even a modest premium reduction adds up over the life of the roof. Ask your agent for a quote once you know which material you want.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in Highland Park?',
      a: `Cost depends on roof size, pitch, and complexity, and larger estate roofs with several rooflines cost more than a simple gable. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for Brava synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
    {
      q: 'How long does a roof replacement take on a larger Highland Park home?',
      a: "Most installs take one to three days, and larger homes with dormers, chimneys, and multiple valleys can take longer. We give you a schedule specific to your home before any work begins. We also protect landscaping and clean up daily.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci are both premium composite roofs that give a home the look of slate or shake, and both publish a Class 4 impact rating. Brava also offers Spanish Barrel Tile, and we install Brava in three profiles: slate, cedar shake, and Spanish barrel tile. For Highland Park homeowners weighing the two, the side-by-side lists the published specifications from each manufacturer.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
  ],
}
