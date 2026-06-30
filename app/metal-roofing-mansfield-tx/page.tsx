import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { MANSFIELD_DATA } from '@/data/cities/mansfield'

export const metadata = buildCityMetadata(MANSFIELD_DATA)

export default function MansfieldPage() {
  return (
    <>
      <CitySchema city={MANSFIELD_DATA} />
      <CityPage city={MANSFIELD_DATA} />
    </>
  )
}
