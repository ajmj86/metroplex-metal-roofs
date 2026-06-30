import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { HIGHLAND_VILLAGE_DATA } from '@/data/cities/highland-village'

export const metadata = buildCityMetadata(HIGHLAND_VILLAGE_DATA)

export default function HighlandVillagePage() {
  return (
    <>
      <CitySchema city={HIGHLAND_VILLAGE_DATA} />
      <CityPage city={HIGHLAND_VILLAGE_DATA} />
    </>
  )
}
