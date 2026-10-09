'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CAPTURE_KEYS, readStoredUtm, writeStoredUtm, type StoredUtm } from '@/lib/utm'

// Captures utm_* (plus fbclid, gclid and the QR "area") from the URL into sessionStorage and mirrors them into the first-party
// mmr_utm cookie (30 days). When the URL carries none, it restores sessionStorage from that cookie so attribution survives a
// new tab or a return visit. `area` is not a UTM param: it carries the neighborhood name a landing page's QR destination was
// generated for (see HeroEyebrowLine.tsx).
export default function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const captured: StoredUtm = {}
    for (const k of CAPTURE_KEYS) {
      const v = searchParams.get(k)
      if (v) captured[k] = v
    }
    if (Object.keys(captured).length) writeStoredUtm(captured)
    else readStoredUtm()   // empty sessionStorage -> restore from the cookie
  }, [searchParams])

  return null
}
