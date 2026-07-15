'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
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
  footnote?: string
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/*
 * Tooltip opens on hover (desktop), and on click/tap + focus (touch and
 * keyboard) — CSS-only :hover doesn't fire on touch devices, so a real
 * open/close state is required for this to be reachable on mobile.
 *
 * Rendered via a portal into document.body: the on-page Reveal wrapper
 * around every stat sets an inline `transform` (never the literal `none`),
 * which creates its own CSS stacking context. That traps a nested
 * position:absolute tooltip inside it no matter how high its z-index is
 * set — z-index only resolves within the stacking context that establishes
 * it, and Reveal's context always paints below the fixed site nav's
 * z-index:200. Portaling to body escapes that entirely, so the tooltip
 * competes for stacking at the root, where a z-index above the nav's
 * actually wins and fully occludes it (no more nav bleed-through).
 */
export default function StatItem({ stat, showBorder, className }: { stat: Stat; showBorder: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const anchorRef = useRef<HTMLDivElement>(null)
  const hasTooltip = !!stat.tooltip?.length
  const tooltipId = `stat-tooltip-${slugify(stat.label)}`

  // Portal target must only exist post-hydration: gating this render-time
  // branch on `typeof document` instead would make the client's first
  // render (document already defined) diverge from the server's (it isn't),
  // which is exactly the SSR/CSR hydration-mismatch anti-pattern.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return
    const update = () => {
      const rect = anchorRef.current!.getBoundingClientRect()
      setCoords({ top: rect.top - 10, left: rect.left + rect.width / 2 })
    }
    update()
    // A stale fixed-position tooltip would drift from its anchor on
    // scroll/resize, so just close it rather than track continuously.
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close)
      window.removeEventListener('resize', close)
    }
  }, [open])

  return (
    <div className={className} style={{ padding: '44px 32px', borderRight: showBorder ? `1px solid ${C.border}` : 'none', textAlign: 'center', position: 'relative' }}>
      <div
        ref={anchorRef}
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

      {hasTooltip && mounted && createPortal(
        <div
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: `translate(-50%, calc(-100% + ${open ? '0px' : '6px'}))`,
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
            /* Root-level stacking (see file-header note) — above the fixed
               site nav (zIndex 200) so the tooltip's fully opaque background
               completely occludes it instead of the nav bleeding through. */
            zIndex: 250,
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
          {stat.footnote && (
            <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, fontStyle: 'italic' }}>
              *{stat.footnote}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
