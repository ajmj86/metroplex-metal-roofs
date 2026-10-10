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
      a: "On a Preston Hollow job, our 10-year workmanship warranty is part of the signed agreement. Panels and finish are covered separately by the manufacturer's material warranty. Between the two, you have coverage for both the installation and the product, on a roof designed for a long service life. You will see the details in writing before you commit.",
    },
    {
      q: 'Is Preston Hollow a good fit for Brava synthetic slate or stone-coated steel?',
      a: "Yes, both work well on Preston Hollow homes, from mid-century ranches to larger custom houses. Brava synthetic slate suits traditional and estate-style homes with the look of natural slate, shake, or tile, and stone-coated steel gives a shingle or shake look on a lasting roof. Standing seam is a strong choice on contemporary builds, and we bring samples of metal and Brava so you can compare them on your own home.",
    },
    {
      q: 'Do large, complex roofs cost much more to replace with metal?',
      a: "Larger roofs with many hips and valleys do cost more, and the layout matters as much as the size. The pricing table above lists the typical range for each material. We give a satellite-based range first and a firm number after your free on-site assessment.",
    },
    {
      q: 'Does my Preston Hollow home need HOA or design review for a new roof?',
      a: "Approval depends on your Preston Hollow community's guidelines, and many HOAs accept metal and Brava profiles in approved colors. Some blocks have an HOA or neighborhood association and others do not, so we confirm what applies at your address. Design review and permit requirements vary, and we handle the submission, though the final decision is your association's.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Preston Hollow?',
      a: "Yes, a Class 4 metal roof is a common way Preston Hollow homeowners earn a premium discount, since most Texas insurers offer one. On a higher-value home, even a modest premium reduction adds up. We suggest asking your insurance carrier for a quote that reflects the new roof.",
    },
    {
      q: 'How do mature trees affect a roof replacement in Preston Hollow?',
      a: "Mature trees mean we plan access, staging, and cleanup carefully, and we protect your landscaping during the work. Metal also sheds leaves and debris well, which helps on tree-covered lots. Most installs take one to three days, and larger roofs can take longer.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Both are premium composites with the look of slate or shake and a published Class 4 impact rating. On Preston Hollow's larger lots the profile and color matter most, and Brava includes cedar shake, slate, and Spanish barrel tile. The comparison page shows the published specs for each.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
    {
      q: "Does Brava synthetic slate fade on a Preston Hollow home?",
      a: "Brava uses mineral pigments, and the color runs through the full thickness of each tile, so color is not just a surface coating. Sun and weather age every exterior material over time, so look at samples in daylight. We are glad to show Preston Hollow homeowners samples at the inspection.",
    },
    {
      q: "Will a metal roof tick or pop in the Preston Hollow heat?",
      a: "Temperature swings make metal expand and contract. Proper fastening and the right panel system keep the movement controlled, and we are upfront that we cannot promise a roof will be silent. Ask us about it at your Preston Hollow inspection.",
    },
  ],
}
