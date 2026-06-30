import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { CELINA_DATA } from '@/data/cities/celina'

export const metadata = buildCityMetadata(CELINA_DATA)

export default function CelinaPage() {
  return (
    <>
      <CitySchema city={CELINA_DATA} />
      <CityPage city={CELINA_DATA} />
    </>
  )
}
