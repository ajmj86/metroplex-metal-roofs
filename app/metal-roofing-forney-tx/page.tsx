import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { FORNEY_DATA } from '@/data/cities/forney'

export const metadata = buildCityMetadata(FORNEY_DATA)

export default function ForneyPage() {
  return (
    <>
      <CitySchema city={FORNEY_DATA} />
      <CityPage city={FORNEY_DATA} />
    </>
  )
}
