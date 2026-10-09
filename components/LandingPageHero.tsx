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
 *
 * Also fills optional {town} / {street} tokens in the eyebrow and subhead from
 * ?town= / ?street= (the neighbor page's merge values), falling back to
 * "your neighborhood" / "your street" -- text without tokens is untouched.
 */
const clean = (v: string | null) => (v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60)
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
  const town = clean(searchParams.get('town')) || 'your neighborhood'
  const street = clean(searchParams.get('street')) || 'your street'
  const fill = (t: string) => t.replace(/\{town\}/g, town).replace(/\{street\}/g, street)

  const resolvedEyebrowText = area
    ? `Mailed to homes in ${area} · Dallas–Fort Worth`
    : fill(eyebrowText)

  return <Hero eyebrowText={resolvedEyebrowText} {...heroProps} subhead={fill(heroProps.subhead)} />
}
