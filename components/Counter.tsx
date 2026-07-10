'use client'

import { useState, useEffect, useRef } from 'react'

/*
 * SEO/LLM fix (was: useState(0) counted up client-side, so SSR HTML —
 * and anything reading raw HTML, i.e. crawlers/LLMs — saw literal "0"
 * text before JS ran). The true value now renders immediately in the
 * markup; the "counting" effect is a pure opacity/translateY reveal on
 * scroll-into-view, matching the Reveal component pattern used elsewhere.
 */
export default function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const display = Number.isInteger(to) ? to.toLocaleString() : to.toFixed(1)
  return (
    <span
      ref={ref}
      style={{
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}
    >
      {display}{suffix}
    </span>
  )
}
