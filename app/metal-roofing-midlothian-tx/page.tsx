import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { MIDLOTHIAN_DATA } from '@/data/cities/midlothian'

export const metadata = buildCityMetadata(MIDLOTHIAN_DATA)

export default function MidlothianPage() {
  return (
    <>
      <CitySchema city={MIDLOTHIAN_DATA} />
      <CityPage city={MIDLOTHIAN_DATA} />
    </>
  )
}
