'use client'

import { useCallback, useEffect, useState } from 'react'
import { readStoredUtm, UTM_UPDATED_EVENT, withUtm, type StoredUtm } from '@/lib/utm'

/**
 * Returns a function that appends the visitor's stored UTMs (and fbclid/gclid) to an INTERNAL href. Use it for header/nav links and
 * every CTA button; never for external links (withUtm leaves those alone). Starts empty so server and first client render match,
 * then fills from sessionStorage/cookie after mount and whenever UTMCapture stores new values.
 */
export function useUtmHref() {
  const [stored, setStored] = useState<StoredUtm>({})
  useEffect(() => {
    const sync = () => setStored(readStoredUtm())
    sync()
    window.addEventListener(UTM_UPDATED_EVENT, sync)
    return () => window.removeEventListener(UTM_UPDATED_EVENT, sync)
  }, [])
  return useCallback((href: string) => withUtm(href, stored), [stored])
}
