import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { FATE_DATA } from '@/data/cities/fate'

export const metadata = buildCityMetadata(FATE_DATA)

export default function FatePage() {
  return (
    <>
      <CitySchema city={FATE_DATA} />
      <CityPage city={FATE_DATA} />
    </>
  )
}
