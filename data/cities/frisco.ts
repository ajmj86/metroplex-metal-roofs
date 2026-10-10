import { cityFaqMaterialRates } from '@/lib/pricingData'
import type { CityData } from '@/components/CityPage'

export const FRISCO_DATA: CityData = {
  name: 'Frisco',
  state: 'TX',
  county: 'Collin',
  region: 'North Dallas',
  zip: '75034',
  slug: 'frisco',
  metaTitle: 'Metal & Brava Synthetic Slate Roofing Frisco TX | Metroplex',
  metaDesc: 'Premium standing seam, stone-coated steel & Brava synthetic slate roofing in Frisco, TX. Serving Starwood, Newman Village & Phillips Creek Ranch.',

  heroHeadline: "Frisco Homes Deserve\na Permanent Roof",
  heroSub: "From Starwood to Phillips Creek Ranch, Frisco homeowners are done with the asphalt replacement cycle. One metal roof that outlasts the neighborhood and everything the North Texas sky throws at it.",

  localContext: "Frisco sits in Collin County's most active hail corridor, where rapid growth has brought premium construction standards alongside significant storm exposure. With median home values climbing past $650,000 and 2% wind/hail deductibles now standard across most carriers, a single hail event can mean $13,000 or more out of pocket, a number that resets every time asphalt shingles fail. Metal roofing has become the standard on new construction throughout Frisco's master-planned communities for exactly this reason. Homeowners who want the look of natural slate, shake, or tile have an equally strong option in Brava synthetic slate, which we install alongside standing seam and stone-coated steel for homes in communities like Starwood and Phillips Creek Ranch.",

  hoaNote: "Frisco's master-planned communities, including Phillips Creek Ranch, Newman Village, and Starwood, typically require HOA approval for roofing material changes. Stone-coated steel and standing seam in earth-tone and neutral color palettes are the most commonly approved metal options. We provide material samples, color chips, and full spec documentation to support your HOA submission at no additional cost.",

  localStat: {
    val: '$650k',
    label: 'Median Home Value',
    source: 'Frisco, TX 2025',
  },

  neighborhoods: [
    'Starwood',
    'Phillips Creek Ranch',
    'Newman Village',
    'Hillcrest',
    'The Trails of West Frisco',
    'Frisco Lakes',
    'Eldorado Heights',
    'Richwoods',
    'Lexington',
    'Villages of Stonelake',
    'Plantation Resort',
    'Creekside at Preston',
  ],

  nearbyCities: [
    { name: 'Prosper',       slug: 'prosper' },
    { name: 'McKinney',      slug: 'mckinney' },
    { name: 'Allen',         slug: 'allen' },
    { name: 'Plano',         slug: 'plano' },
    { name: 'Celina',        slug: 'celina' },
  ],


  faqs: [
    {
      q: 'What warranty comes with a metal roof in Frisco, TX?',
      a: 'Every roof we install is covered by a 10-year workmanship warranty, written into your contract, plus the manufacturer\'s material warranty on the panels and finish. Combined with a 50+ year system lifespan, that means coverage most Frisco homeowners will never need to use.',
    },
    {
      q: 'How much does a metal roof cost in Frisco, TX?',
      a: `Metal roofing in Frisco is priced by the square foot, and your total depends on roof size, pitch, material selection, and complexity. Most homes in Frisco\'s master-planned communities fall in the 25 to 40 square range. We provide satellite-based estimates built from your roof\'s satellite-measured size, no site visit required to get a ballpark range, which we refine into a firm number after your free on-site assessment. By material, that typically breaks down to ${cityFaqMaterialRates()}. See our pricing table above for the full breakdown, or use our free visualizer for an exact number for your roof.`,
    },
    {
      q: 'Will my Frisco HOA approve a metal roof?',
      a: 'Most Frisco HOAs approve stone-coated steel and standing seam metal roofing in pre-approved color palettes. Communities including Phillips Creek Ranch, Newman Village, and Starwood have approved metal roofing for homeowners who submitted the proper documentation. We provide material samples, color chips, and manufacturer spec sheets to support your HOA submission at no cost.',
    },
    {
      q: 'Does a metal roof qualify for an insurance discount in Collin County?',
      a: 'Yes. Standing seam and stone-coated steel carry a Class 4 impact resistance rating, the highest available, which qualifies for significant premium discounts from most Texas carriers. Collin County homeowners in active hail zones like Frisco typically see 15–35% reductions on their wind/hail premium after upgrading to a Class 4 rated roof, depending on carrier and policy.',
    },
    {
      q: 'How long does metal roof installation take in Frisco?',
      a: 'Most residential metal roofing installations in Frisco are completed in one to three days depending on roof size and complexity. Standing seam typically takes a day longer than stone-coated steel due to the on-site forming process. We provide a specific timeline estimate for your home before any work begins.',
    },
    {
      q: 'Is a metal roof worth it for a home in a Frisco master-planned community?',
      a: 'For homes in the $500K–$900K range common across Frisco\'s master-planned communities, the economics strongly favor metal. Eliminating repeated asphalt replacement cycles, qualifying for insurance discounts, and reducing cooling costs over 30 years means the upgrade typically pays for itself, while adding a permanent, low-maintenance finish that holds up to North Texas storms.',
    },
    {
      q: 'What metal and Brava roofing styles work best on Frisco homes?',
      a: 'Standing seam is the most popular choice for Frisco\'s contemporary and transitional architecture, offering clean lines and hidden fasteners. Stone-coated steel in shake or shingle profiles is widely chosen in neighborhoods with traditional HOA guidelines. Both carry Class 4 hail ratings and 50+ year lifespans, so the choice comes down to aesthetics and HOA requirements. Brava synthetic slate, shake, and Spanish barrel tile are also available, and suit homes where you want the look of natural slate, shake, or tile. We bring samples of metal and Brava so you can compare them on your own home.',
    },
  ],
}
