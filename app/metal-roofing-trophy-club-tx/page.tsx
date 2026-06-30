import { buildCityMetadata, CitySchema } from '@/components/CityPageSchema'
import CityPage from '@/components/CityPage'
import { TROPHY_CLUB_DATA } from '@/data/cities/trophy-club'

export const metadata = buildCityMetadata(TROPHY_CLUB_DATA)

export default function TrophyClubPage() {
  return (
    <>
      <CitySchema city={TROPHY_CLUB_DATA} />
      <CityPage city={TROPHY_CLUB_DATA} />
    </>
  )
}
