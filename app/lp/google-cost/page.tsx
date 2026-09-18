import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { GOOGLE_COST_DATA } from '@/data/landingPages/google-cost'

export const metadata: Metadata = {
  title: GOOGLE_COST_DATA.meta.title,
  description: GOOGLE_COST_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function GoogleCostLandingPage() {
  return <LandingPage data={GOOGLE_COST_DATA} />
}
