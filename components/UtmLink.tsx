'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useUtmHref } from '@/lib/useUtmHref'

// <Link> that carries the stored UTMs on internal hrefs. For server components (material pages) that can't call the hook.
export default function UtmLink({ href, ...rest }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const utm = useUtmHref()
  return <Link href={utm(href)} {...rest} />
}
