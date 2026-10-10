import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { UNIVERSITY_PARK_DATA } from '@/data/cities/university-park'

export const metadata = buildCityMetadata(UNIVERSITY_PARK_DATA)

export default function UniversityParkPage() {
  return (
    <>
      <CitySchema city={UNIVERSITY_PARK_DATA} />
      <CityPage city={UNIVERSITY_PARK_DATA} />
    </>
  )
}
