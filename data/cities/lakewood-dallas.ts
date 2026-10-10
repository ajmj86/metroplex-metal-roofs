import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const LAKEWOOD_DALLAS_DATA: CityData = {
  name: 'Lakewood',
  parentCity: 'Dallas',
  state: 'TX',
  county: 'Dallas',
  region: 'East Dallas',
  zip: '75214',
  slug: 'lakewood-dallas',
  leadWithBrava: true,
  metaTitle: 'Brava Slate & Metal Roofing Lakewood Dallas TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing in Lakewood, a Dallas neighborhood. Free 40-point assessment and HOA-ready documents.',

  heroHeadline: "Lakewood's Character Homes\nDeserve a Lasting Roof",
  heroSub: "Bungalows, Tudors, and Spanish revival houses near White Rock Lake were built to last. A roof that matches that promise keeps their character intact.",

  localContext: "Lakewood is a neighborhood of Dallas, in the east part of the city near White Rock Lake, known for homes built mostly in the 1920s through the 1940s: Craftsman and other bungalows, Tudors, and Spanish and Mediterranean revival houses. Many have been through one or more asphalt replacements, and some still carry older tile or slate. Brava synthetic slate, shake, or tile let owners keep the look of those styles on a roof that lasts, with stone-coated steel and standing seam as strong metal options for bungalows and updated homes. Design review and permit requirements vary by address, and we handle the submission. For the wider city, see our Dallas page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. We provide material samples, color chips, and manufacturer spec sheets for any review or HOA package at no additional cost.",

  neighborhoods: [
    'Lakewood Heights',
    'Lakewood Trails',
    'Lakewood Hills',
    'Lakewood Country Club area',
  ],

  nearbyCities: [
    { name: 'Dallas',           slug: 'dallas' },
    { name: 'Lake Highlands',   slug: 'lake-highlands-dallas' },
    { name: 'University Park',  slug: 'university-park' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Lakewood?',
      a: "We back every Lakewood installation with a 10-year workmanship warranty that sits in your contract, not on a handshake. Material defects in the panels and finish fall under the manufacturer's own warranty. Paired with a system lifespan of 50 years or more, it is coverage most Lakewood homeowners rarely have to use. If you ever need to make a claim, we help you through the process.",
    },
    {
      q: 'Will a Brava or metal roof look right on a Lakewood bungalow?',
      a: "In Lakewood, the choice usually comes down to a shingle or shake look in stone-coated steel, a clean standing seam line, or a Brava profile. Brava synthetic shake and slate suit Craftsman bungalows and Tudors, Brava Spanish barrel tile suits Spanish revival homes, and stone-coated steel replicates the look of shingle or shake in steel. Homeowners drawn to natural slate, shake, or tile can compare Brava's three profiles with the steel options. Both steel systems carry a Class 4 impact rating, and we bring samples so you can compare them on your own home.",
    },
    {
      q: 'What replaces an old tile or slate roof on a Lakewood home?',
      a: "Brava synthetic tile and slate are the closest matches to original tile and slate, and stone-coated steel is a lighter lasting alternative. Both read as the original material from the street. We check the roof structure during the free assessment so the new system fits the house.",
    },
    {
      q: 'Do I need approval before replacing a roof in Lakewood?',
      a: "Requirements vary by address, and we handle the submission whatever applies. We prepare samples, color chips, and manufacturer spec sheets for any review. Check with us before you pick a material and we will confirm what your street involves.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Lakewood?',
      a: "In many cases, yes. Metal roofing with a Class 4 impact rating is the type of roof most Texas insurers discount. After years of hail in North Texas, many Lakewood homeowners are looking at metal to reduce repeat claims. The size of the discount depends on your carrier and policy, so check with your insurance carrier.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in Lakewood?',
      a: "Pricing for a Lakewood metal or Brava roof is per square foot, shaped mostly by how large and steep the roof is and which system you select. Many Lakewood bungalows have smaller, simpler roofs than larger estate homes. The process begins with a satellite-measured range and ends with a firm number after our free on-site visit. Our pricing table above has the full breakdown, and the free visualizer shows a number for your own roof. There is no obligation at either step.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Both make composite roofing that looks like slate or shake, and both publish a Class 4 impact rating. Lakewood's Spanish and Mediterranean revival homes are why some owners ask about Brava Spanish Barrel Tile. Our comparison page sets the published specifications next to each other.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
    {
      q: "Does Brava synthetic slate curl or warp on a Lakewood roof?",
      a: "Warping and curling are usually tied to how a roof is put on rather than to Brava itself, so the safeguard is installing to Brava's published installation guide. Our crews follow that guide on every Brava roof in Lakewood. Ask to walk through the steps before you sign.",
    },
    {
      q: "What is oil canning, and should Lakewood homeowners worry about it?",
      a: "Oil canning means a slight ripple in flat metal panels. It is cosmetic, and choosing the right panel and installing it carefully helps reduce it. We cannot promise it will be absent, but we explain the choices for your Lakewood home.",
    },
  ],
}
