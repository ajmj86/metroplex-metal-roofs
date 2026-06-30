import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { FLOWER_MOUND_DATA } from '@/data/cities/flower-mound'

export const metadata = buildCityMetadata(FLOWER_MOUND_DATA)

export default function FlowerMoundPage() {
  return (
    <>
      <CitySchema city={FLOWER_MOUND_DATA} />
      <CityPage city={FLOWER_MOUND_DATA} />
    </>
  )
}
