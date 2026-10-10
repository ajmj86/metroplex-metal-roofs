import { FAQ_RATE } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const UNIVERSITY_PARK_DATA: CityData = {
  name: 'University Park',
  state: 'TX',
  county: 'Dallas',
  region: 'Park Cities',
  zip: '75225',
  slug: 'university-park',
  leadWithBrava: true,
  metaTitle: 'Brava Slate & Metal Roofing University Park TX | Metroplex',
  metaDesc: 'Brava synthetic slate, stone-coated steel and standing seam roofing for University Park, TX Tudor and Colonial homes. Free 40-point assessment.',

  heroHeadline: "University Park Character\nDeserves a Lasting Roof",
  heroSub: "Tudor and Colonial rooflines on tree-lined blocks near SMU are part of what makes University Park special. A durable roof protects the look and the investment.",

  localContext: "University Park is an incorporated city of its own, not part of Dallas, and together with Highland Park it makes up the Park Cities. Lots here are smaller and homes sit closer together, with plenty of Tudor, Colonial, and other traditional houses near the SMU campus. Roofs are a mix of composition shingle, slate, and tile, and on tight lots careful staging and cleanup matter as much as the material. Brava synthetic slate and shake suit traditional Tudor and Colonial rooflines, with stone-coated steel and standing seam as strong metal alternatives, especially on newer builds. Highland Park next door has larger lots and a different scale of home, and has its own page.",

  hoaNote: "Design review and permit requirements vary by street and by project, and we handle the submission. We provide material samples, color chips, and manufacturer spec sheets for any review or HOA package at no additional cost.",

  localStat: {
    val: '$2.5M',
    label: 'Median Home Value',
    source: 'University Park, TX, Trulia, May 2026',
  },

  neighborhoods: [
    'Snider Plaza area',
    'Caruth Boulevard',
    'SMU area',
    'Hillcrest Avenue',
  ],

  nearbyCities: [
    { name: 'Highland Park',  slug: 'highland-park' },
    { name: 'Dallas',         slug: 'dallas' },
    { name: 'Lakewood',       slug: 'lakewood-dallas' },
  ],

  faqs: [
    {
      q: 'What warranty comes with a metal roof in University Park, TX?',
      a: "Workmanship is covered for 10 years on every University Park roof, and the terms are spelled out in your contract. The metal itself carries the manufacturer's material warranty for the panels and their finish. Because the roof is designed for a long service life, these warranties are there for peace of mind. Keep the paperwork with your home records for future reference.",
    },
    {
      q: 'Will a metal or Brava synthetic slate roof suit a Tudor or Colonial home?',
      a: "Yes. Brava synthetic slate and shake are made to match the traditional profiles found on Tudor and Colonial homes, and stone-coated steel is a lasting metal alternative. From the street they look like slate or shake. We bring samples to your house so you can judge color against your brick and trim.",
    },
    {
      q: 'How do you handle a roof replacement on a smaller University Park lot?',
      a: "We plan staging, material drop-off, and daily cleanup around your lot before work starts. Tight lots and close neighbors are normal here, so we agree on where equipment goes and protect landscaping and driveways. Most installs take one to three days.",
    },
    {
      q: 'Does a new roof in University Park need a permit or design review?',
      a: "Permit and design review requirements vary by project, and we handle the submission. University Park and Highland Park are separate municipalities with their own permitting, even though homeowners often think of them together as the Park Cities. We confirm what applies to your address and prepare the samples and spec sheets.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in University Park?',
      a: "A Class 4 impact rating is what carriers look for, and most Texas insurers discount roofs that have it. For a University Park home, it helps to talk with your agent before choosing a material. Every policy is different, so confirm the details with your insurance carrier before you decide.",
    },
    {
      q: 'How much does a metal or Brava synthetic slate roof cost in University Park?',
      a: "A University Park metal or Brava roof is quoted per square foot, with the final figure driven by roof size, pitch, and material. Many University Park roofs are moderate in size with several gables and dormers. You get a ballpark from satellite imagery of your own roof, not a guess from the curb, and a firm number after we inspect it in person. Compare systems in the pricing table above, and let the free visualizer work out a number for your home. Details like roof valleys and penetrations can shift the total.",
    },
    {
      q: 'How does Brava compare to DaVinci roofing?',
      a: "Brava and DaVinci both offer composite slate and shake with a published Class 4 impact rating. Tudor and Colonial homes near SMU usually look to slate or shake, and Brava also has a barrel tile profile. Our comparison lists the published specifications side by side.",
      link: { href: '/brava-vs-davinci-roofing', text: 'See the Brava and DaVinci side-by-side →' },
    },
    {
      q: "How does Brava hold up to hail in Dallas County?",
      a: "Dallas County homeowners ask about hail first, and Brava answers with a Class 4 impact rating, the highest available. Most Texas insurers discount Class 4 roofs, so mention it to your insurance carrier when you compare coverage.",
    },
    {
      q: "Does a metal roof attract lightning at my University Park home?",
      a: "The material does not raise the chance of a strike, and metal does not burn. In Dallas County, where thunderstorms are common, we are happy to go over it during your estimate.",
    },
  ],
}
