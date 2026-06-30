import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { BURLESON_DATA } from '@/data/cities/burleson'

export const metadata = buildCityMetadata(BURLESON_DATA)

export default function BurlesonPage() {
  return (
    <>
      <CitySchema city={BURLESON_DATA} />
      <CityPage city={BURLESON_DATA} />
    </>
  )
}
