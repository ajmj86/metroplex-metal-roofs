import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { GARLAND_DATA } from '@/data/cities/garland'

export const metadata = buildCityMetadata(GARLAND_DATA)

export default function GarlandPage() {
  return (
    <>
      <CitySchema city={GARLAND_DATA} />
      <CityPage city={GARLAND_DATA} />
    </>
  )
}
