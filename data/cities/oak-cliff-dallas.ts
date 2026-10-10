import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const OAK_CLIFF_DALLAS_DATA: CityData = {
  name: 'Oak Cliff',
  parentCity: 'Dallas',
  state: 'TX',
  county: 'Dallas',
  region: 'Southwest Dallas',
  slug: 'oak-cliff-dallas',
  leadWithBrava: true,
  metaTitle: 'Brava Slate & Metal Roofing Oak Cliff Dallas TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing in Oak Cliff, a Dallas neighborhood. Free 40-point assessment and HOA-ready documents.',

  heroHeadline: "Oak Cliff's Historic Homes\nDeserve a Lasting Roof",
  heroSub: "Craftsman bungalows, Tudors, and Spanish revival houses give Oak Cliff its character. A roof that lasts keeps that character from fading with every re-roof.",

  localContext: "Oak Cliff is a neighborhood of Dallas, southwest of downtown across the Trinity River, and it was a separate city before Dallas annexed it in 1903. Its older areas hold Craftsman, Prairie, Tudor, and Spanish revival homes from the early twentieth century, with mid-century houses in other parts. Roofs are mostly composition shingle with some older tile, and many are overdue for replacement. Brava synthetic slate or tile suits Tudor and Spanish revival homes, Brava shake and stone-coated steel can echo the shingle or shake look of a bungalow, and standing seam fits updated houses. Winnetka Heights is a designated City of Dallas historic district, so exterior changes there go through city review. Elsewhere requirements vary by address, and we handle the submission. For the wider city, see our Dallas page.",

  hoaNote: "Design review and permit requirements vary by address, and we handle the submission. Winnetka Heights is a designated City of Dallas historic district with its own review process. We provide material samples, color chips, and manufacturer spec sheets for any review at no additional cost.",

  neighborhoods: [
    'Winnetka Heights',
    'Kessler Park',
    'Stevens Park',
    'Kidd Springs',
    'Wynnewood',
    'Bishop Arts District area',
  ],

  nearbyCities: [
    { name: 'Dallas',       slug: 'dallas' },
    { name: 'Irving',       slug: 'irving' },
    { name: 'Grand Prairie', slug: 'grand-prairie' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Oak Cliff?',
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most Oak Cliff homeowners will never need to use.",
    },
    {
      q: 'Will a Brava or metal roof suit an older Oak Cliff bungalow?',
      a: "Yes. Brava synthetic slate or tile suits Tudor and Spanish revival homes, while Brava shake and stone-coated steel replicate the look of shingle or shake on Craftsman and Prairie bungalows. We bring samples so you can judge color against your siding or stucco.",
    },
    {
      q: 'Does a roof in Winnetka Heights need historic district review?',
      a: "Yes, Winnetka Heights is a designated City of Dallas historic district, so exterior changes go through city review. We handle the submission and prepare samples, color chips, and spec sheets. Other Oak Cliff areas vary by address, so we confirm what applies before you choose a material.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in Oak Cliff?',
      a: `Cost depends on roof size, pitch, and complexity, and Oak Cliff bungalows often have smaller roofs than newer suburban homes. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for Brava synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Oak Cliff?',
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. Ask your agent for a quote once you know which material you want.",
    },
    {
      q: 'Can you check an older Oak Cliff roof structure before installing?',
      a: "Yes, the free 40-point assessment includes decking, framing, flashing, and ventilation. Older homes often need decking repairs, and we point those out before you sign so the price is firm. Most installs then take one to three days.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci are both premium composite roofs that give a home the look of slate or shake, and both publish a Class 4 impact rating. Brava also offers Spanish Barrel Tile, and we install Brava in three profiles: slate, cedar shake, and Spanish barrel tile. For Oak Cliff homeowners weighing the two, the side-by-side lists the published specifications from each manufacturer.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
  ],
}
