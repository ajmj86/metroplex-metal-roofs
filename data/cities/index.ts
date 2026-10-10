// Registry of every city page's data, so pages can derive lists from the
// data (e.g. leadWithBrava) instead of hardcoding slugs. Add new cities here.
import type { CityData } from '@/components/CityPage'
import { ALLEN_DATA } from './allen'
import { ANNA_DATA } from './anna'
import { ARGYLE_DATA } from './argyle'
import { ARLINGTON_DATA } from './arlington'
import { BLUFFVIEW_DALLAS_DATA } from './bluffview-dallas'
import { BURLESON_DATA } from './burleson'
import { CARROLLTON_DATA } from './carrollton'
import { CELINA_DATA } from './celina'
import { COLLEYVILLE_DATA } from './colleyville'
import { COPPELL_DATA } from './coppell'
import { DALLAS_DATA } from './dallas'
import { FATE_DATA } from './fate'
import { FLOWER_MOUND_DATA } from './flower-mound'
import { FORNEY_DATA } from './forney'
import { FRISCO_DATA } from './frisco'
import { GARLAND_DATA } from './garland'
import { GRAND_PRAIRIE_DATA } from './grand-prairie'
import { GRAPEVINE_DATA } from './grapevine'
import { HIGHLAND_PARK_DATA } from './highland-park'
import { HIGHLAND_VILLAGE_DATA } from './highland-village'
import { IRVING_DATA } from './irving'
import { KELLER_DATA } from './keller'
import { LAKE_HIGHLANDS_DALLAS_DATA } from './lake-highlands-dallas'
import { LAKEWOOD_DALLAS_DATA } from './lakewood-dallas'
import { LEWISVILLE_DATA } from './lewisville'
import { MANSFIELD_DATA } from './mansfield'
import { MCKINNEY_DATA } from './mckinney'
import { MESQUITE_DATA } from './mesquite'
import { MIDLOTHIAN_DATA } from './midlothian'
import { NORTHLAKE_DATA } from './northlake'
import { OAK_CLIFF_DALLAS_DATA } from './oak-cliff-dallas'
import { PLANO_DATA } from './plano'
import { PRESTON_HOLLOW_DALLAS_DATA } from './preston-hollow-dallas'
import { PROSPER_DATA } from './prosper'
import { RICHARDSON_DATA } from './richardson'
import { ROANOKE_DATA } from './roanoke'
import { ROCKWALL_DATA } from './rockwall'
import { ROYSE_CITY_DATA } from './royse-city'
import { SOUTHLAKE_DATA } from './southlake'
import { TROPHY_CLUB_DATA } from './trophy-club'
import { UNIVERSITY_PARK_DATA } from './university-park'
import { WAXAHACHIE_DATA } from './waxahachie'
import { WESTLAKE_DATA } from './westlake'

export const ALL_CITIES: CityData[] = [
  ALLEN_DATA,
  ANNA_DATA,
  ARGYLE_DATA,
  ARLINGTON_DATA,
  BLUFFVIEW_DALLAS_DATA,
  BURLESON_DATA,
  CARROLLTON_DATA,
  CELINA_DATA,
  COLLEYVILLE_DATA,
  COPPELL_DATA,
  DALLAS_DATA,
  FATE_DATA,
  FLOWER_MOUND_DATA,
  FORNEY_DATA,
  FRISCO_DATA,
  GARLAND_DATA,
  GRAND_PRAIRIE_DATA,
  GRAPEVINE_DATA,
  HIGHLAND_PARK_DATA,
  HIGHLAND_VILLAGE_DATA,
  IRVING_DATA,
  KELLER_DATA,
  LAKE_HIGHLANDS_DALLAS_DATA,
  LAKEWOOD_DALLAS_DATA,
  LEWISVILLE_DATA,
  MANSFIELD_DATA,
  MCKINNEY_DATA,
  MESQUITE_DATA,
  MIDLOTHIAN_DATA,
  NORTHLAKE_DATA,
  OAK_CLIFF_DALLAS_DATA,
  PLANO_DATA,
  PRESTON_HOLLOW_DALLAS_DATA,
  PROSPER_DATA,
  RICHARDSON_DATA,
  ROANOKE_DATA,
  ROCKWALL_DATA,
  ROYSE_CITY_DATA,
  SOUTHLAKE_DATA,
  TROPHY_CLUB_DATA,
  UNIVERSITY_PARK_DATA,
  WAXAHACHIE_DATA,
  WESTLAKE_DATA,
]
