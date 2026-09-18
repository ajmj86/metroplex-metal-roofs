import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { GOOGLE_MATERIALS_DATA } from '@/data/landingPages/google-materials'

export const metadata: Metadata = {
  title: GOOGLE_MATERIALS_DATA.meta.title,
  description: GOOGLE_MATERIALS_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function GoogleMaterialsLandingPage() {
  return <LandingPage data={GOOGLE_MATERIALS_DATA} />
}
