import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ARGYLE_DATA } from '@/data/cities/argyle'

export const metadata = buildCityMetadata(ARGYLE_DATA)

export default function ArgylePage() {
  return (
    <>
      <CitySchema city={ARGYLE_DATA} />
      <CityPage city={ARGYLE_DATA} />
    </>
  )
}
