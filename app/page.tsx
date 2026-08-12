import Homepage from '@/components/Homepage'
import { SiteSchema } from '@/components/SiteSchema'
import { HomeFAQSchema } from '@/components/HomeFAQSchema'

export default function Home() {
  return (
    <>
      <SiteSchema />
      <HomeFAQSchema />
      <Homepage />
    </>
  )
}
