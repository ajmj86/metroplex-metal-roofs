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
    q: 'What areas does Metroplex Metal Roofs serve?',
    a: 'We install metal and Brava synthetic slate roofing throughout the Dallas–Fort Worth Metroplex, including Frisco, Plano, McKinney, Southlake, Westlake, and 25+ other DFW-area cities. See our full service area list for your specific city.',
  },
  {
    q: 'What roofing materials does Metroplex Metal Roofs install?',
    a: 'We install five systems: standing seam steel, stone-coated steel, copper, R-panel, and Brava synthetic slate/tile. Standing seam is our most popular system for its hidden-fastener line and 50–70 year lifespan; stone-coated steel and Brava synthetic slate give homeowners a traditional shingle or tile profile with steel- or composite-level durability; copper is our most premium option; R-panel is the most affordable entry into metal roofing.',
  },
  {
    q: 'How much does a new roof cost with Metroplex Metal Roofs?',
    a: `Installed cost is priced per square foot and ranges from about ${FAQ_RATE.rPanel()}/sq ft for R-panel up to ${FAQ_RATE.copper()}/sq ft for copper, depending on material. See the pricing table above for a full breakdown by system. Your total depends on your roof's size, pitch, and complexity, so use our free visualizer for an exact number, refined into a firm number after a free satellite-based estimate.`,
  },
  {
    q: 'How long does a metal or Brava synthetic slate roof last?',
    a: 'Standing seam typically lasts 50–70 years and copper 100+ years, with stone-coated steel and R-panel in the 40–70 year range. Brava synthetic slate is backed by a 50-year limited warranty from Brava. All are well beyond the 15–20 year lifespan of asphalt shingles. Every system we install is Class 4 impact-rated, and every project carries a 10-year workmanship warranty.',
  },
  {
    q: 'Is a metal roof actually worth it for North Texas homes?',
    a: 'For most DFW homeowners, yes. North Texas sees frequent hail and severe wind events that make asphalt shingles a recurring expense rather than a long-term asset. Metal and Brava synthetic slate systems carry Class 4 impact ratings, often qualify for meaningful insurance discounts, and are installed once instead of replaced every 8–10 years like asphalt.',
  },
  {
    q: 'Do you offer free estimates?',
    a: 'Yes. Our Free Roof Visualizer renders your actual home in your chosen material and color and gives you a satellite-based price range in under a minute, with no photo upload required. We refine that into a firm number after a free on-site assessment, no cost or obligation at either step.',
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
