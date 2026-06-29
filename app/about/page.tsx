import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { AboutCTA } from '@/components/AboutCTA'
import { C, fonts, globalStyles } from '@/components/brand'

export const metadata: Metadata = {
  title: 'About Us | Premium Metal Roofing DFW | Metroplex Metal Roofs',
  description: 'Metroplex Metal Roofs specializes in premium residential metal roofing for Dallas-Fort Worth homeowners. Standing seam, stone-coated steel, copper, and R-panel.',
}

export default function AboutPage() {
  return (
    <>
      <style>{fonts + globalStyles}</style>
      <div style={{ background: C.black, minHeight: '100vh', color: C.white, fontFamily: "'Outfit',system-ui,sans-serif" }}>
        <SiteNav/>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(120px,12vw,150px) clamp(24px,5vw,48px) 80px' }}>

          {/* Eyebrow */}
          <div style={{ fontSize: 13, letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>
            Premium Metal Roofing · Dallas–Fort Worth
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 48 }}>
            Built on a Different Standard
          </h1>

          {/* Body copy */}
          <div style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.95, display: 'flex', flexDirection: 'column', gap: 28 }}>

            <p>The typical DFW homeowner replaces their asphalt roof every 8 to 10 years. They call a contractor, collect a few quotes, and write a check. Within a few years, hail season arrives and the process repeats itself. This isn't necessarily the result of poor workmanship or bad luck. It's the predictable outcome of a market that normalized replacement cycles without ever questioning whether the underlying material was suited to the climate in the first place.</p>

            <p>North Texas is genuinely hard on roofing. Between hail seasons, prolonged summer heat, and insurance deductibles that rise in step with home values, asphalt shingles function less like a long-term asset and more like a recurring operating expense. Metroplex Metal Roofs was founded on the conviction that homeowners with exceptional properties deserve a better answer than that.</p>

            <p>Our work is focused exclusively on residential metal roofing in the Dallas-Fort Worth market. Standing seam, stone-coated steel, copper, and R-panel, each project carefully planned, precision-measured, and engineered for the specific demands of the North Texas climate. That narrow focus is intentional. The homeowners we work with are not shopping for the lowest bid. They are looking for the right solution, executed correctly, by people who know the difference.</p>

            <p>We also set out to make the process itself more transparent. The first step with Metroplex is seeing your own home, rendered with your chosen roof style and color, before any conversation about price or commitment. It's a small thing that changes the dynamic considerably, because a decision of this permanence should begin with a clear picture of what you're actually building toward.</p>

            {/* Pull quote */}
            <div style={{ margin: '12px 0', padding: '24px 32px', borderLeft: `3px solid ${C.accent}`, background: `${C.accentDark}18` }}>
              <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(18px,2vw,22px)', fontStyle: 'italic', color: C.white, lineHeight: 1.7, margin: 0 }}>
                A metal roof is not simply designed to outperform asphalt. It is designed to outlast it entirely.
              </p>
            </div>

            <p>And to do so while reducing your long-term ownership costs, improving energy performance, and adding a level of finish that reflects the quality of the home beneath it.</p>

          </div>

          {/* CTA */}
          <AboutCTA/>

        </div>
        <SiteFooter/>
      </div>
    </>
  )
}
