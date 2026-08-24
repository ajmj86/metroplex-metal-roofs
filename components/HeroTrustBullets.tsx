import type { CSSProperties } from 'react'
import { C } from '@/components/brand'

/*
 * Shared with Homepage.jsx's own hero trust-bar -- same bullet-row markup
 * and styling in one place, so a landing page's version can't hand-roll a
 * divergent copy of it. `style` lets a caller layer on extras (Homepage.jsx
 * adds its own entrance-animation timing) without forking the base markup.
 */
export default function HeroTrustBullets({
  items,
  footnote,
  style,
}: {
  items: string[]
  footnote?: string
  style?: CSSProperties
}) {
  return (
    <div className="trust-bar" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}`, ...style }}>
      {items.map(t => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.muted }}>{t}</span>
        </div>
      ))}
      {footnote && (
        <span style={{ fontSize: 10, color: C.muted, opacity: 0.7, marginTop: 2 }}>{footnote}</span>
      )}
    </div>
  )
}
