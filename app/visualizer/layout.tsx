import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'See Your Home in Metal or Brava | Metroplex Visualizer',
  description: 'See your actual home with a metal or Brava synthetic slate roof in your chosen style and color, before you talk to anyone or commit to anything.',
  alternates: {
    canonical: '/visualizer',
  },
}

export default function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
