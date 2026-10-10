import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const IRVING_DATA: CityData = {
  name: 'Irving',
  state: 'TX',
  county: 'Dallas',
  region: 'Mid-Cities',
  zip: '75039',
  slug: 'irving',
  metaTitle: 'Metal & Brava Synthetic Slate Roofing Irving TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Irving, TX. Serving Las Colinas and Valley Ranch.',

  heroHeadline: "Irving Homes Built Around\nLakes and Canals Deserve a Roof to Match",
  heroSub: "From the high-end towers of Las Colinas to the family neighborhoods of Valley Ranch and the Heritage District, Irving homeowners are moving past asphalt for good.",

  localContext: "Irving's housing stock spans nearly every era of DFW development, from Heritage District homes built decades before Las Colinas existed to the master-planned communities of Valley Ranch and the canal-front properties near Lake Carolyn. That range means Irving sees more roofing variety than most nearby cities, but the underlying problem is the same everywhere: Dallas County's hail corridor doesn't spare Irving, and asphalt shingles rated for 15 to 20 years routinely fail well before that in real storm seasons. Metal is not the only lasting choice here. Brava synthetic slate, shake, and Spanish barrel tile give Irving homes a premium, natural-material look, and we help you compare Brava and metal side by side before you decide.",

  hoaNote: "Las Colinas and Valley Ranch both maintain active HOAs with architectural review for exterior changes, and metal roofing in approved profiles is already common throughout both communities. Older Heritage District and Northgate Heights homes typically fall outside HOA jurisdiction. We provide full documentation: material samples, color chips, and manufacturer spec sheets, to support any required HOA submission at no additional cost.",

  localStat: {
    val: '$395k',
    label: 'Median Home Value',
    source: 'Irving, TX 2025',
  },

  neighborhoods: [
    'Las Colinas',
    'Valley Ranch',
    'Heritage District',
    'Hospital District',
    'Northgate Heights',
  ],

  nearbyCities: [
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Grand Prairie', slug: 'grand-prairie' },
    { name: 'Coppell', slug: 'coppell' },
    { name: 'Carrollton', slug: 'carrollton' },
  ],


  faqs: [
    {
      q: 'What warranty comes with a metal roof in Irving, TX?',
      a: "The paperwork for an Irving roof starts with a 10-year workmanship warranty, written into the contract. Panels and finish are covered separately by the manufacturer's material warranty. Paired with a roof designed for a long service life, it is coverage built for peace of mind. We can send the warranty documents ahead of time if you would like to read them.",
    },
    {
      q: 'How much does a metal roof cost in Irving?',
      a: "Metal roofs in Irving are priced per square foot, so the biggest factors are how much roof you have, how steep it is, and the material. Las Colinas and Valley Ranch homes tend to run toward a higher overall cost given typical roof size. Our first number comes from satellite measurements of your actual roof, and the firm price follows your free on-site assessment. Our pricing table above has the full breakdown, and the free visualizer shows a number for your own roof. Details like roof valleys and penetrations can shift the total.",
    },
    {
      q: 'Will my Las Colinas or Valley Ranch HOA approve a metal roof?',
      a: "Many associations accept metal in approved profiles and colors; we confirm yours. Las Colinas and Valley Ranch each have their own review process, and we prepare the submission for you. Some Irving neighborhoods have no HOA at all.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Irving?',
      a: "It can. Class 4 impact-rated metal is discounted by most Texas insurers, which helps offset the cost of a new roof. Irving homeowners often start with the insurance question after a hail season. The size of the discount depends on your carrier and policy, so check with your insurance carrier.",
    },
    {
      q: 'How long does metal roof installation take in Irving?',
      a: "For a typical Irving home the work takes about one to three days, depending on how big and complex the roof is. Communities with HOA staging or access requirements, like parts of Las Colinas, may need a bit more coordination, which we handle as part of scheduling. During the estimate we map out the days your roof will take, so there are no surprises. Your project lead checks in each day so you know where things stand.",
    },
    {
      q: "What metal and Brava roofing style suits Irving homes?",
      a: "Whatever your Irving home's architecture, there is a metal or Brava profile to suit it. Standing seam is the most common choice in Las Colinas and Valley Ranch given the more contemporary architecture found there, while stone-coated steel suits the traditional ranch-style homes in the Heritage District and Northgate Heights. For the look of natural slate, shake, or tile, Brava offers three profiles in a durable composite. Both steel systems carry a Class 4 impact rating, and we bring samples so you can compare them on your own home.",
    },
    {
      q: 'Is metal roofing common on Irving homes near Lake Carolyn and the canals?',
      a: "Standing seam suits homes near Lake Carolyn and the Las Colinas canals, where owners value its clean architectural lines and a roof built for storm exposure. We can show it on your own home in the Free Roof Visualizer.",
    },
    {
      q: "Will hail dent a metal roof in Dallas County?",
      a: "A Class 4 impact rating is available on metal, though very large hail can leave cosmetic marks on certain finishes. Smooth panels show marks more readily than textured stone-coated steel. Hail seasons in Irving make finish choice a fair question to bring to your inspection.",
    },
  ],
}
