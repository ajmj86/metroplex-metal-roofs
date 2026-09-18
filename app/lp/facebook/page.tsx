import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { FACEBOOK_DATA } from '@/data/landingPages/facebook'

export const metadata: Metadata = {
  title: FACEBOOK_DATA.meta.title,
  description: FACEBOOK_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function FacebookLandingPage() {
  return <LandingPage data={FACEBOOK_DATA} />
}
