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
      a: "We back every Oak Cliff installation with a 10-year workmanship warranty that sits in your contract, not on a handshake. You also receive the manufacturer's material warranty for the panels and finish. Because the roof is designed for a long service life, these warranties are there for peace of mind. Copies of both are yours to keep.",
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
      a: "Pricing for an Oak Cliff metal or Brava roof is per square foot, shaped mostly by how large and steep the roof is and which system you select. Cost depends on roof size, pitch, and complexity, and Oak Cliff bungalows often have smaller roofs than newer suburban homes. Expect a ballpark based on satellite measurements first, followed by a firm figure after the free in-person assessment. See the pricing table above for every material, or run our free visualizer for a figure specific to your house. Pitch, tear-off, and deck condition also factor into the final number.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Oak Cliff?',
      a: "In many cases, yes. Metal roofing with a Class 4 impact rating is the type of roof most Texas insurers discount. Many Oak Cliff owners compare quotes from their carrier once the roof material is chosen. Every policy is different, so confirm the details with your insurance carrier before you decide.",
    },
    {
      q: 'Can you check an older Oak Cliff roof structure before installing?',
      a: "Yes, the free 40-point assessment includes decking, framing, flashing, and ventilation. Older homes often need decking repairs, and we point those out before you sign so the price is firm. Most installs then take one to three days.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Both manufacturers make composite slate and shake with a published Class 4 impact rating. Oak Cliff's Tudor and Spanish revival homes are one reason we install Brava, which adds a Spanish barrel tile profile. See the comparison for each maker's published specifications.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
    {
      q: "How long does a Brava roof last in Oak Cliff?",
      a: "Your Oak Cliff roof is backed by a 50-year limited warranty from Brava, and installation quality plays a large part in how long any roof performs. We follow Brava's installation guide and can walk you through the paperwork at the consultation.",
    },
    {
      q: "Will a metal roof make my Oak Cliff home hotter?",
      a: "Not in itself. Lighter and reflective finishes reduce heat gain, so the color you choose matters more than the metal. Our team can show finish options suited to Oak Cliff homes.",
    },
  ],
}
