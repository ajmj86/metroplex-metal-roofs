import type { CityData } from './CityPage'

export function buildCityMetadata(city: CityData) {
  return {
    title: city.metaTitle,
    description: city.metaDesc,
    alternates: {
      canonical: `https://www.metroplexmetalroofs.com/metal-roofing-${city.slug}-tx/`,
    },
  }
}

export function CitySchema({ city }: { city: CityData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RoofingContractor',
        '@id': `https://www.metroplexmetalroofs.com/metal-roofing-${city.slug}-tx/#business`,
        'name': 'Metroplex Metal Roofs',
        'legalName': 'Allied Roofing Partners LLC',
        'url': `https://www.metroplexmetalroofs.com/metal-roofing-${city.slug}-tx/`,
        'telephone': '+18173823338',
        'description': city.metaDesc,
        'areaServed': {
          '@type': 'City',
          'name': city.name,
          'containedInPlace': { '@type': 'State', 'name': 'Texas' }
        },
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': city.name,
          'addressRegion': 'TX',
          'postalCode': city.zip,
          'addressCountry': 'US'
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Metal Roofing Services',
          'itemListElement': [
            { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Standing Seam Metal Roofing' } },
            { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Copper Roofing' } },
            { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Stone-Coated Steel Roofing' } },
            { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'R-Panel Metal Roofing' } },
          ]
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://www.metroplexmetalroofs.com/metal-roofing-${city.slug}-tx/#faq`,
        'mainEntity': city.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': faq.a }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.metroplexmetalroofs.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Service Areas', 'item': 'https://www.metroplexmetalroofs.com/service-areas/' },
          { '@type': 'ListItem', 'position': 3, 'name': `Metal Roofing ${city.name} TX`, 'item': `https://www.metroplexmetalroofs.com/metal-roofing-${city.slug}-tx/` },
        ]
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
