import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { DALLAS_DATA } from '@/data/cities/dallas'

export const metadata = buildCityMetadata(DALLAS_DATA)

export default function DallasPage() {
  return (
    <>
      <CitySchema city={DALLAS_DATA} />
      <CityPage city={DALLAS_DATA} />
    </>
  )
}
