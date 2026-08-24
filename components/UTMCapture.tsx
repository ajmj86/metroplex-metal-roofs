'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const source = searchParams.get('utm_source')
    const medium = searchParams.get('utm_medium')
    const campaign = searchParams.get('utm_campaign')
    const content = searchParams.get('utm_content')
    // Not a UTM param -- carries the neighborhood/community name a landing
    // page's QR destination URL was generated for (see HeroEyebrowLine.tsx).
    const area = searchParams.get('area')
    if (source) sessionStorage.setItem('utm_source', source)
    if (medium) sessionStorage.setItem('utm_medium', medium)
    if (campaign) sessionStorage.setItem('utm_campaign', campaign)
    if (content) sessionStorage.setItem('utm_content', content)
    if (area) sessionStorage.setItem('area', area)
  }, [searchParams])

  return null
}
