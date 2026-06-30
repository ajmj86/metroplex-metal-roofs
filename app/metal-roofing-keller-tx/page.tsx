import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { KELLER_DATA } from '@/data/cities/keller'

export const metadata = buildCityMetadata(KELLER_DATA)

export default function KellerPage() {
  return (
    <>
      <CitySchema city={KELLER_DATA} />
      <CityPage city={KELLER_DATA} />
    </>
  )
}
