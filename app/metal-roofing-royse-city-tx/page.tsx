import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ROYSE_CITY_DATA } from '@/data/cities/royse-city'

export const metadata = buildCityMetadata(ROYSE_CITY_DATA)

export default function RoyseCityPage() {
  return (
    <>
      <CitySchema city={ROYSE_CITY_DATA} />
      <CityPage city={ROYSE_CITY_DATA} />
    </>
  )
}
