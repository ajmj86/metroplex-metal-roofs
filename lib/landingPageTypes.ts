export interface TrustStat {
  val: number
  suffix?: string
  label: string
}

// `channel` is a plain string (not a union) so a new channel — Google Ads,
// YouTube, Facebook/Instagram, etc. — is just a new data file's value, never
// a change to this type or to components/LandingPage.tsx.
export interface LandingPageData {
  slug: string
  channel: string
  meta: {
    title: string
    description: string
  }
  hero: {
    // Default eyebrow line for this channel (e.g. a real urgency banner, or
    // just a static descriptor). components/LandingPageHero.tsx overrides
    // this with "Mailed to homes in {area} · Dallas–Fort Worth" when the
    // page's URL carries an ?area= param -- never both, same slot, matching
    // Homepage.jsx's own eyebrow always occupying this exact space.
    eyebrowText: string
    headline: string
    // Optional second headline line, rendered on its own line in the accent
    // italic treatment -- matches Homepage.jsx's own two-line hero pattern
    // ("The Last Roof" / "You'll Ever Put On Your House"). Omit for a
    // single-line headline.
    headlineAccent?: string
    subhead: string
    // Short line under the CTA button (matches Homepage.jsx's own hero
    // microcopy). Omit for none.
    microcopy?: string
    backgroundImageSrc: string
    // Short supporting-fact bullets rendered under the CTA/microcopy
    // (matches Homepage.jsx's own hero trust-bar) -- keeps the subhead
    // itself to one short sentence rather than packing every value prop
    // into it. Omit for no bullet row.
    trustBullets?: string[]
    trustBulletFootnote?: string
  }
  trustStats: TrustStat[]
  ctaLabel: string
  ctaHref: string
  pricingIntro?: string
  showPricingTable: boolean
}
