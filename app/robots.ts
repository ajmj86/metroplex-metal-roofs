import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.metroplexmetalroofs.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Covers the whole /lp/ prefix, so every future channel landing page
      // (Google Ads, YouTube, Facebook/Instagram, ...) is excluded
      // automatically without a robots.ts change per channel.
      disallow: '/lp/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
