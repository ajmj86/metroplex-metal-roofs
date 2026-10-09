'use client'

import Counter from '@/components/Counter'
import { C } from '@/components/brand'

export interface Stat {
  val: number
  suffix?: string
  // Optional display override (e.g. a range like '15–35%'): rendered as-is, no count-up animation.
  display?: string
  label: string
}

export default function StatItem({ stat, showBorder, className }: { stat: Stat; showBorder: boolean; className?: string }) {
  return (
    <div className={className} style={{ padding: '44px 32px', borderRight: showBorder ? `1px solid ${C.border}` : 'none', textAlign: 'center', position: 'relative' }}>
      <div style={{ display: 'inline-block' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,4vw,52px)', fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 8 }}>
          {stat.display ? <span>{stat.display}</span> : <Counter to={stat.val} suffix={stat.suffix || ''} />}
        </div>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted }}>
          {stat.label}
        </div>
      </div>
    </div>
  )
}
