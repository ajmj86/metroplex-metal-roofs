import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const MESQUITE_DATA: CityData = {
  name: 'Mesquite',
  state: 'TX',
  county: 'Dallas',
  region: 'East Dallas',
  zip: '75150',
  slug: 'mesquite',
  metaTitle: 'Metal & Brava Slate Roofing Mesquite TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Mesquite, TX. Serving Town East Estates and Solterra.',

  heroHeadline: "Mesquite Homes Have Weathered\nEnough Hail Seasons on Asphalt",
  heroSub: "From Town East Estates to the newer builds in Solterra, Mesquite homeowners are switching to a roof that outlasts the storm cycle instead of getting replaced by it.",

  localContext: "Mesquite's established East Dallas neighborhoods carry some of the area's oldest roofing stock, much of it already replaced once with asphalt after prior hail seasons. Dallas County's hail corridor runs directly through Mesquite, and with newer master-planned communities like Solterra bringing a wave of new construction to the city, metal roofing is increasingly the default choice for homeowners who don't want to repeat a reroof cycle every 12 to 15 years. Metal is not the only lasting choice here. Brava synthetic slate, shake, and Spanish barrel tile give Mesquite homes a premium, natural-material look, and we help you compare Brava and metal side by side before you decide.",

  hoaNote: "Solterra maintains an active HOA with standard architectural review for exterior changes, and metal roofing in approved profiles is already common in the community. Older neighborhoods like Town East Estates and Casa View Heights typically have no HOA restrictions. Where documentation is required, we provide material samples, color chips, and manufacturer spec sheets at no additional cost.",

  localStat: {
    val: '$255k',
    label: 'Median Home Value',
    source: 'Mesquite, TX 2025',
  },

  neighborhoods: [
    "Town East Estates",
    'Casa View Heights',
    'Highland Hills',
    "Falcon's Lair",
    'Solterra',
    'Downtown Mesquite',
  ],

  nearbyCities: [
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Garland', slug: 'garland' },
    { name: 'Forney', slug: 'forney' },
  ],


  faqs: [
    {
      q: 'What warranty comes with a metal roof in Mesquite, TX?',
      a: "The paperwork for a Mesquite roof starts with a 10-year workmanship warranty, written into the contract. On top of that, the product maker stands behind its panels and coatings with a material warranty. We are glad to explain both documents before any work begins. Your project lead explains what each covers on installation day.",
    },
    {
      q: 'How much does a metal roof cost in Mesquite?',
      a: "Metal roofs in Mesquite are priced per square foot, so the biggest factors are how much roof you have, how steep it is, and the material. You get a ballpark from satellite imagery of your own roof, not a guess from the curb, and a firm number after we inspect it in person. See the pricing table above for every material, or run our free visualizer for a figure specific to your house. Our assessment checks the decking and details that affect the price.",
    },
    {
      q: 'Is metal roofing common in newer Mesquite developments like Solterra?',
      a: "Many associations accept metal in approved profiles and colors; we confirm yours. Reroofing owners in newer areas like Solterra face the same Dallas County hail season as the rest of the city.",
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Mesquite?',
      a: "It can. Class 4 impact-rated metal is discounted by most Texas insurers, which helps offset the cost of a new roof. Across Dallas County, the premium conversation is a common reason to look at Class 4 roofing. Every policy is different, so confirm the details with your insurance carrier before you decide.",
    },
    {
      q: 'Will my Mesquite HOA approve a metal roof?',
      a: "HOA rules in Mesquite differ by neighborhood, and many associations permit metal or Brava in neutral, approved colors. Neighborhoods across Mesquite each have their own review process. We can supply everything the committee asks for, from color chips to manufacturer specifications, at no additional cost.",
    },
    {
      q: 'How long does metal roof installation take in Mesquite?',
      a: "Expect one to three days on site for most homes in Mesquite, based on the size and layout of the roof. A schedule tailored to your home comes with the proposal, well before installation day. Weather can shift the schedule slightly, and we keep you updated.",
    },
    {
      q: "What metal and Brava roofing style suits Mesquite homes?",
      a: "A Mesquite roof can take several looks: standing seam panels, stone-coated steel, or one of three Brava profiles. Stone-coated steel is a strong match for the traditional ranch homes common in Town East Estates, while standing seam suits the more contemporary builds going up in Solterra. For the look of natural slate, shake, or tile, Brava offers three profiles in a durable composite. We are happy to compare options side by side during your free assessment.",
    },
    {
      q: "Is a metal roof louder than shingles in a Mesquite rainstorm?",
      a: "Rain on a metal roof is not noticeably louder than on shingles when there is a solid deck, underlayment, and attic insulation underneath. What people remember is the sound of a shed or barn with bare metal and no deck. Your attic insulation also helps keep the sound familiar.",
    },
  ],
}
