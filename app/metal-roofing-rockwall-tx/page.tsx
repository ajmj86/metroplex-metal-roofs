import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { ROCKWALL_DATA } from '@/data/cities/rockwall'

export const metadata = buildCityMetadata(ROCKWALL_DATA)

export default function RockwallPage() {
  return (
    <>
      <CitySchema city={ROCKWALL_DATA} />
      <CityPage city={ROCKWALL_DATA} />
    </>
  )
}
