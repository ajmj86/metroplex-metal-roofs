import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'See Your Home With Metal or Brava | AI Visualizer | Metroplex',
  description: 'Enter your address and see a rendered image of your actual home with your chosen metal or Brava synthetic slate roof and color, before you talk to anyone or commit to anything.',
  alternates: {
    canonical: '/visualizer',
  },
}

export default function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
