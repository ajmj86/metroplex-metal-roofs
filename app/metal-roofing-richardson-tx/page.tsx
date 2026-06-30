import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { RICHARDSON_DATA } from '@/data/cities/richardson'

export const metadata = buildCityMetadata(RICHARDSON_DATA)

export default function RichardsonPage() {
  return (
    <>
      <CitySchema city={RICHARDSON_DATA} />
      <CityPage city={RICHARDSON_DATA} />
    </>
  )
}
