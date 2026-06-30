import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { NORTHLAKE_DATA } from '@/data/cities/northlake'

export const metadata = buildCityMetadata(NORTHLAKE_DATA)

export default function NorthlakePage() {
  return (
    <>
      <CitySchema city={NORTHLAKE_DATA} />
      <CityPage city={NORTHLAKE_DATA} />
    </>
  )
}
