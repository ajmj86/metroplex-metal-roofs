import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { WESTLAKE_DATA } from '@/data/cities/westlake'

export const metadata = buildCityMetadata(WESTLAKE_DATA)

export default function WestlakePage() {
  return (
    <>
      <CitySchema city={WESTLAKE_DATA} />
      <CityPage city={WESTLAKE_DATA} />
    </>
  )
}
