import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { LAKEWOOD_DALLAS_DATA } from '@/data/cities/lakewood-dallas'

export const metadata = buildCityMetadata(LAKEWOOD_DALLAS_DATA)

export default function LakewoodDallasPage() {
  return (
    <>
      <CitySchema city={LAKEWOOD_DALLAS_DATA} />
      <CityPage city={LAKEWOOD_DALLAS_DATA} />
    </>
  )
}
