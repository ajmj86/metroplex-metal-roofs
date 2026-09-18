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
       * inset:0 (fills the SECTION's own rendered height), not a literal
       * height:'100vh' -- a fixed 100vh here caused a visible black strip
       * between the image and whatever renders below the hero whenever a
       * headline was long enough to push the section (min-height:100vh,
       * not a fixed height) taller than one viewport: the section grew but
       * this layer stayed pinned at 100vh, leaving the section's own
       * background exposed in the gap below the image. inset:0 always
       * matches the section's actual height instead, so there's never a
       * gap regardless of how much the headline wraps. This does NOT
       * reintroduce the earlier crop-drift bug (see Hero visual-parity fix
       * history) -- that bug was about the image's crop *position* shifting
       * between pages, which lives in heroBackgroundStyle()'s own
       * `center/cover` and is untouched here; only this div's height source
       * changed, from a hardcoded viewport unit to the parent's own size.
       */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: heroBackgroundStyle(backgroundImageSrc) }} />

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
