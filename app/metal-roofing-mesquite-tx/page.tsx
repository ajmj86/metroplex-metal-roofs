import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { MESQUITE_DATA } from '@/data/cities/mesquite'

export const metadata = buildCityMetadata(MESQUITE_DATA)

export default function MesquitePage() {
  return (
    <>
      <CitySchema city={MESQUITE_DATA} />
      <CityPage city={MESQUITE_DATA} />
    </>
  )
}
