import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { GRAPEVINE_DATA } from '@/data/cities/grapevine'

export const metadata = buildCityMetadata(GRAPEVINE_DATA)

export default function GrapevinePage() {
  return (
    <>
      <CitySchema city={GRAPEVINE_DATA} />
      <CityPage city={GRAPEVINE_DATA} />
    </>
  )
}
