import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const SOUTHLAKE_DATA: CityData = {
  name: 'Southlake',
  state: 'TX',
  county: 'Tarrant',
  region: 'North Fort Worth',
  zip: '76092',
  slug: 'southlake',
  leadWithBrava: true,
  metaTitle: 'Brava Slate & Metal Roofing Southlake TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Southlake, TX. Serving Timarron, Shady Oaks & Clariden Ranch.',

  heroHeadline: "Southlake's Standard\nfor Metal Roofing",
  heroSub: "From Timarron to Shady Oaks, Southlake homeowners are upgrading to metal, permanently. One installation that outlasts the mortgage and the next hail season.",

  localContext: "Southlake's Tarrant County location places it squarely in one of North Texas's most active hail corridors. With median home values consistently among the highest in DFW and 2% wind/hail deductibles now standard on most carrier policies, many Southlake homeowners are paying $20,000 or more out of pocket per replacement, often more than the cost of a metal roof that would have eliminated the cycle entirely. For Southlake homes with a premium roofline, Brava synthetic slate and shake bring the character of natural materials without the weight or upkeep, and standing seam and stone-coated steel round out the options we compare with you.",

  hoaNote: "Many Southlake HOAs require architectural approval for roofing materials. Standing seam and stone-coated steel in pre-approved colors are the most commonly permitted metal options across Carroll ISD neighborhoods. We provide material samples, color chips, and manufacturer spec sheets to support your HOA submission at no additional cost.",

  localStat: {
    val: '$1.1M',
    label: 'Median Home Value',
    source: 'Southlake, TX 2025',
  },

  neighborhoods: [
    'Timarron',
    'Shady Oaks',
    'Clariden Ranch',
    'Stone Lakes',
    'Estes Park',
    'Carillon',
    'Lakewood Hills',
    'Monticello',
    'Coventry Manor',
    'The Reserve at Southlake',
    'Versailles',
    'White Chapel Estates',
  ],

  nearbyCities: [
    { name: 'Westlake',      slug: 'westlake' },
    { name: 'Keller',        slug: 'keller' },
    { name: 'Colleyville',   slug: 'colleyville' },
    { name: 'Trophy Club',   slug: 'trophy-club' },
    { name: 'Grapevine',     slug: 'grapevine' },
    { name: 'Flower Mound',  slug: 'flower-mound' },
  ],


  faqs: [
    {
      q: 'What warranty comes with a metal roof in Southlake, TX?',
      a: "Each roof we build in Southlake carries a 10-year workmanship warranty covering how it was installed. Panels and finish are covered separately by the manufacturer's material warranty. We are glad to go over the exact terms with Tarrant County homeowners during the free consultation. If you ever need to make a claim, we help you through the process.",
    },
    {
      q: 'How much does a standing seam metal roof cost in Southlake, TX?',
      a: "Pricing for a Southlake metal roof is per square foot, shaped mostly by how large and steep the roof is and which system you select. We start with a satellite-based range built from your roof's measured size, then confirm a firm number after a free on-site assessment. The pricing table on this page covers all the systems, and the free visualizer can estimate your exact roof. Two similar-looking houses can price differently once the roof structure is measured.",
    },
    {
      q: 'Will my Southlake HOA approve a metal roof?',
      a: "Many Southlake HOAs approve metal and Brava roofs, though requirements vary from one community to the next. Timarron, Shady Oaks, and similar communities often have their own architectural committees. Tell us which community you are in, and we will build the documentation package for you.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Tarrant County?',
      a: "Most Texas insurers discount Class 4 roofs, so upgrading to a Class 4 metal roof in Southlake can reduce what you pay. Standing seam and stone-coated steel carry a Class 4 impact resistance rating, the highest available, which qualifies for significant premium discounts from most Texas carriers. In Tarrant County, where hail claims are common, many homeowners see 15–35% reductions on their wind/hail premium, depending on carrier and policy. Savings vary from one carrier to the next, so ask your agent what applies to your policy.",
    },
    {
      q: 'How long does metal roof installation take in Southlake?',
      a: "For a typical Southlake home the work takes about one to three days, depending on how big and complex the roof is. Standing seam typically takes longer than stone-coated steel due to the on-site forming process. Your estimate includes a timeline specific to your property before any work begins. Tear-off, underlayment, and the new roof are typically done in sequence.",
    },
    {
      q: 'Is a metal or Brava roof worth it on a home in the Carroll ISD area?',
      a: 'For homes in the $800K–$1.5M range common across Carroll ISD neighborhoods, the math typically favors metal strongly. Eliminating one asphalt replacement cycle, qualifying for insurance discounts, and reducing energy costs over 30 years means the upgrade often pays for itself, while adding a permanent finish that reflects the quality of the home. For homes in this class, Brava synthetic slate, shake, and Spanish barrel tile are often the first option we show, with standing seam and stone-coated steel as strong alternatives.',
    },
    {
      q: 'What metal roofing colors are HOA-approved in Southlake neighborhoods?',
      a: "Approval depends on your Southlake community's guidelines, and many HOAs accept metal and Brava profiles in approved colors. The most commonly approved colors across Southlake HOAs include charcoal gray, aged bronze, and weathered brown tones for standing seam, and earth-tone blends for stone-coated steel. We recommend confirming with your specific HOA before selection. We can assist with the documentation package regardless of which community you are in. We prepare material samples, color chips, and spec sheets for your submission at no additional cost.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci are both premium composite roofs with the look of slate or shake and a published Class 4 impact rating. Brava adds a Spanish Barrel Tile profile, which some Southlake homes in Timarron and Carillon suit well. The side-by-side lays out each maker's published specifications.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
    {
      q: "Does Brava synthetic slate fade on a Southlake home?",
      a: "Color in Brava tiles comes from mineral pigments that run all the way through each tile. That construction is why owners choose it for a lasting finish, though no outdoor material stays unchanged forever. Ask us about Brava's color durability testing during your Southlake estimate.",
    },
  ],
}
