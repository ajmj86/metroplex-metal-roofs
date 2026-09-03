import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { IRVING_DATA } from '@/data/cities/irving'

export const metadata = buildCityMetadata(IRVING_DATA)

export default function IrvingPage() {
  return (
    <>
      <CitySchema city={IRVING_DATA} />
      <CityPage city={IRVING_DATA} />
    </>
  )
}
