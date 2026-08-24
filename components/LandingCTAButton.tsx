'use client'

import { C } from '@/components/brand'

// Exact style block as the sitewide "Free Visualizer + Estimate" CTA in
// SiteNav.tsx and Homepage.jsx, so a landing-page CTA is visually
// indistinguishable from the one used everywhere else on the site.
export default function LandingCTAButton({
  label = 'Free Visualizer + Estimate',
  href,
}: {
  label?: string
  href: string
}) {
  return (
    <a
      href={href}
      className="cta-btn"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '15px 32px', background: C.accent, color: C.black,
        fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
        fontWeight: 600, borderRadius: 2, transition: 'background 0.2s',
        whiteSpace: 'nowrap', textDecoration: 'none', fontFamily: "'Outfit',sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = C.accentLight }}
      onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
    >{label}</a>
  )
}
