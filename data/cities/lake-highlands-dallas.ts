import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const LAKE_HIGHLANDS_DALLAS_DATA: CityData = {
  name: 'Lake Highlands',
  parentCity: 'Dallas',
  state: 'TX',
  county: 'Dallas',
  region: 'Northeast Dallas',
  zip: '75231',
  slug: 'lake-highlands-dallas',
  metaTitle: 'Metal Roofing Lake Highlands Dallas TX | Metroplex',
  metaDesc: 'Stone-coated steel, Brava synthetic slate and standing seam roofing in Lake Highlands, a Dallas neighborhood. Free 40-point assessment.',

  heroHeadline: "Lake Highlands Homes\nDeserve a Roof That Outlasts Them",
  heroSub: "Brick ranches and split-levels on wooded lots have been re-roofed once or twice already. Lake Highlands homeowners are choosing a roof that ends the cycle.",

  localContext: "Lake Highlands is a neighborhood of Dallas, in the northeast part of the city, and most of its homes were built from the 1950s through the 1970s: brick ranches and split-levels on wooded lots, with composition shingle far more common than tile or slate. Many of those roofs have been replaced once or twice already, and metal is the upgrade that stops the cycle. Stone-coated steel and Brava synthetic shake or slate suit brick ranches, and standing seam works on updated and contemporary remodels. Some streets are HOA governed and others are not, so we confirm what applies at your address. For the wider city, see our Dallas page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. Some Lake Highlands blocks have an HOA and others do not, so we confirm what applies and provide samples, color chips, and spec sheets at no additional cost.",

  neighborhoods: [
    'Merriman Park',
    'Moss Haven',
    'Old Lake Highlands',
    'Forest Meadow',
  ],

  nearbyCities: [
    { name: 'Dallas',      slug: 'dallas' },
    { name: 'Lakewood',    slug: 'lakewood-dallas' },
    { name: 'Richardson',  slug: 'richardson' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in Lake Highlands?',
      a: "Every roof we install carries a 10-year workmanship warranty written into your contract, plus the manufacturer's material warranty on the panels and finish. With a 50+ year system lifespan, that is coverage most Lake Highlands homeowners will never need to use.",
    },
    {
      q: 'What metal roof style suits a brick ranch in Lake Highlands?',
      a: "Stone-coated steel in a shingle or shake profile and Brava synthetic shake or slate both suit brick ranches and split-levels well. Standing seam is a clean choice on updated homes. We bring samples so you can compare colors against your brick.",
    },
    {
      q: 'Is metal worth it on a mid-size Lake Highlands home?',
      a: "For many owners, yes, because a metal roof replaces several asphalt replacement cycles with one install. You also get a Class 4 impact rating and a lasting finish. We show the numbers for your roof so you can decide with real figures.",
    },
    {
      q: 'How much does a metal or synthetic slate roof cost in Lake Highlands?',
      a: `Cost depends on roof size, pitch, and complexity, and many Lake Highlands ranches have simple, mid-size roofs. By material, that runs about ${FAQ_RATE.stoneCoated()}/sq ft for stone-coated steel, ${FAQ_RATE.standingSeam()}/sq ft for standing seam, and ${FAQ_RATE.slate()}/sq ft for synthetic slate. We give a satellite-based range first and a firm number after your free on-site assessment.`,
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Lake Highlands?',
      a: "Most Texas insurers discount Class 4 impact rated roofs, and the savings depend on your carrier and policy. Ask your agent for a quote once you know which material you want. We can provide the product documentation your carrier asks for.",
    },
    {
      q: 'Does my Lake Highlands street have an HOA or need a permit for a new roof?',
      a: "It depends on the street. Design review and permit requirements vary, and we handle the submission whichever applies. We prepare samples, color chips, and manufacturer spec sheets at no additional cost.",
    },
  ],
}
