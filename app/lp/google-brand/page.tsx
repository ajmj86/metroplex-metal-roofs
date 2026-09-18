import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { GOOGLE_BRAND_DATA } from '@/data/landingPages/google-brand'

export const metadata: Metadata = {
  title: GOOGLE_BRAND_DATA.meta.title,
  description: GOOGLE_BRAND_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function GoogleBrandLandingPage() {
  return <LandingPage data={GOOGLE_BRAND_DATA} />
}
