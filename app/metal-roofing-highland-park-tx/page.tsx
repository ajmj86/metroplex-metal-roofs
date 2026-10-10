import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { HIGHLAND_PARK_DATA } from '@/data/cities/highland-park'

export const metadata = buildCityMetadata(HIGHLAND_PARK_DATA)

export default function HighlandParkPage() {
  return (
    <>
      <CitySchema city={HIGHLAND_PARK_DATA} />
      <CityPage city={HIGHLAND_PARK_DATA} />
    </>
  )
}
