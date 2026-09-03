import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ARLINGTON_DATA } from '@/data/cities/arlington'

export const metadata = buildCityMetadata(ARLINGTON_DATA)

export default function ArlingtonPage() {
  return (
    <>
      <CitySchema city={ARLINGTON_DATA} />
      <CityPage city={ARLINGTON_DATA} />
    </>
  )
}
