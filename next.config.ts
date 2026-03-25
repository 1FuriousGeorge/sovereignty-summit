import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Enable XSS protection in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control referrer info sent to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Allow fonts and images from CDN; restrict everything else
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://assets.murphslifefoundation.com https://summit.murphslifefoundation.com",
      "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
    ].join("; "),
  },
  // Permissions policy — disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // ── Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.murphslifefoundation.com",
        pathname: "/**",
      },
    ],
    // Modern formats for smaller file sizes
    formats: ["image/avif", "image/webp"],
  },

  // ── HTTP headers
  async headers() {
    return [
      // Security headers on all routes
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Long-lived cache for static assets
      {
        source: "/og.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, immutable",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
