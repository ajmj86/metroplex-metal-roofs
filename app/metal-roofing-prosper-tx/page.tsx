import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { PROSPER_DATA } from '@/data/cities/prosper'

export const metadata = buildCityMetadata(PROSPER_DATA)

export default function ProsperPage() {
  return (
    <>
      <CitySchema city={PROSPER_DATA} />
      <CityPage city={PROSPER_DATA} />
    </>
  )
}
