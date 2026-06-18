import type { Metadata } from 'next'
import EstimateForm from '@/components/EstimateForm'

export const metadata: Metadata = {
  title: 'Get Your Metal Roof Estimate | Metroplex Metal Roofs',
}

const C = {
  black: '#09090A',
  border: '#27272A',
  accent: '#B8935A',
  white: '#F4F1EB',
  muted: '#71717A',
}

function Logo({ size = 1 }: { size?: number }) {
  return (
    <svg width={240 * size} height={66 * size} viewBox="0 0 240 66" fill="none" style={{ display: 'block' }}>
      <path d="M6 48 L26 14 L40 32 L26 32 Z" fill={C.accent} />
      <path d="M40 32 L54 14 L64 48 L40 48 Z" fill={C.accent} opacity="0.72" />
      <line x1="26" y1="14" x2="54" y2="14" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="6"  y1="48" x2="64" y2="48" stroke={C.accent} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="19" y1="48" x2="33" y2="23" stroke="#000" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
      <line x1="52" y1="48" x2="46" y2="23" stroke="#000" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
      <text x="76" y="28" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="16" fontWeight="700" letterSpacing="3" fill={C.white}>METROPLEX</text>
      <text x="76" y="44" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="11" fontWeight="400" letterSpacing="5" fill={C.accent}>METAL ROOFS</text>
      <line x1="76" y1="49" x2="233" y2="49" stroke={C.accent} strokeWidth="0.4" opacity="0.4" />
      <text x="76" y="59" fontFamily="'Outfit',sans-serif" fontSize="7" letterSpacing="2.5" fill={C.white} opacity="0.38">DALLAS · FORT WORTH</text>
    </svg>
  )
}

interface EstimatePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

export default async function EstimatePage({ searchParams }: EstimatePageProps) {
  const params = await searchParams
  const initialSelection = {
    roofType: firstValue(params.roofType),
    style: firstValue(params.style),
    product: firstValue(params.product),
    color: firstValue(params.color),
    address: firstValue(params.address),
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap"
      />
      <div style={{
        background: C.black,
        minHeight: '100vh',
        color: C.white,
        fontFamily: "'Outfit',system-ui,sans-serif",
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,48px)' }}>
          {/* Logo */}
          <div style={{ marginBottom: 52, display: 'flex', justifyContent: 'center' }}>
            <a href="/" style={{ display: 'block', textDecoration: 'none' }}>
              <Logo size={0.8} />
            </a>
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>
              Instant Estimate
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 'clamp(30px,5vw,52px)',
              fontWeight: 700,
              color: C.white,
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              What Will Your Metal Roof Cost?
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
              Select your roof type and enter your address. We&apos;ll use satellite data to generate a real estimate — no salesperson, no obligation.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: 48 }} />

          {/* Form */}
          <EstimateForm initialSelection={initialSelection} />
        </div>
      </div>
    </>
  )
}
