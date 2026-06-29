import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { FRISCO_DATA } from '@/data/cities/frisco'

export const metadata = buildCityMetadata(FRISCO_DATA)

export default function FriscoPage() {
  return (
    <>
      <CitySchema city={FRISCO_DATA} />
      <CityPage city={FRISCO_DATA} />
    </>
  )
}
