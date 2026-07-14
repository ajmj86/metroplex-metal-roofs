import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its .afm font metrics files from disk at runtime (fs, not
  // require) — bundling it breaks that lookup on Vercel, so keep it external.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
