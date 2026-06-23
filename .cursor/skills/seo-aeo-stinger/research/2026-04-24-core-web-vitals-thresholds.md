# Core Web Vitals — Current Thresholds (LCP, INP, CLS)

**Sources:**
- https://web.dev/vitals
- https://web.dev/articles/inp
- https://web.dev/articles/lcp
- https://web.dev/articles/cls
- https://developers.google.com/search/docs/appearance/core-web-vitals

**Retrieved:** 2026-04-24
**Query used:** "Core Web Vitals INP thresholds 2026" and "LCP CLS thresholds web.dev current"

## Summary

As of March 12, 2024, INP (Interaction to Next Paint) replaced FID (First Input Delay) as the responsiveness Core Web Vital. The three stable CWV are now LCP, INP, and CLS. Thresholds are measured at the 75th percentile of page loads, segmented by desktop and mobile, and pulled from field data (CrUX — Chrome User Experience Report).

## Thresholds

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

## Key facts to preserve

- **INP replaces FID.** FID measured only the *first* input delay; INP measures the longest interaction latency observed during a visit. Much stricter. Don't ship code that references FID as a current CWV.
- **Field data, not lab data.** CWV is scored from real users via CrUX. Lab tools (Lighthouse) approximate but are not what Google ranks on.
- **75th percentile.** A page passes only if 75% of sessions hit the "good" threshold, mobile and desktop independently.
- **LCP element candidates:** `<img>`, `<image>` inside SVG, `<video>` (poster), background-image via `url()`, block-level text containing text nodes.
- **CLS excludes user-initiated shifts.** Layout shifts within 500ms of a user interaction are excluded.
- **INP measures** the interval from a user input (click, tap, keypress) to the next painted frame. Includes processing time on all event handlers plus rendering.

## Ranking impact

Per Google Search Central: CWV is a ranking signal as part of the "page experience" bundle. Pages failing thresholds face demotion; passing is a table-stakes prerequisite, not a ranking boost on its own. The brief quotes "20–30% traffic penalties" for failing sites — this number originates from the canonical playbook and should be treated as order-of-magnitude, not a Google-published figure.

## Relevance to this stinger

- `guides/06-core-web-vitals.md` codifies these thresholds verbatim as the pass/fail bar for the audit.
- `guides/00-principles.md` carries the "measured, not asserted" directive — before/after CWV numbers are mandatory for any performance-impacting change.
- `scripts/web-vitals-snapshot.ts` stub is designed to capture field-proxy readings via Lighthouse CI (lab data) and label them as such; real CrUX data requires Search Console or PageSpeed Insights API.
- The `lib-web-vitals.ts` template correctly subscribes to `onLCP`, `onINP`, `onCLS` (plus `onFCP`, `onTTFB`). The playbook's snippet also wires `onFID` for legacy reasons — preserved with a note that FID is deprecated.
