import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.metroplexmetalroofs.com'

// Single source of truth for the slug half of every /metal-roofing-{slug}-tx
// route — keep in sync with the app/metal-roofing-*-tx directories (one
// per city). Deliberately not derived from the filesystem at build time:
// this file has to stay a plain, dependency-free MetadataRoute.Sitemap
// export for the Next.js sitemap convention, and a static list is easy to
// diff against `ls app | grep metal-roofing-` when a city is added/removed.
const CITY_SLUGS = [
  'allen', 'anna', 'argyle', 'burleson', 'celina', 'colleyville', 'coppell',
  'fate', 'flower-mound', 'forney', 'frisco', 'grapevine', 'highland-village',
  'keller', 'lewisville', 'mansfield', 'mckinney', 'midlothian', 'northlake',
  'plano', 'prosper', 'richardson', 'roanoke', 'rockwall', 'royse-city',
  'southlake', 'trophy-club', 'waxahachie', 'westlake',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/visualizer`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/synthetic-slate-roofing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/standing-seam-roofing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/stone-coated-steel-roofing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/copper-roofing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/r-panel-roofing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const cityRoutes: MetadataRoute.Sitemap = CITY_SLUGS.map(slug => ({
    url: `${BASE_URL}/metal-roofing-${slug}-tx`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...cityRoutes]
}
