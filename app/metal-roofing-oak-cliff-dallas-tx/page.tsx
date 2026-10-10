import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { OAK_CLIFF_DALLAS_DATA } from '@/data/cities/oak-cliff-dallas'

export const metadata = buildCityMetadata(OAK_CLIFF_DALLAS_DATA)

export default function OakCliffDallasPage() {
  return (
    <>
      <CitySchema city={OAK_CLIFF_DALLAS_DATA} />
      <CityPage city={OAK_CLIFF_DALLAS_DATA} />
    </>
  )
}
