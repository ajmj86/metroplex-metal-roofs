import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'See Your Home With a Metal Roof | AI Visualizer | Metroplex Metal Roofs',
  description: 'Enter your address and see a rendered image of your actual home with your chosen metal roof style and color — before you talk to anyone or commit to anything.',
}

export default function VisualizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
