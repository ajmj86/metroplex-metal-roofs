import { C } from './brand'
import { ROOFING_PRICING, PRICING_SAMPLE_SQFT, perSqFtRange, sampleTotalRange } from '@/lib/pricingData'

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
      <div style={{ overflowX: 'auto', border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ background: C.surface }}>
              {['Material', '$ / Sq Ft Installed', `Est. Total (${PRICING_SAMPLE_SQFT.toLocaleString('en-US')} Sq Ft Roof)`].map((h, i) => (
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
                <td style={{ padding: '16px 20px', fontSize: 14, color: C.mutedLight, textAlign: 'right', borderBottom: i < ROOFING_PRICING.length - 1 ? `1px solid ${C.border}` : 'none', whiteSpace: 'nowrap' }}>
                  {sampleTotalRange(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginTop: 16, maxWidth: 720 }}>
        DFW-wide installed-cost ranges as of 2026, for material and labor combined. Sample totals assume a {PRICING_SAMPLE_SQFT.toLocaleString('en-US')} sq ft roof with typical pitch and access — actual cost depends on your roof&apos;s exact size, slope, tear-off needs, and site conditions. Get a free satellite-based estimate for your home&apos;s specific number.
      </p>
    </div>
  )
}
