import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { LAKE_HIGHLANDS_DALLAS_DATA } from '@/data/cities/lake-highlands-dallas'

export const metadata = buildCityMetadata(LAKE_HIGHLANDS_DALLAS_DATA)

export default function LakeHighlandsDallasPage() {
  return (
    <>
      <CitySchema city={LAKE_HIGHLANDS_DALLAS_DATA} />
      <CityPage city={LAKE_HIGHLANDS_DALLAS_DATA} />
    </>
  )
}
