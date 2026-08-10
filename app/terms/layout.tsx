import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Metroplex Metal Roofs',
  description: 'Terms of Service governing your use of the Metroplex Metal Roofs website and roofing services in the Dallas–Fort Worth area.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
