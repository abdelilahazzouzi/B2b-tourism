import type { NextConfig } from "next";
import path from "path";

const supabaseHostname = "kksihigbfmnudvzeikmi.supabase.co";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      // Only load resources from the same origin by default
      "default-src 'self'",
      // Scripts: self + Next.js inline scripts (needed for hydration)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline styles (Framer Motion & Tailwind inject these)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: Google Fonts (Geist) + self
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + Supabase Storage + data URIs (for SVGs/placeholders)
      `img-src 'self' data: blob: https://${supabaseHostname}`,
      // API/WebSocket connections: self + Supabase REST & Realtime
      `connect-src 'self' https://${supabaseHostname} wss://${supabaseHostname}`,
      // No iframes from external sources
      "frame-ancestors 'none'",
      // No plugins (Flash etc.)
      "object-src 'none'",
      // No base tag hijacking
      "base-uri 'self'",
      // Form submissions only to self
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
      // Unsplash for royalty-free placeholder photography
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
