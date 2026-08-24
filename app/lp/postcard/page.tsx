import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { POSTCARD_DATA } from '@/data/landingPages/postcard'

export const metadata: Metadata = {
  title: POSTCARD_DATA.meta.title,
  description: POSTCARD_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function PostcardLandingPage() {
  return <LandingPage data={POSTCARD_DATA} />
}
