// templates/next.config.js
// Canonical SEO-ready Next.js configuration.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §2.1.
// See guides/01-technical-foundation.md for the rule set.
//
// NOTE: The `headers()` block includes security headers. Any change that adds
// or relaxes a Content-Security-Policy directive must route through
// security-worker-bee before merge (per seo-aeo-worker-bee directives).

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // DO NOT disable TypeScript checking in production.
  typescript: {
    ignoreBuildErrors: false,
  },

  // Image Optimization — CRITICAL
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats first
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.yourdomain.com',
      },
      // Add CDN domains as needed
    ],
  },

  // Compression
  compress: true,

  // Experimental — tree-shake icon / utility libraries
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns'],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // 301 Redirects
  async redirects() {
    return [
      // Example redirects — maintain for SEO value
      // { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  },

  // Rewrites for clean URLs
  async rewrites() {
    return [
      // Optional: Create cleaner URLs
    ];
  },
};

module.exports = nextConfig;
