import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { GOOGLE_INSURANCE_DATA } from '@/data/landingPages/google-insurance'

export const metadata: Metadata = {
  title: GOOGLE_INSURANCE_DATA.meta.title,
  description: GOOGLE_INSURANCE_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function GoogleInsuranceLandingPage() {
  return <LandingPage data={GOOGLE_INSURANCE_DATA} />
}
