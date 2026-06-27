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

interface EstimatePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

function getLeadSource(leadOrigin: string | undefined, utmMedium: string | undefined): string {
  if (leadOrigin === 'visualizer') return 'Visualizer'
  if (!utmMedium) return 'SEO Organic'
  switch (utmMedium) {
    case 'postcard': return 'Direct Mailer'
    case 'cpc': return 'Google Ads'
    case 'paid_social': return 'Meta Ads'
    case 'video': return 'YouTube Ads'
    case 'gbp': return 'Google Business Profile'
    default: return 'Other'
  }
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
  const leadInfo = {
    firstName: firstValue(params.firstName),
    lastName: firstValue(params.lastName),
    phone: firstValue(params.phone),
    email: firstValue(params.email),
    reason: firstValue(params.reason),
    insuranceClaim: firstValue(params.insuranceClaim),
    timeline: firstValue(params.timeline),
    leadOrigin: firstValue(params.leadOrigin),
  }
  const utmSource = firstValue(params.utm_source)
  const utmMedium = firstValue(params.utm_medium)
  const utmCampaign = firstValue(params.utm_campaign)
  const leadSource = getLeadSource(leadInfo.leadOrigin, utmMedium)

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
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 13, letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>
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
              Select your roof type and enter your address. We&apos;ll use satellite data to generate a ballpark estimate — no salesperson, no obligation. Subject to inspection of current roof condition and confirming precise measurements.
            </p>
          </div>

          {/* Form */}
          <EstimateForm
            initialSelection={initialSelection}
            leadInfo={leadInfo}
            leadSource={leadSource}
            utmSource={utmSource}
            utmMedium={utmMedium}
            utmCampaign={utmCampaign}
          />
        </div>
      </div>
    </>
  )
}
