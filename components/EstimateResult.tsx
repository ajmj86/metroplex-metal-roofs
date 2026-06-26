'use client'

const C = {
  black: '#09090A',
  surface: '#111113',
  card: '#18181B',
  border: '#27272A',
  accent: '#B8935A',
  accentLight: '#D4AE7A',
  accentDark: '#8C6A38',
  white: '#F4F1EB',
  muted: '#71717A',
  mutedLight: '#A1A1AA',
}

interface EstimateResultProps {
  roofType: string
  estimate: { low: string; high: string }
}

export default function EstimateResult({ roofType, estimate }: EstimateResultProps) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.accentDark}`,
      borderRadius: 8,
      padding: 'clamp(32px,5vw,52px)',
      maxWidth: 600,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${C.accentDark},${C.accent},${C.accentDark})` }} />

      <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 10 }}>
        Your Estimate
      </div>

      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: C.accentLight, marginBottom: 28 }}>
        {roofType}
      </div>

      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(30px,5vw,52px)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 16 }}>
        {estimate.low} – {estimate.high}
      </div>

      <div style={{ fontSize: 13, color: C.mutedLight, marginBottom: 28, lineHeight: 1.6 }}>
        Includes full installation &amp; tear-off of existing shingles.
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px 18px', marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.85, margin: 0 }}>
          This estimate is based on your home&apos;s roof dimensions and is typically within 10% of your final investment. All projects include an on-site inspection and EagleView satellite imaging to confirm exact measurements and assess any existing conditions — such as decking damage or structural issues — that may affect final scope. Your final quote is provided after inspection at no obligation.
        </p>
      </div>

      <a
        href="https://api.leadconnectorhq.com/widget/booking/gG1ruFfEWkUXO7eIB8NR"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '16px',
          background: C.accent,
          color: C.black,
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: 700,
          borderRadius: 4,
          textAlign: 'center',
          textDecoration: 'none',
          transition: 'background 0.2s',
          boxSizing: 'border-box',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.accentLight }}
        onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
      >
        Schedule Your Free Inspection →
      </a>
    </div>
  )
}
