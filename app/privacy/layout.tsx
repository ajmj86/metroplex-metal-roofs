import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Metroplex Metal Roofs',
  description: 'How Metroplex Metal Roofs collects, uses, and protects your information when you visit our site, request an estimate, or use our AI roof visualizer.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
