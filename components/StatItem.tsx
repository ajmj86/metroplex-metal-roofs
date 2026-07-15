'use client'

import { useState } from 'react'
import Counter from '@/components/Counter'
import { C } from '@/components/brand'

export interface StatTooltipRow {
  label: string
  value: string
}

export interface Stat {
  val: number
  suffix?: string
  label: string
  tooltip?: StatTooltipRow[]
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/*
 * Tooltip opens on hover (desktop), and on click/tap + focus (touch and
 * keyboard) — CSS-only :hover doesn't fire on touch devices, so a real
 * open/close state is required for this to be reachable on mobile.
 */
export default function StatItem({ stat, showBorder, className }: { stat: Stat; showBorder: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const hasTooltip = !!stat.tooltip?.length
  const tooltipId = `stat-tooltip-${slugify(stat.label)}`

  return (
    <div className={className} style={{ padding: '44px 32px', borderRight: showBorder ? `1px solid ${C.border}` : 'none', textAlign: 'center', position: 'relative' }}>
      <div
        {...(hasTooltip ? {
          tabIndex: 0,
          role: 'button' as const,
          'aria-expanded': open,
          'aria-describedby': tooltipId,
          onClick: () => setOpen(true),
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
          onFocus: () => setOpen(true),
          onBlur: () => setOpen(false),
          onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) },
        } : {})}
        style={{ cursor: hasTooltip ? 'pointer' : 'default', outline: 'none', display: 'inline-block' }}
      >
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,4vw,52px)', fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 8 }}>
          <Counter to={stat.val} suffix={stat.suffix || ''} />
        </div>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {stat.label}
          {hasTooltip && (
            <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 13, height: 13, borderRadius: '50%', border: `1px solid ${C.muted}`, fontSize: 9, opacity: 0.8, lineHeight: 1, flexShrink: 0 }}>i</span>
          )}
        </div>
      </div>

      {hasTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: `translateX(-50%) translateY(${open ? '0px' : '6px'})`,
            width: 260,
            maxWidth: 'calc(100vw - 32px)',
            background: C.card,
            border: `1px solid ${C.accentDark}`,
            borderRadius: 8,
            padding: '16px 18px',
            textAlign: 'left',
            boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
            opacity: open ? 1 : 0,
            visibility: open ? 'visible' : 'hidden',
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            zIndex: 20,
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>How This Is Calculated</div>
          {stat.tooltip!.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 14,
                fontSize: 12,
                color: C.mutedLight,
                padding: '5px 0',
                borderBottom: i < stat.tooltip!.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <span>{row.label}</span>
              <span style={{ color: C.white, fontWeight: 500, whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
