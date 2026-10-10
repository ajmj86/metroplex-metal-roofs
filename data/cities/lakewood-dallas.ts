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
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most Lakewood homeowners will never need to use.",
    },
    {
      q: 'Will a Brava or metal roof look right on a Lakewood bungalow?',
      a: "Yes. Brava synthetic shake and slate suit Craftsman bungalows and Tudors, Brava Spanish barrel tile suits Spanish revival homes, and stone-coated steel replicates the look of shingle or shake in steel. We bring samples to your house so you can judge the color against your siding or brick.",
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
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. After years of hail in North Texas, many Lakewood homeowners are looking at metal to stop repeat claims. Ask your agent for a quote once you know which material you want.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in Lakewood?',
      a: `Cost depends on roof size, pitch, and complexity, and many Lakewood bungalows have smaller, simpler roofs than larger estate homes. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for Brava synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci are both premium composite roofs that give a home the look of slate or shake, and both publish a Class 4 impact rating. Brava also offers Spanish Barrel Tile, and we install Brava in three profiles: slate, cedar shake, and Spanish barrel tile. For Lakewood homeowners weighing the two, the side-by-side lists the published specifications from each manufacturer.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
  ],
}
