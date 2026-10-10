import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const BLUFFVIEW_DALLAS_DATA: CityData = {
  name: 'Bluffview',
  parentCity: 'Dallas',
  state: 'TX',
  county: 'Dallas',
  region: 'North Dallas',
  slug: 'bluffview-dallas',
  metaTitle: 'Metal Roofing Bluffview Dallas TX | Metroplex',
  metaDesc: 'Standing seam, stone-coated steel and Brava synthetic slate roofing in Bluffview, a Dallas neighborhood. Free 40-point assessment and HOA-ready documents.',

  heroHeadline: "Bluffview's Tree-Lined Streets\nDeserve a Roof That Lasts",
  heroSub: "Established homes under mature trees take a lot from a roof. Bluffview homeowners are moving to metal and synthetic slate that handles debris, heat, and storms.",

  localContext: "Bluffview is a neighborhood of Dallas, in the north part of the city, with tree-covered streets and homes built largely from the 1960s onward. Ranch and traditional houses sit beside newer custom rebuilds, so roofs range from older composition shingle to newer premium systems. Mature trees mean leaves, branches, and extra wear, which is one more reason a durable roof makes sense here. Stone-coated steel and Brava synthetic slate suit the traditional homes, and standing seam fits contemporary rebuilds. For the wider city, see our Dallas page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. We provide material samples, color chips, and manufacturer spec sheets for any review or HOA package at no additional cost.",

  localStat: {
    val: '$1M',
    label: 'Median Home Value',
    source: 'Bluffview, Dallas, Trulia, May 2026',
  },

  neighborhoods: [
    'Bluffview Boulevard area',
  ],

  nearbyCities: [
    { name: 'Dallas',          slug: 'dallas' },
    { name: 'Preston Hollow',  slug: 'preston-hollow-dallas' },
    { name: 'Highland Park',   slug: 'highland-park' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Bluffview?',
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most Bluffview homeowners will never need to use.",
    },
    {
      q: 'Is metal a good choice for a home under mature trees?',
      a: "Yes. Metal and stone-coated steel shed leaves and debris easily and hold up well to the extra debris that comes with mature trees. Trees still call for sensible maintenance, and we explain what to expect for your lot during the assessment.",
    },
    {
      q: 'What roof style fits a 1960s ranch or traditional home in Bluffview?',
      a: "Stone-coated steel in a shingle or shake profile and Brava synthetic slate both suit ranch and traditional homes. Standing seam is a clean modern choice, especially on rebuilds and remodels. We bring samples so you can compare colors against your brick and trim.",
    },
    {
      q: 'How much does a metal or synthetic slate roof cost in Bluffview?',
      a: `Cost depends on roof size, pitch, and complexity, and most Bluffview homes fall in a mid-size range. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Bluffview?',
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. Ask your agent for a quote once you know which material you want. We can provide the product documentation your carrier asks for.",
    },
    {
      q: 'Do I need a permit or HOA approval for a new roof in Bluffview?',
      a: "Requirements vary by street and project, and we handle the submission either way. We confirm what applies to your address and prepare samples, color chips, and spec sheets. Most installs take one to three days once approvals are in place.",
    },
  ],
}
