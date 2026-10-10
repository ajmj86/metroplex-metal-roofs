/*
 * Homepage-level FAQ data + JSON-LD, kept separate from SiteSchema.tsx
 * (which renders on both the homepage and /about) because this FAQPage
 * schema's content is homepage-specific -- rendering it on /about too would
 * mean structured data that doesn't match that page's actual visible
 * content, which is exactly the kind of markup/content mismatch schema.org
 * guidelines warn against. Only app/page.tsx renders <HomeFAQSchema/>.
 *
 * HOME_FAQS is the single source for both the visible FAQ section
 * (rendered in Homepage.jsx) and this JSON-LD, same pattern as
 * FAQS.map(...) in synthetic-slate-roofing/page.tsx and
 * city.faqs.map(...) in CityPageSchema.tsx -- one array, no drift.
 */
import { FAQ_RATE } from '@/lib/pricingData'

export interface HomeFAQ {
  q: string
  a: string
}

export const HOME_FAQS: HomeFAQ[] = [
  {
    q: 'What roofing materials does Metroplex Metal Roofs install?',
    a: 'We install five systems: standing seam steel, stone-coated steel, copper, R-panel, and Brava synthetic slate/tile. Standing seam is our most popular system for its hidden-fastener line and 50–70 year lifespan; stone-coated steel and Brava synthetic slate give homeowners a traditional shingle or tile profile with steel- or composite-level durability; copper is our most premium option; R-panel is the most affordable entry into metal roofing.',
  },
  {
    q: 'How much does a new roof cost with Metroplex Metal Roofs?',
    a: `Installed cost is priced per square foot and ranges from about ${FAQ_RATE.rPanel()}/sq ft for R-panel up to ${FAQ_RATE.copper()}/sq ft for copper, depending on material. See the pricing table above for a full breakdown by system. Your total depends on your roof's size, pitch, and complexity, so use our free visualizer for an exact number, refined into a firm number after a free satellite-based estimate.`,
  },
  {
    q: 'Do you offer free estimates?',
    a: 'Yes. Our Free Roof Visualizer renders your actual home in your chosen material and color and gives you a satellite-based price range in under a minute, with no photo upload required. We refine that into a firm number after a free on-site assessment, no cost or obligation at either step.',
  },
  {
    q: 'Is a metal roof louder in the rain or hail?',
    a: 'Not when it is installed over a solid deck with underlayment and attic insulation, where rain sounds about the same as it does on shingles. The loud reputation comes from barns and sheds, which have no deck under the metal. Your deck, underlayment, and insulation do most of the work.',
  },
  {
    q: 'Does a metal roof attract lightning?',
    a: 'No. A metal roof does not make a home more likely to be struck by lightning, and metal does not burn. Storm questions are welcome at your inspection.',
  },
  {
    q: 'Will a metal roof affect my cell or Wi-Fi signal?',
    a: 'Metal roofs generally have little effect on cell or Wi-Fi signal inside the home. In areas where signal is already weak, a signal booster helps. We cannot promise results for every property.',
  },
  {
    q: 'Does Brava synthetic slate fade over time?',
    a: 'Brava uses mineral pigments, and the color runs through the full thickness of each tile rather than sitting on the surface. All outdoor materials change a little with sun and weather over the years. We can show you samples in daylight during your inspection.',
  },
  {
    q: 'Will Brava synthetic slate curl, crack, or warp?',
    a: 'Brava tiles are compression molded and carry a Class 4 impact rating. Curling, warping, and cracking are usually tied to installation, and installing to Brava\'s published installation guide is what prevents them, which is how we install every Brava roof.',
  },
  {
    q: 'Does a metal or Brava roof lower my insurance premium?',
    a: 'It can, because most Texas insurers discount Class 4 roofs, and both metal and Brava are available with that rating. The discount depends on your carrier and policy, so check with your insurance carrier. We can provide product documentation your agent may ask for.',
  },
  {
    q: 'Is a metal or Brava roof worth the cost over asphalt?',
    a: 'For many homeowners, yes: they choose these roofs for long life, low maintenance, and the Class 4 rating. The right choice depends on how long you plan to stay in the home. We are happy to talk through your situation with no obligation.',
  },
]

const BASE_URL = 'https://www.metroplexmetalroofs.com'

export function HomeFAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/#faq`,
    'mainEntity': HOME_FAQS.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
