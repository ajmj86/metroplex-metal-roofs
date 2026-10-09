import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { NEIGHBOR_DATA } from '@/data/landingPages/neighbor'

export const metadata: Metadata = {
  title: NEIGHBOR_DATA.meta.title,
  description: NEIGHBOR_DATA.meta.description,
  robots: { index: false, follow: false },
}

export default function NeighborLandingPage() {
  return <LandingPage data={NEIGHBOR_DATA} />
}
