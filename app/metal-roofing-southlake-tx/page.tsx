import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { SOUTHLAKE_DATA } from '@/data/cities/southlake'

export const metadata = buildCityMetadata(SOUTHLAKE_DATA)

export default function SouthlakePage() {
  return (
    <>
      <CitySchema city={SOUTHLAKE_DATA} />
      <CityPage city={SOUTHLAKE_DATA} />
    </>
  )
}
