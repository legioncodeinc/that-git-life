// templates/lib-metadata.ts
// Reusable metadata helper. Wraps the Next.js Metadata object with sensible defaults.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §3.1.
// See guides/02-on-page-optimization.md §2.1 for usage.
//
// Place at lib/metadata.ts. Import from pages via:
//   import { generateMetadata } from '@/lib/metadata';

import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const imageUrl = config.image || '/og-image.jpg';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  const fullUrl = config.url ? `${baseUrl}${config.url}` : baseUrl;

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: config.author ? [{ name: config.author }] : undefined,
    openGraph: {
      type: config.type || 'website',
      url: fullUrl,
      title: config.title,
      description: config.description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      siteName: 'Your Site Name',
      locale: 'en_US',
      ...(config.type === 'article' && {
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime,
        section: config.section,
        tags: config.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [fullImageUrl],
      creator: '@yourhandle',
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  return metadata;
}
