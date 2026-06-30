import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ALLEN_DATA } from '@/data/cities/allen'

export const metadata = buildCityMetadata(ALLEN_DATA)

export default function AllenPage() {
  return (
    <>
      <CitySchema city={ALLEN_DATA} />
      <CityPage city={ALLEN_DATA} />
    </>
  )
}
