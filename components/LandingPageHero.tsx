'use client'

import { useSearchParams } from 'next/navigation'
import Hero from '@/components/Hero'

/*
 * Thin wiring, not a second hero implementation: resolves the one thing a
 * landing page needs that Homepage.jsx doesn't (swapping the eyebrow line
 * for "Mailed to homes in {area} · Dallas–Fort Worth" when the URL carries
 * an ?area= param) into a plain string, then renders the exact same <Hero>
 * Homepage.jsx renders. All the actual hero structure/JSX lives in Hero.tsx
 * alone.
 */
export default function LandingPageHero({
  eyebrowText,
  ...heroProps
}: {
  eyebrowText: string
  headline: string
  headlineAccent?: string
  subhead: string
  ctaLabel: string
  ctaHref: string
  microcopy?: string
  trustBullets?: string[]
  trustBulletFootnote?: string
  backgroundImageSrc: string
}) {
  const searchParams = useSearchParams()
  const area = searchParams.get('area')

  const resolvedEyebrowText = area
    ? `Mailed to homes in ${area} · Dallas–Fort Worth`
    : eyebrowText

  return <Hero eyebrowText={resolvedEyebrowText} {...heroProps} />
}
