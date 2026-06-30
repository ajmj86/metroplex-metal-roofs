import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { MCKINNEY_DATA } from '@/data/cities/mckinney'

export const metadata = buildCityMetadata(MCKINNEY_DATA)

export default function McKinneyPage() {
  return (
    <>
      <CitySchema city={MCKINNEY_DATA} />
      <CityPage city={MCKINNEY_DATA} />
    </>
  )
}
