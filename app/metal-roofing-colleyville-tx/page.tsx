import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { COLLEYVILLE_DATA } from '@/data/cities/colleyville'

export const metadata = buildCityMetadata(COLLEYVILLE_DATA)

export default function ColleyvillePage() {
  return (
    <>
      <CitySchema city={COLLEYVILLE_DATA} />
      <CityPage city={COLLEYVILLE_DATA} />
    </>
  )
}
