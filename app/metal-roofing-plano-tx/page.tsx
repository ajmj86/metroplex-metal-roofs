import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { PLANO_DATA } from '@/data/cities/plano'

export const metadata = buildCityMetadata(PLANO_DATA)

export default function PlanoPage() {
  return (
    <>
      <CitySchema city={PLANO_DATA} />
      <CityPage city={PLANO_DATA} />
    </>
  )
}
