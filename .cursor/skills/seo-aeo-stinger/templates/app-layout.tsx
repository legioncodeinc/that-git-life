// templates/app-layout.tsx
// Canonical root layout with complete metadata + viewport.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §2.2.
// See guides/01-technical-foundation.md §1.2 for the rule set.

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Font optimization with display swap
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// CRITICAL: Viewport configuration (separate export in Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,         // Accessibility: do not drop below 5
  userScalable: true,      // Accessibility: do not set false
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Base metadata — override on individual pages
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
  title: {
    default: 'Your Site Name — Primary Value Proposition',
    template: '%s | Your Brand Name',
  },
  description: 'Compelling 150–160 character description with primary keywords',
  keywords: ['primary keyword', 'secondary keyword', 'tertiary keyword'],
  authors: [{ name: 'Your Name', url: 'https://yourdomain.com/about' }],
  creator: 'Your Company Name',
  publisher: 'Your Company Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'Your Site Name',
    title: 'Your Site Name — Primary Value Proposition',
    description: 'Compelling 150–160 character description',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Site Name',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourhandle',
    creator: '@yourhandle',
    title: 'Your Site Name — Primary Value Proposition',
    description: 'Compelling 150–160 character description',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code', // Uncomment if using Bing Webmaster Tools
  },
  alternates: {
    canonical: 'https://yourdomain.com',
  },
  category: 'your-category',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}

        {/* Analytics — place at end of body */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
