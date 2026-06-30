import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ROANOKE_DATA } from '@/data/cities/roanoke'

export const metadata = buildCityMetadata(ROANOKE_DATA)

export default function RoanokePage() {
  return (
    <>
      <CitySchema city={ROANOKE_DATA} />
      <CityPage city={ROANOKE_DATA} />
    </>
  )
}
