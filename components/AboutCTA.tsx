'use client'
import { C } from '@/components/brand'
import { useUtmHref } from '@/lib/useUtmHref'
import { trackVisualizerCta } from '@/lib/analytics'

export function AboutCTA() {
  const utm = useUtmHref()
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 56 }}>
      <a href={utm("/visualizer")} onClick={()=>trackVisualizerCta("about_cta","/visualizer")}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 32px', background: C.accent, color: C.black, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none' }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#D4AE7A' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.accent }}
      >See Your Home With Metal →</a>
    </div>
  )
}
