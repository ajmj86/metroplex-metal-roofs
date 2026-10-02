import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its .afm font metrics files from disk at runtime (fs, not
  // require) — bundling it breaks that lookup on Vercel, so keep it external.
  serverExternalPackages: ["pdfkit"],

  // /visualizer?form=full is the long-form variant (4 quiz screens) kept for
  // reference/A-B use -- keep it out of search results; the default (short) page
  // stays indexable. Matches on the query string, so /visualizer is unaffected.
  async headers() {
    return [
      {
        source: "/visualizer",
        has: [{ type: "query", key: "form", value: "full" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  async redirects() {
    return [
      {
        // /service-areas has never existed as a real page (confirmed via
        // git history) -- Service Areas content lives on the homepage's
        // #service-areas anchor section. This was only ever referenced by
        // a stale BreadcrumbList schema URL on the city pages (fixed
        // separately in CityPageSchema.tsx), which is almost certainly how
        // Google discovered and flagged it as a 404 in Search Console. This
        // redirect is a safety net for that URL and any other existing
        // external links/previously-crawled references to it.
        // `permanent: true` -> 308, Next.js's redirects() has no literal
        // 301 option; Google treats 308 as equivalent for indexing.
        source: "/service-areas",
        destination: "/#service-areas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
