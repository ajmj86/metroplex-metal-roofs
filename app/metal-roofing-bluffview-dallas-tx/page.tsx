import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { BLUFFVIEW_DALLAS_DATA } from '@/data/cities/bluffview-dallas'

export const metadata = buildCityMetadata(BLUFFVIEW_DALLAS_DATA)

export default function BluffviewDallasPage() {
  return (
    <>
      <CitySchema city={BLUFFVIEW_DALLAS_DATA} />
      <CityPage city={BLUFFVIEW_DALLAS_DATA} />
    </>
  )
}
