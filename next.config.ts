import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Browsers often request /favicon.ico first; point at generated app icon (no default Vercel .ico). */
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.png" }];
  },
  images: {
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
