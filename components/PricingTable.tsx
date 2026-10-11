import { C } from './brand'
import UtmLink from '@/components/UtmLink'
import { ROOFING_PRICING, perSqFtRange } from '@/lib/pricingData'

/*
 * Deliberately a plain presentational component -- no hooks, no event
 * handlers, no 'use client'. It's imported from both a Client Component
 * (CityPage.tsx) and a Server Component (synthetic-slate-roofing/page.tsx,
 * which has to stay a Server Component to keep its `metadata` export --
 * see that file's own comment on this exact constraint, hit and fixed
 * earlier in this project). Keeping this component boundary-agnostic avoids
 * re-hitting that "Event handlers cannot be passed to Client Component
 * props" crash.
 */
export default function PricingTable({
  title = 'DFW Roofing Costs by Material',
  intro,
}: {
  title?: string
  intro?: string
}) {
  return (
    <div>
      <div style={{ fontSize: 15, letterSpacing: 3, color: C.accent, textTransform: 'uppercase', marginBottom: 14 }}>Pricing</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4.3vw,3.75rem)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 18 }}>
        {title}
      </h2>
      {intro && (
        <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, maxWidth: 720, marginBottom: 32 }}>{intro}</p>
      )}
      <div style={{ overflowX: 'auto', border: `1px solid ${C.border}`, borderRadius: 8, maxWidth: 680 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 0 }}>
          <thead>
            <tr style={{ background: C.surface }}>
              {['Material', '$ / Sq Ft Installed*'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 0 ? 'left' : 'right',
                  padding: '16px 20px',
                  fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, fontWeight: 600,
                  borderBottom: `1px solid ${C.border}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROOFING_PRICING.map((row, i) => (
              <tr key={row.material} style={{ background: i % 2 === 0 ? 'transparent' : `${C.surface}80` }}>
                <td style={{ padding: '16px 20px', fontSize: 14, color: C.white, fontWeight: 500, borderBottom: i < ROOFING_PRICING.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  {row.material}
                </td>
                <td style={{ padding: '16px 20px', fontSize: 14, color: C.mutedLight, textAlign: 'right', borderBottom: i < ROOFING_PRICING.length - 1 ? `1px solid ${C.border}` : 'none', whiteSpace: 'nowrap' }}>
                  {perSqFtRange(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: C.mutedLight, lineHeight: 1.7, marginTop: 16, maxWidth: 720 }}>
        *Rates are per sq ft of gross roofing material, which includes waste and overage (typically 10–30% depending on material and roof complexity). Get an estimate for your exact roof with our{' '}
        <UtmLink href="/visualizer" ctaLocation="pricing_table" style={{ color: C.accent, textDecoration: 'underline' }}>free visualizer</UtmLink>.
      </p>
      <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginTop: 8, maxWidth: 720 }}>
        DFW-wide installed-cost ranges as of 2026, for material and labor combined. Actual cost depends on your roof&apos;s exact size, slope, tear-off needs, and site conditions.
      </p>
      {/* Plain <a> + CSS class (no handlers) so this stays a boundary-agnostic component;
          .cta-btn (brand globalStyles) makes it full-width on mobile. */}
      <style>{`.pt-cta:hover{background:${C.accentLight} !important}`}</style>
      <UtmLink
        href="/visualizer"
        ctaLocation="pricing_table"
        className="cta-btn pt-cta"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24,
          padding: '15px 32px', background: C.accent, color: C.black,
          fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
          fontWeight: 600, borderRadius: 2, transition: 'background 0.2s',
          textDecoration: 'none', fontFamily: "'Outfit',sans-serif",
        }}
      >Get My Instant Estimate</UtmLink>
    </div>
  )
}
