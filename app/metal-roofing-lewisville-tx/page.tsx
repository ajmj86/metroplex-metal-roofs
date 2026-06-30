import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { LEWISVILLE_DATA } from '@/data/cities/lewisville'

export const metadata = buildCityMetadata(LEWISVILLE_DATA)

export default function LewisvillePage() {
  return (
    <>
      <CitySchema city={LEWISVILLE_DATA} />
      <CityPage city={LEWISVILLE_DATA} />
    </>
  )
}
