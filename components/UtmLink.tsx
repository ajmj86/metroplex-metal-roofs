'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useUtmHref } from '@/lib/useUtmHref'
import { trackVisualizerCta } from '@/lib/analytics'

// <Link> that carries the stored UTMs on internal hrefs. For server components (material pages) that can't call the hook.
// Pass ctaLocation on links to /visualizer to fire visualizer_cta_click (a server component can't pass an onClick).
export default function UtmLink({ href, ctaLocation, onClick, ...rest }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string; ctaLocation?: string }) {
  const utm = useUtmHref()
  return (
    <Link
      href={utm(href)}
      onClick={e => {
        if (ctaLocation) trackVisualizerCta(ctaLocation, href)
        onClick?.(e)
      }}
      {...rest}
    />
  )
}
