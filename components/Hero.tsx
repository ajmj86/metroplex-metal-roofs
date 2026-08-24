import {
  C, HERO_EYEBROW_WRAP_STYLE, HERO_EYEBROW_BAR_STYLE, HERO_EYEBROW_TEXT_STYLE,
  HERO_H1_STYLE, HERO_H1_ACCENT_STYLE, HERO_SUBHEAD_STYLE, heroBackgroundStyle,
} from '@/components/brand'
import LandingCTAButton from '@/components/LandingCTAButton'
import HeroTrustBullets from '@/components/HeroTrustBullets'

/*
 * The ONE hero implementation -- Homepage.jsx and every /lp/{channel}
 * landing page render this same component, not separately-maintained
 * copies of it. Two implementations referencing shared style constants
 * (the previous approach) still let real structural differences between
 * them show up as misalignment even when every extracted style VALUE
 * matched; rendering the literal same component removes that entire
 * category of drift -- there's nothing left to keep in sync by hand.
 *
 * Stays a plain (non-'use client') component so it can be rendered directly
 * from Homepage.jsx (already 'use client') or delegated to from a small
 * client wrapper (LandingPageHero.tsx, for the ?area= eyebrow swap) without
 * forcing either caller's own client/server boundary.
 */
export default function Hero({
  eyebrowText,
  headline,
  headlineAccent,
  subhead,
  ctaLabel,
  ctaHref,
  microcopy,
  trustBullets,
  trustBulletFootnote,
  backgroundImageSrc,
}: {
  eyebrowText: string
  headline: string
  headlineAccent?: string
  subhead: string
  ctaLabel: string
  ctaHref: string
  microcopy?: string
  trustBullets?: string[]
  trustBulletFootnote?: string
  backgroundImageSrc: string
}) {
  return (
    <section className="hero-pad" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/*
       * height:'100vh' here, NOT inset:0 -- inset:0 stretches this div to
       * match the SECTION's actual rendered height, which varies with
       * content (the section is min-height:100vh, not a fixed height, and
       * different pages have different amounts of hero copy, so it grows by
       * a different amount past 100vh on each page). That variable height
       * was what made the same "cover"-sized image crop differently per
       * page -- fixing this div's height to exactly 100vh regardless of the
       * section's own height means the image is ALWAYS the same box, so it
       * always crops identically, on every page, at every viewport. Any
       * section overflow past 100vh (content taller than the viewport)
       * shows the page's own near-black background below the image instead
       * of stretching/re-cropping it -- visually seamless, since the
       * gradient overlay is already nearly black at the image's own bottom
       * edge.
       */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, background: heroBackgroundStyle(backgroundImageSrc) }} />

      <div className="inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ ...HERO_EYEBROW_WRAP_STYLE, animation: 'fadeUp 0.8s ease both' }}>
          <div style={HERO_EYEBROW_BAR_STYLE} />
          <span style={HERO_EYEBROW_TEXT_STYLE}>{eyebrowText}</span>
        </div>

        <h1 style={{ ...HERO_H1_STYLE, animation: 'fadeUp 0.8s ease 0.1s both' }}>
          {headline}
          {headlineAccent && <>
            <br /><span style={HERO_H1_ACCENT_STYLE}>{headlineAccent}</span>
          </>}
        </h1>

        <p style={{ ...HERO_SUBHEAD_STYLE, animation: 'fadeUp 0.8s ease 0.2s both' }}>{subhead}</p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', animation: 'fadeUp 0.8s ease 0.3s both' }}>
          <LandingCTAButton label={ctaLabel} href={ctaHref} />
        </div>

        {microcopy && (
          <p style={{ fontSize: 12, color: C.muted, marginTop: 14, animation: 'fadeUp 0.8s ease 0.35s both' }}>
            {microcopy}
          </p>
        )}

        {trustBullets && trustBullets.length > 0 && (
          <HeroTrustBullets
            items={trustBullets}
            footnote={trustBulletFootnote}
            style={{ animation: 'fadeUp 0.8s ease 0.4s both' }}
          />
        )}
      </div>
    </section>
  )
}
