// templates/lib-web-vitals.ts
// Core Web Vitals reporter. Subscribes to onLCP, onINP, onCLS, onFCP, onTTFB
// (plus onFID for legacy — FID was deprecated March 2024 in favor of INP).
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §7.2.
// See guides/06-core-web-vitals.md §6.2.
//
// Requires: npm install web-vitals
// Place at lib/web-vitals.ts (or lib/vitals.ts).
// Wire into the root layout via a <WebVitalsReporter /> client component:
//
//   'use client';
//   import { useEffect } from 'react';
//   import { reportWebVitals } from '@/lib/web-vitals';
//   export function WebVitalsReporter() {
//     useEffect(() => { reportWebVitals(); }, []);
//     return null;
//   }

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

type Metric = {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id: string;
};

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric);
  const url = '/api/analytics';

  // Use navigator.sendBeacon() if available, falling back to fetch().
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics); // Current responsiveness metric (replaced FID March 2024)
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onFID(sendToAnalytics); // Legacy — kept for backfill; deprecated
}
