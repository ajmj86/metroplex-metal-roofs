/*
 * Canonical sitewide RoofingContractor declaration -- same @type as
 * CityPageSchema.tsx uses per-city, but with a single stable @id
 * (`${BASE_URL}/#business`) reused on every page that renders this
 * component, so Google's Knowledge Graph resolves them as one entity
 * rather than a new node per page (unlike the per-city schema, which
 * intentionally scopes a distinct @id to each city page).
 *
 * No `address` field: this is a service-area business with no public
 * storefront in the codebase to draw a real street address from --
 * `areaServed` is the correct schema.org mechanism for that case, not a
 * fabricated address.
 */
const BASE_URL = 'https://www.metroplexmetalroofs.com'

const CITIES = [
  'Allen', 'Anna', 'Argyle', 'Burleson', 'Celina', 'Colleyville', 'Coppell',
  'Fate', 'Flower Mound', 'Forney', 'Frisco', 'Grapevine', 'Highland Village',
  'Keller', 'Lewisville', 'Mansfield', 'McKinney', 'Midlothian', 'Northlake',
  'Plano', 'Prosper', 'Richardson', 'Roanoke', 'Rockwall', 'Royse City',
  'Southlake', 'Trophy Club', 'Waxahachie', 'Westlake',
]

export function SiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    '@id': `${BASE_URL}/#business`,
    'name': 'Metroplex Metal Roofs',
    'legalName': 'Allied Roofing Partners LLC',
    'url': `${BASE_URL}/`,
    'logo': `${BASE_URL}/logo.svg`,
    'image': `${BASE_URL}/MMR%20Hero%20Pic.png`,
    'telephone': '+18173823338',
    'email': 'help@metroplexmetalroofs.com',
    'description': 'Metroplex Metal Roofs specializes in premium metal and synthetic slate roofing for DFW homeowners -- standing seam, stone-coated steel, copper, R-panel, and synthetic slate.',
    'areaServed': CITIES.map(name => ({
      '@type': 'City',
      'name': name,
      'containedInPlace': { '@type': 'State', 'name': 'Texas' },
    })),
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Metal & Synthetic Slate Roofing Services',
      'itemListElement': [
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Standing Seam Metal Roofing', 'url': `${BASE_URL}/standing-seam-roofing` } },
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Stone-Coated Steel Roofing', 'url': `${BASE_URL}/stone-coated-steel-roofing` } },
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Copper Roofing', 'url': `${BASE_URL}/copper-roofing` } },
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'R-Panel Metal Roofing', 'url': `${BASE_URL}/r-panel-roofing` } },
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Synthetic Slate Roofing', 'url': `${BASE_URL}/synthetic-slate-roofing` } },
      ],
    },
    // sameAs is intentionally omitted, not emitted as an empty array --
    // add it here with real profile URLs once they're live (Google Business
    // Profile, Facebook, Instagram, BBB, Nextdoor, etc.):
    // 'sameAs': ['https://...', 'https://...'],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
