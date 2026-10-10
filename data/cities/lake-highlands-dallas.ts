import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const LAKE_HIGHLANDS_DALLAS_DATA: CityData = {
  name: 'Lake Highlands',
  parentCity: 'Dallas',
  state: 'TX',
  county: 'Dallas',
  region: 'Northeast Dallas',
  slug: 'lake-highlands-dallas',
  leadWithBrava: true,
  metaTitle: 'Brava & Metal Roofing Lake Highlands Dallas TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing in Lake Highlands, a Dallas neighborhood. Free 40-point assessment.',

  heroHeadline: "Lake Highlands Homes\nDeserve a Roof That Outlasts Them",
  heroSub: "Brick ranches and split-levels on wooded lots have been re-roofed once or twice already. Lake Highlands homeowners are choosing a roof that ends the cycle.",

  localContext: "Lake Highlands is a neighborhood of Dallas, in the northeast part of the city, and most of its homes were built from the 1950s through the 1970s: brick ranches and split-levels on wooded lots, with composition shingle far more common than tile or slate. Many of those roofs have been replaced once or twice already, and metal is the upgrade that stops the cycle. Brava synthetic shake and slate suit brick ranches, with stone-coated steel and standing seam as strong metal options, especially on updated and contemporary remodels. Some streets are HOA governed and others are not, so we confirm what applies at your address. For the wider city, see our Dallas page.",

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
      a: "Your Lake Highlands roof comes with our 10-year workmanship warranty, put in writing before work begins. A second layer of protection comes from the manufacturer, whose material warranty covers the panels and finish. Between the two, you have coverage for both the installation and the product, on a roof designed for a long service life. Questions about either one are welcome at any point.",
    },
    {
      q: 'What Brava or metal roof style suits a brick ranch in Lake Highlands?',
      a: "The right profile for a Lake Highlands home depends on its architecture, and we install steel and Brava options to match. Brava synthetic shake or slate, and stone-coated steel in a shingle or shake profile, both suit brick ranches and split-levels well. Standing seam is a clean choice on updated homes. Brava's composite slate, shake, and barrel tile reproduce natural materials with natural color variation. You can preview any of these on your own address in our Free Roof Visualizer.",
    },
    {
      q: 'Is metal worth it on a mid-size Lake Highlands home?',
      a: "For many owners, yes, because metal offers long life and low maintenance. You also get a Class 4 impact rating and a long-lasting finish. We are happy to talk through your roof so you can decide with real information.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in Lake Highlands?',
      a: "The cost of a metal or Brava roof in Lake Highlands comes down to roof size, pitch, and the material you choose, priced per square foot. Many Lake Highlands ranches have simple, mid-size roofs. We measure your roof by satellite to give a ballpark, then finalize a firm price once we have seen it during a free assessment. All materials are listed in the pricing table above, and the free visualizer prices your specific roof. Two similar-looking houses can price differently once the roof structure is measured.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Lake Highlands?',
      a: "Often it does, because most Texas insurers discount Class 4 roofs and metal systems carry that rating. Dallas County homeowners commonly review their coverage after a storm, and a new roof is a natural time. We suggest asking your insurance carrier for a quote that reflects the new roof.",
    },
    {
      q: 'Does my Lake Highlands street have an HOA or need a permit for a new roof?',
      a: "Many Lake Highlands HOAs approve metal and Brava roofs, though requirements vary from one community to the next, and some streets have no HOA at all. Design review and permit requirements differ by address, and we handle the submission whichever applies. Samples, color chips, and spec sheets come with our free help preparing your submission.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci are both premium composites with a Class 4 impact rating and a slate or shake look. Brava shake and slate suit Lake Highlands brick ranches, and we install Brava in three profiles. The comparison page lists the published specifications for both.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
    {
      q: "What is Brava roofing made from?",
      a: "Brava tiles are made from a composite containing recycled material, and they are fully recyclable. The tiles are compression molded, a process Brava says makes them stronger and more detailed. We can bring a tile sample to your Lake Highlands inspection.",
    },
    {
      q: "Will a metal roof block cell or Wi-Fi signal in Lake Highlands?",
      a: "A metal roof usually has little impact on signal. Where service is already weak, as in some Dallas County neighborhoods, a booster helps, and results vary from home to home.",
    },
  ],
}
