// templates/app-sitemap.ts
// Dynamic sitemap generator for the App Router.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §2.3.
// See guides/01-technical-foundation.md §1.3 for the rule set.
//
// Place at app/sitemap.ts. Next.js automatically serves it at /sitemap.xml.
// Do NOT list noindex or disallowed URLs — conflicting signals degrade index quality.

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Add all static pages
  ];

  // Dynamic pages — fetch from database / CMS
  const dynamicPages = await fetchDynamicPages();
  const dynamicSitemap: MetadataRoute.Sitemap = dynamicPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...dynamicSitemap];
}

async function fetchDynamicPages(): Promise<Array<{ slug: string; updatedAt: Date }>> {
  // TODO: Replace with your database / CMS query.
  // Return { slug, updatedAt } for every indexable page.
  // Remember to exclude noindex pages here.
  return [];
}
