// scripts/web-vitals-snapshot.ts
// STUB — extend per project.
//
// Purpose: capture LCP / INP / CLS snapshots for a list of routes via Lighthouse CI.
// Output: reports/<date>-web-vitals-snapshot.md with a before/after table shape.
//
// Run via: npx tsx scripts/web-vitals-snapshot.ts [--base=https://yourdomain.com]
//                                                 [--routes=/ /about /products]
//
// Notes:
//   - Lighthouse reports LAB data — a proxy for real-user FIELD data.
//   - For field data, pull from Search Console API or PageSpeed Insights API
//     (https://pagespeed.web.dev/?url=<URL>&strategy=mobile) which returns CrUX.
//   - This stub runs Lighthouse (lab) for in-session validation. Schedule a
//     14-day follow-up against CrUX to confirm improvements stick at p75.
//
// Reference: guides/06-core-web-vitals.md §6.10 (measurement protocol)

import fs from 'node:fs/promises';
import path from 'node:path';

interface VitalsSnapshot {
  route: string;
  strategy: 'mobile' | 'desktop';
  lcp: number;   // ms
  inp: number;   // ms (from Lighthouse — proxy)
  cls: number;   // unitless
  source: 'lab' | 'field';
  timestamp: string;
}

async function main() {
  const base = process.argv.find((a) => a.startsWith('--base='))?.split('=')[1]
    ?? 'http://localhost:3000';
  const routes = parseRoutes() ?? ['/'];

  const snapshots: VitalsSnapshot[] = [];
  for (const route of routes) {
    const url = `${base}${route}`;
    for (const strategy of ['mobile', 'desktop'] as const) {
      const snap = await runLighthouse(url, strategy);
      snapshots.push(snap);
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const report = renderReport(snapshots, date);
  await fs.writeFile(path.join('reports', `${date}-web-vitals-snapshot.md`), report, 'utf-8');
  console.log(`[web-vitals-snapshot] Wrote reports/${date}-web-vitals-snapshot.md`);
}

function parseRoutes(): string[] | null {
  const arg = process.argv.find((a) => a.startsWith('--routes='));
  if (!arg) return null;
  return arg.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean);
}

async function runLighthouse(url: string, strategy: 'mobile' | 'desktop'): Promise<VitalsSnapshot> {
  // TODO: install `lighthouse` + `chrome-launcher` and invoke programmatically.
  //       OR shell out to the Lighthouse CLI and parse the JSON output.
  //       Thresholds (for the report):
  //         LCP good ≤ 2500 ms, poor > 4000 ms
  //         INP good ≤ 200  ms, poor > 500  ms
  //         CLS good ≤ 0.1,       poor > 0.25
  return {
    route: url,
    strategy,
    lcp: 0,
    inp: 0,
    cls: 0,
    source: 'lab',
    timestamp: new Date().toISOString(),
  };
}

function rating(metric: 'lcp' | 'inp' | 'cls', value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = { lcp: [2500, 4000], inp: [200, 500], cls: [0.1, 0.25] };
  const [good, poor] = thresholds[metric];
  if (value <= good) return 'good';
  if (value > poor) return 'poor';
  return 'needs-improvement';
}

function renderReport(snapshots: VitalsSnapshot[], date: string): string {
  const header = `# Web Vitals Snapshot — ${date}\n\nSource: Lighthouse (lab data). Schedule a follow-up against Search Console CrUX field data at p75 in 14 days.\n\n`;
  const table = [
    '| Route | Strategy | LCP (ms) | INP (ms) | CLS | Verdict |',
    '|---|---|---|---|---|---|',
    ...snapshots.map((s) => {
      const worst = [rating('lcp', s.lcp), rating('inp', s.inp), rating('cls', s.cls)]
        .sort((a, b) => ({ good: 0, 'needs-improvement': 1, poor: 2 })[b] - ({ good: 0, 'needs-improvement': 1, poor: 2 })[a])[0];
      return `| ${s.route} | ${s.strategy} | ${s.lcp} | ${s.inp} | ${s.cls} | ${worst} |`;
    }),
  ].join('\n');
  return header + table + '\n';
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
