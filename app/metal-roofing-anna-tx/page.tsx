import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ANNA_DATA } from '@/data/cities/anna'

export const metadata = buildCityMetadata(ANNA_DATA)

export default function AnnaPage() {
  return (
    <>
      <CitySchema city={ANNA_DATA} />
      <CityPage city={ANNA_DATA} />
    </>
  )
}
