'use client'
import { useEffect } from 'react'
export default function ScrollReset() {
  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
      window.scrollTo(0, 0)
    }
  }, [])
  return null
}
