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

// Gap between the anchor and the bubble, and the minimum margin the bubble
// keeps from any viewport edge — both directions.
const GAP = 10
const EDGE_MARGIN = 12

/*
 * Tooltip opens on hover (desktop), and on tap + focus (touch and keyboard) —
 * CSS-only :hover doesn't fire on touch devices, so a real open/close state
 * is required for this to be reachable on mobile.
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
 *
 * Placement: collision-aware above/below the anchor (whichever side has
 * more room), clamped horizontally so it never crosses the viewport edges.
 * Left/right-of-anchor placement was deliberately not added — the bubble's
 * content is a vertically-stacked list of rows (up to ~10 plus a footnote),
 * and the anchors sit side-by-side in a stat grid, so there's no open
 * horizontal lane next to an anchor to place into; a wide-but-short bubble
 * above or below the row is the only shape that actually fits this layout.
 * Horizontal clamping still keeps it fully on-screen at any anchor position.
 */
export default function StatItem({ stat, showBorder, className }: { stat: Stat; showBorder: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'above' as 'above' | 'below' })
  const anchorRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const hasTooltip = !!stat.tooltip?.length
  const tooltipId = `stat-tooltip-${slugify(stat.label)}`

  // Portal target must only exist post-hydration: gating this render-time
  // branch on `typeof document` instead would make the client's first
  // render (document already defined) diverge from the server's (it isn't),
  // which is exactly the SSR/CSR hydration-mismatch anti-pattern.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // `(hover: none)` is the standard CSS-level signal for "the primary input
  // can't hover" — checked once at mount, not per-event, since a device's
  // primary input doesn't change mid-session. Touch gets tap-to-open/
  // tap-again-to-close; anything that can hover keeps the original
  // hover/focus behavior.
  const [isTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !bubbleRef.current) return

    const update = () => {
      const anchor = anchorRef.current!.getBoundingClientRect()
      const bubble = bubbleRef.current!.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      const spaceAbove = anchor.top
      const spaceBelow = vh - anchor.bottom
      const placeAbove = spaceAbove >= bubble.height + GAP + EDGE_MARGIN || spaceAbove > spaceBelow

      let top = placeAbove ? anchor.top - bubble.height - GAP : anchor.bottom + GAP
      // Clamp vertically too, for the rare case neither side has enough room
      // (e.g. a very short window) — keeps the bubble on-screen rather than
      // trusting either side blindly.
      top = Math.min(Math.max(top, EDGE_MARGIN), Math.max(EDGE_MARGIN, vh - bubble.height - EDGE_MARGIN))

      let left = anchor.left + anchor.width / 2 - bubble.width / 2
      left = Math.min(Math.max(left, EDGE_MARGIN), Math.max(EDGE_MARGIN, vw - bubble.width - EDGE_MARGIN))

      setPosition({ top, left, placement: placeAbove ? 'above' : 'below' })
    }

    update()
    // Re-measure on scroll/resize instead of closing — the anchor's
    // position keeps changing while the user scrolls, and a fixed-position
    // bubble that doesn't track it would either drift away from the anchor
    // or (the previous bug) render past the top of the viewport when the
    // anchor is close to it.
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [open])

  // Tap-elsewhere-to-close for touch (and a harmless click-outside-to-close
  // on desktop) — pointerdown fires for both mouse and touch, so one
  // listener covers both without needing separate touch/mouse handling.
  useEffect(() => {
    if (!open) return
    function handleOutside(e: PointerEvent) {
      const target = e.target as Node
      if (anchorRef.current?.contains(target)) return
      if (bubbleRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
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
          // Touch: tap toggles open/closed (there's no hover to rely on).
          // Non-touch: click just ensures it's open — hover/mouseleave
          // already drive open/close, so toggling here would fight a
          // hover-then-click sequence and flicker the bubble shut.
          onClick: () => { isTouch ? setOpen(o => !o) : setOpen(true) },
          onMouseEnter: () => { if (!isTouch) setOpen(true) },
          onMouseLeave: () => { if (!isTouch) setOpen(false) },
          // Skipped for touch: a tap fires focus immediately before click,
          // and toggling from both in the same gesture makes the open state
          // race itself. Keyboard-driven focus (Tab key) never fires click
          // in the same gesture, so this stays for real keyboard/a11y use.
          onFocus: () => { if (!isTouch) setOpen(true) },
          onBlur: () => { if (!isTouch) setOpen(false) },
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
          ref={bubbleRef}
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            // Small directional slide on open/close, layered on top of the
            // already-clamped resting position — it's a few px, well inside
            // the EDGE_MARGIN buffer, so it never reintroduces an off-screen
            // bubble.
            transform: open ? 'translateY(0)' : `translateY(${position.placement === 'above' ? 6 : -6}px)`,
            width: 260,
            maxWidth: 'calc(100vw - 24px)',
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
