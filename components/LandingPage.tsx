import { Suspense } from 'react'
import { C, fonts, globalStyles } from '@/components/brand'
import SiteNav from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import LandingPageHero from '@/components/LandingPageHero'
import StatItem from '@/components/StatItem'
import PricingTable from '@/components/PricingTable'
import LandingCTAButton from '@/components/LandingCTAButton'
import type { LandingPageData } from '@/lib/landingPageTypes'

/*
 * Shared template for every channel landing page (postcard today; Google
 * Ads / YouTube / Facebook-Instagram later) -- a new channel is a new data
 * file + a new thin app/lp/{channel}/page.tsx, never a change here. Stays a
 * plain (non-'use client') component, same boundary-agnostic reasoning as
 * PricingTable.tsx: its own page.tsx needs to stay a Server Component to
 * export `metadata` (including `robots`), and every interactive piece here
 * (StatItem, LandingCTAButton) is already its own Client Component.
 */
export default function LandingPage({ data }: { data: LandingPageData }) {
  return (
    <>
      <style>{fonts + globalStyles}</style>
      <div style={{ background: C.black, color: C.white, fontFamily: "'Outfit',system-ui,sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>
        <SiteNav />

        {/* Suspense is required by LandingPageHero's useSearchParams() call
            (reading ?area=) -- renders synchronously with the default
            eyebrowText during the static build/prerender (no actual
            suspension occurs), then re-renders client-side with the
            resolved value if the real URL carries ?area=. Same pattern
            UTMCapture.tsx already uses in app/layout.tsx. */}
        <Suspense fallback={null}>
          <LandingPageHero
            eyebrowText={data.hero.eyebrowText}
            headline={data.hero.headline}
            headlineAccent={data.hero.headlineAccent}
            subhead={data.hero.subhead}
            microcopy={data.hero.microcopy}
            backgroundImageSrc={data.hero.backgroundImageSrc}
            ctaLabel={data.ctaLabel}
            ctaHref={data.ctaHref}
            trustBullets={data.hero.trustBullets}
            trustBulletFootnote={data.hero.trustBulletFootnote}
          />
        </Suspense>

        {/* ── TRUST STATS ── */}
        <section style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
          {/* grid-{N} matches the count of stats actually passed in (globalStyles
              defines grid-2 through grid-5, same responsive collapse used
              everywhere else on the site) -- grid-5 was hardcoded here before,
              which left visible empty columns once a channel supplies fewer
              than 5 stats. */}
          <div className={`inner grid-${data.trustStats.length}`}>
            {data.trustStats.map((s, i) => (
              <StatItem key={s.label} stat={s} showBorder={i < data.trustStats.length - 1} className="stat-border" />
            ))}
          </div>
        </section>

        {/* ── PRICING (optional) ── */}
        {data.showPricingTable && (
          <section id="pricing" className="sp" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
            <div className="inner">
              <PricingTable intro={data.pricingIntro} />
            </div>
          </section>
        )}

        {/* ── FINAL CTA — no testimonial section: none exists sitewide yet
            (placeholder reviews were pulled for FTC/Texas DTPA reasons; see
            Homepage.jsx's own note above its `credentials` array) ── */}
        <section className="sp" style={{ borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <div className="inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 700, color: C.white, lineHeight: 1.15, maxWidth: 640 }}>
              Ready to see your home with a new roof?
            </h2>
            <LandingCTAButton label={data.ctaLabel} href={data.ctaHref} />
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}
