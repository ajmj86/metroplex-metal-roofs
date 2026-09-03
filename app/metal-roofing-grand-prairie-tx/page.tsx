import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { GRAND_PRAIRIE_DATA } from '@/data/cities/grand-prairie'

export const metadata = buildCityMetadata(GRAND_PRAIRIE_DATA)

export default function GrandPrairiePage() {
  return (
    <>
      <CitySchema city={GRAND_PRAIRIE_DATA} />
      <CityPage city={GRAND_PRAIRIE_DATA} />
    </>
  )
}
