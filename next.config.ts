import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Tab icon: use `public/favicon.ico` from `npm run generate:icons` (real .ico, no rewrite flash). */
  images: {
    /** Skip optimizer in dev — Supabase signed URLs time out over the open internet. Production (Vercel) is co-located with Supabase CDN so optimization is fast there. */
    unoptimized: process.env.NODE_ENV === 'development',
    /** Cache optimized images for 24 h on Vercel (default is 60 s, causing frequent re-fetches from Supabase). */
    minimumCacheTTL: 60 * 60 * 24,
    /** Allow `quality` values used by `next/image` (e.g. HomeHero uses 82). */
    qualities: [75, 82],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      /** Supabase signed URLs for listing media (project subdomains). */
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/**" },
    ],
  },
  // Production: optimize for smaller bundles and faster loads
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
