// Two sitewide footnotes (one wording each; the '*' on the hero bullet and on the stat labels points at them):
//
//  HERO_FOOTNOTE -- short line under the hero trust bullets ("Insurance Discount Eligible*") on the homepage, city pages and
//                   every /lp landing page. (google-insurance keeps its own required "*Actual discount varies by carrier and
//                   policy." there instead.)
//  STAT_FOOTNOTE -- full disclaimer rendered ONCE directly under the stat strip ("Insurance Premium Savings*", "Energy Cost
//                   Reduction*") on the homepage, city pages and all /lp landing pages. Replaces the old "Figures represent
//                   accepted industry ranges..." paragraph.
export const HERO_FOOTNOTE =
  '*Insurance discounts and energy savings vary by home, roof system, carrier, and climate. Confirm eligibility with your insurance provider.'

export const STAT_FOOTNOTE =
  '*Insurance discounts and energy savings vary by home, roof system, carrier, climate, and installation. Individual results will vary, and actual savings are not guaranteed. Consult a local real estate professional for market-specific figures and your insurance and utility providers for personalized savings.'
