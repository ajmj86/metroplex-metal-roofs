import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const COPPELL_DATA: CityData = {
  name: 'Coppell',
  state: 'TX',
  county: 'Dallas',
  region: 'North Dallas',
  zip: '75019',
  slug: 'coppell',
  metaTitle: 'Metal & Brava Slate Roofing Coppell TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Coppell, TX. Serving Northlake Woodlands and Riverchase.',
  heroHeadline: "Coppell Homeowners\nAre Making the Permanent Upgrade",
  heroSub: "Coppell is one of the most established and sought-after communities in North Dallas. A metal roof is the upgrade that protects that investment permanently.",
  localContext: "Coppell's well-established neighborhoods carry median home values above $550,000 and sit in Dallas County's active storm corridor. With 2% wind/hail deductibles standard across most carriers, Coppell homeowners face consistent storm-season exposure on asphalt roofs. Metal roofing eliminates that cycle and qualifies for meaningful annual insurance savings. Metal is not the only lasting choice here. Brava synthetic slate, shake, and Spanish barrel tile give Coppell homes a premium, natural-material look, and we help you compare Brava and metal side by side before you decide.",
  hoaNote: "Coppell's established neighborhoods have active HOA review processes for exterior material changes. Standing seam and stone-coated steel in approved profiles and neutral color palettes are commonly permitted. We provide complete HOA documentation support at no additional cost.",
  localStat: { val: '$560k', label: 'Median Home Value', source: 'Coppell, TX 2025' },
  neighborhoods: [
    'Northlake Woodlands', 'Parkway Estates', 'Woodlands', 'Stratford Manor',
    'Riverchase', 'Coppell Farm', 'Plantation', 'Rolling Oaks',
    'Magnolia Park', 'Ridgecrest', 'Deerfield', 'Summerfields',
  ],
  nearbyCities: [
    { name: 'Lewisville', slug: 'lewisville' },
    { name: 'Flower Mound', slug: 'flower-mound' },
    { name: 'Grapevine', slug: 'grapevine' },
    { name: 'Carrollton', slug: 'carrollton' },
    { name: 'Irving', slug: 'irving' },
  ],
  faqs: [
    {
      q: 'What warranty comes with a metal roof in Coppell, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Coppell homeowners will never need to use.',
    },
    { q: 'How much does a metal roof cost in Coppell, TX?', a: `Metal roofing in Coppell is priced by the square foot, and your total depends on roof size, pitch, and material. We provide a satellite-based ballpark range from your roof\'s measured size, not a guess from the driveway, refined into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.` },
    { q: 'Does a metal roof qualify for an insurance discount in Coppell?', a: 'Yes. Class 4 impact-rated metal roofing qualifies for significant premium discounts from most Texas carriers. Coppell homeowners with median home values above $550,000 often see the largest financial benefit from eliminating repeated deductible exposure and qualifying for annual premium reductions.' },
    { q: 'Will my Coppell HOA approve a metal roof?', a: 'Most Coppell HOAs permit standing seam and stone-coated steel in approved profiles and neutral color palettes. We provide full HOA documentation support including material samples and spec sheets at no additional cost.' },
    { q: 'How long does metal roof installation take in Coppell?', a: 'Most Coppell residential installations are completed in one to three days depending on roof size and material. We provide a specific timeline during the estimate process.' },
    { q: 'How does metal roofing handle Dallas County hail storms?', a: 'Standing seam and stone-coated steel carry a Class 4 impact resistance rating, the highest available. Dallas County\'s active storm corridor sees significant annual hail activity and Class 4 rated roofing provides strong protection while qualifying for maximum carrier discounts.' },
    { q: 'What metal and Brava roofing options are best for established Coppell homes?', a: 'Standing seam and stone-coated steel are both popular in Coppell. Stone-coated steel in shingle profiles is widely chosen for older and established homes where traditional aesthetics are important. The AI visualizer lets you see exactly what each option looks like on your actual house before you decide. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.' },
  ],
}
