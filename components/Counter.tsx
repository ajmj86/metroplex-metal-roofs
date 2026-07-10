'use client'

import { useState, useEffect, useRef } from 'react'

/*
 * SEO/LLM fix (was: useState(0) counted up client-side, so SSR HTML —
 * and anything reading raw HTML, i.e. crawlers/LLMs — saw literal "0"
 * text before JS ever ran).
 *
 * Initial state is now `to`, not 0 — so the very first server render (and
 * the matching first client render, pre-hydration-effects) already shows
 * the real number. That's what a non-JS crawler/LLM sees. The count-up
 * animation still happens for human visitors: once the element scrolls
 * into view, a client-only effect resets the displayed value to 0 and
 * animates it back up to `to`, purely as a post-hydration visual effect —
 * it never touches the SSR payload.
 */
export default function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(to)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let s = 0
        setVal(0)
        const step = to / 60
        const t = setInterval(() => {
          s += step
          if (s >= to) { setVal(to); clearInterval(t) }
          else setVal(Math.round(s * 10) / 10)
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{Number.isInteger(val) ? val.toLocaleString() : val.toFixed(1)}{suffix}</span>
}
