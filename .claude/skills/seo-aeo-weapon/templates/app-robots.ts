// templates/app-robots.ts
// Canonical robots.txt generator. Default: allow all crawlers including AI bots.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §2.4.
// See guides/01-technical-foundation.md §1.4 and research/2026-04-24-ai-assistant-crawlers.md
// for the full tradeoff between allow-all, block-training-allow-retrieval, and block-all policies.
//
// Place at app/robots.ts. Next.js automatically serves it at /robots.txt.

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI training crawler
        allow: '/',
        // To block: disallow: '/'
      },
      {
        userAgent: 'CCBot', // Common Crawl (feeds many training corpora)
        allow: '/',
      },
      // Additional AI crawlers — uncomment and set policy as desired:
      // { userAgent: 'ClaudeBot', allow: '/' },         // Anthropic training
      // { userAgent: 'anthropic-ai', allow: '/' },      // Anthropic (legacy UA)
      // { userAgent: 'PerplexityBot', allow: '/' },     // Perplexity indexing
      // { userAgent: 'OAI-SearchBot', allow: '/' },     // ChatGPT Search index
      // { userAgent: 'Google-Extended', disallow: '/' }, // Opt out of Gemini/Bard training
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
