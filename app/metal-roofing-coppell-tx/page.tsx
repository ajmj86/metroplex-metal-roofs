import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { COPPELL_DATA } from '@/data/cities/coppell'

export const metadata = buildCityMetadata(COPPELL_DATA)

export default function CoppellPage() {
  return (
    <>
      <CitySchema city={COPPELL_DATA} />
      <CityPage city={COPPELL_DATA} />
    </>
  )
}
