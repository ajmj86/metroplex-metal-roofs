import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { CARROLLTON_DATA } from '@/data/cities/carrollton'

export const metadata = buildCityMetadata(CARROLLTON_DATA)

export default function CarrolltonPage() {
  return (
    <>
      <CitySchema city={CARROLLTON_DATA} />
      <CityPage city={CARROLLTON_DATA} />
    </>
  )
}
