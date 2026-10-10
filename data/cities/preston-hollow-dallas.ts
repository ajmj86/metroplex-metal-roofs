import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const PRESTON_HOLLOW_DALLAS_DATA: CityData = {
  name: 'Preston Hollow',
  parentCity: 'Dallas',
  state: 'TX',
  county: 'Dallas',
  region: 'North Dallas',
  zip: '75230',
  slug: 'preston-hollow-dallas',
  leadWithBrava: true,
  metaTitle: 'Brava & Metal Roofing Preston Hollow Dallas TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing in Preston Hollow, a Dallas neighborhood. Free 40-point assessment.',

  heroHeadline: "Preston Hollow's Big Roofs\nShould Only Be Replaced Once",
  heroSub: "Large lots, mature trees, and roofs with a lot of hips and valleys. Preston Hollow homeowners are choosing a roof that does not come back around in ten years.",

  localContext: "Preston Hollow is a neighborhood of Dallas, in the north part of the city, known for larger lots, mature trees, and homes that range from mid-century ranches to newer custom builds. That mix means roofs of every age, with composition shingle on many older homes and clay tile or slate on some of the larger ones. Big roofs with multiple hips and valleys are expensive to replace again and again, which is why many owners are moving to Brava synthetic slate, stone-coated steel, or standing seam. For the wider city, see our Dallas page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. Some Preston Hollow blocks have HOA or neighborhood association review and others do not, so we confirm what applies at your address and provide samples, color chips, and spec sheets at no additional cost.",

  neighborhoods: [
    'Old Preston Hollow',
    'Preston Hollow North',
    'Walnut Hill Lane area',
    'Royal Lane area',
  ],

  nearbyCities: [
    { name: 'Dallas',         slug: 'dallas' },
    { name: 'Bluffview',      slug: 'bluffview-dallas' },
    { name: 'Highland Park',  slug: 'highland-park' },
    { name: 'University Park', slug: 'university-park' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Preston Hollow?',
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most Preston Hollow homeowners will never need to use.",
    },
    {
      q: 'Is Preston Hollow a good fit for Brava synthetic slate or stone-coated steel?',
      a: "Yes, both work well on Preston Hollow homes, from mid-century ranches to larger custom houses. Brava synthetic slate suits traditional and estate-style homes with the look of natural slate, shake, or tile, and stone-coated steel gives a shingle or shake look on a lasting roof. Standing seam is a strong choice on contemporary builds.",
    },
    {
      q: 'Do large, complex roofs cost much more to replace with metal?',
      a: `Larger roofs with many hips and valleys do cost more, and the layout matters as much as the size. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for Brava synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
    {
      q: 'Does my Preston Hollow home need HOA or design review for a new roof?',
      a: "It depends on your block. Design review and permit requirements vary, and we handle the submission whichever applies. We provide material samples, color chips, and manufacturer spec sheets at no additional cost.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Preston Hollow?',
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. On a higher-value home, even a modest premium reduction adds up. Ask your agent for a quote once you know which material you want.",
    },
    {
      q: 'How do mature trees affect a roof replacement in Preston Hollow?',
      a: "Mature trees mean we plan access, staging, and cleanup carefully, and we protect your landscaping during the work. Metal also sheds leaves and debris well, which helps on tree-covered lots. Most installs take one to three days, and larger roofs can take longer.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci are both premium composite roofs that give a home the look of slate or shake, and both publish a Class 4 impact rating. Brava also offers Spanish Barrel Tile, and we install Brava in three profiles: slate, cedar shake, and Spanish barrel tile. For Preston Hollow homeowners weighing the two, the side-by-side lists the published specifications from each manufacturer.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
  ],
}
