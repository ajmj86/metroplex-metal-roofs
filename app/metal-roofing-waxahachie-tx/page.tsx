import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { WAXAHACHIE_DATA } from '@/data/cities/waxahachie'

export const metadata = buildCityMetadata(WAXAHACHIE_DATA)

export default function WaxahachiePage() {
  return (
    <>
      <CitySchema city={WAXAHACHIE_DATA} />
      <CityPage city={WAXAHACHIE_DATA} />
    </>
  )
}
