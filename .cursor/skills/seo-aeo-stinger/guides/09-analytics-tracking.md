# 09 — Analytics & Tracking

Mirrors canonical playbook §10. GA4, Search Console, event tracking.

**Source research:** `research/2026-04-24-nextjs-metadata-api.md` (verification codes), `research/2026-04-24-core-web-vitals-thresholds.md` (CrUX field data).

---

## 9.1 Google Analytics 4

GA4 replaced Universal Analytics in July 2023. The canonical integration pattern from playbook §10.1:

```tsx
// components/Analytics.tsx
'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) pageview(pathname);
  }, [pathname, searchParams]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
        `}}
      />
    </>
  );
}

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID!, { page_path: url });
  }
};

export const event = ({ action, category, label, value }: {
  action: string; category: string; label: string; value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
```

### Rules

- **`strategy="afterInteractive"`** — loads after hydration. Does not block LCP or INP.
- **`NEXT_PUBLIC_GA_ID`** exposed at build time. Leave unset in non-prod environments to avoid polluting analytics.
- **Pageview on App Router** needs the `usePathname` + `useSearchParams` hooks because App Router navigations don't fire the `window.history` events GA4 auto-tracks on.

### Privacy note

GA4 collects IP addresses and cookie identifiers. GDPR / CCPA require a consent banner in applicable regions. The Stinger does not ship a consent UI — coordinate with product/legal. `security-worker-bee` tracks the consent requirement.

---

## 9.2 Google Search Console

The single best source of truth for organic traffic, indexation status, and CrUX field data.

### Verification

Emit the verification meta tag via the root layout's metadata:

```ts
export const metadata: Metadata = {
  verification: {
    google: 'your-google-verification-code',
    bing: 'your-bing-verification-code',
  },
};
```

Verification code comes from Search Console's "Add property" flow. HTML-tag method is the simplest; DNS-record method (TXT record) is more durable across hosting moves.

### What to monitor monthly

- **Coverage / Indexing** — pages excluded by `noindex`, duplicates, crawl errors.
- **Page experience / Core Web Vitals** — real-user LCP/INP/CLS data at p75, desktop vs mobile.
- **Performance / Search** — organic traffic, top queries, top pages, CTR, average position.
- **Sitemaps** — submission status, parse errors.
- **Manual actions** — site-level penalties. Rare but critical.
- **Security issues** — hacked content, malware. Also rare but critical.

---

## 9.3 Bing Webmaster Tools

Often skipped. Bing serves ~3–5% of global search plus powers DuckDuckGo and older AI assistants. Low-cost to set up:

- Verify ownership (same `verification` block supports `bing`).
- Submit the same `sitemap.xml`.
- Monitor indexation.

---

## 9.4 Event tracking

```tsx
// components/CTAButton.tsx
'use client';

import { event } from '@/components/Analytics';

export function CTAButton() {
  return (
    <button onClick={() => event({
      action: 'click',
      category: 'CTA',
      label: 'Get Started Button',
    })}>
      Get Started
    </button>
  );
}
```

### Events worth tracking

- CTA clicks (primary, secondary).
- Form submits (lead capture, contact).
- Scroll depth (25%, 50%, 75%, 100%).
- File downloads.
- Outbound link clicks.
- Video plays / completions.
- Search queries (internal site search).

### Events NOT to track

- Every single page interaction. Event volume costs money and pollutes signal.
- PII. Never include email, phone, name in event parameters.
- Financial specifics (transaction amounts) unless the GA4 property is configured for e-commerce.

---

## 9.5 Vercel Speed Insights / Analytics (optional)

If deployed on Vercel:

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

<SpeedInsights />
<Analytics />
```

Free on Vercel. Speed Insights reports CWV from real users — supplements Search Console's CrUX. Traffic Analytics is a privacy-friendly alternative to GA4 for sites that want real-user metrics without GDPR consent complexity.

---

## 9.6 Tag Manager considerations

Google Tag Manager (GTM) is a container that loads tags (GA4, Meta pixel, Hotjar, etc.) via a single script. Pros: marketing team can manage tags without code deploys. Cons: another script on the critical path.

If GTM is required:

- Load with `strategy="afterInteractive"` via Next.js `<Script>`.
- Audit the tag list quarterly — dead tags accumulate.
- Measure the impact on INP — GTM-loaded tags often execute on interaction.

---

## Worked example

`examples/audit-ecommerce-site.md` — the audit includes an analytics section flagging a missing GA4 pageview on App Router navigations and a Search Console property not verified.
