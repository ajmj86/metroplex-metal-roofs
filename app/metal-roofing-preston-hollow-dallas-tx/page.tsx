import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { PRESTON_HOLLOW_DALLAS_DATA } from '@/data/cities/preston-hollow-dallas'

export const metadata = buildCityMetadata(PRESTON_HOLLOW_DALLAS_DATA)

export default function PrestonHollowDallasPage() {
  return (
    <>
      <CitySchema city={PRESTON_HOLLOW_DALLAS_DATA} />
      <CityPage city={PRESTON_HOLLOW_DALLAS_DATA} />
    </>
  )
}
