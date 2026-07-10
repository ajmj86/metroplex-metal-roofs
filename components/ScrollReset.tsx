'use client'
import { useEffect } from 'react'
export default function ScrollReset() {
  useEffect(() => {
    // Strip a leftover #hash (e.g. from a nav anchor link) without touching
    // the query string — matches the equivalent effect in Homepage.jsx's App
    // component, which this was extracted from. The inverted condition this
    // replaced (`if (!hash) replaceState(pathname)`) stripped ALL query
    // params on every page load, breaking any ?param= prefill flow.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo(0, 0)
  }, [])
  return null
}
