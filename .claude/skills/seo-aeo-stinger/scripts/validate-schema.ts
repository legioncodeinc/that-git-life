// scripts/validate-schema.ts
// STUB — extend per project.
//
// Purpose: walk all indexable routes of a Next.js app, extract every
// <script type="application/ld+json"> block from the rendered HTML, and validate
// each JSON-LD object against both:
//   1. Google's Rich Results Test  (https://search.google.com/test/rich-results)
//   2. Schema Markup Validator     (https://validator.schema.org)
//
// Output: reports/<date>-schema-validation.md with pass/warn/fail per route.
//
// Run via: npx tsx scripts/validate-schema.ts [--base=https://yourdomain.com]
//
// The Stinger's SUBAGENT CRITICAL DIRECTIVE: "Never ship schema without validation."
// This stub is a starting point. A full implementation needs:
//   - Route enumeration (parse sitemap.xml or walk app/ directory)
//   - Headless rendering (playwright, puppeteer, or plain `fetch` for SSR pages)
//   - POSTing JSON-LD to validator.schema.org/validate (returns JSON report)
//   - Rich Results Test requires API access (not public — use Search Console API
//     or scripted browser automation against the public UI)
//   - Report formatter matching reports/audit-report-template.md schema section

import fs from 'node:fs/promises';
import path from 'node:path';

interface SchemaFinding {
  route: string;
  schemaType: string;
  validatorResult: 'pass' | 'warn' | 'fail';
  richResultsResult: 'pass' | 'warn' | 'fail' | 'not-eligible';
  issues: string[];
}

async function main() {
  const base = process.argv.find((a) => a.startsWith('--base='))?.split('=')[1]
    ?? 'http://localhost:3000';

  // 1. Enumerate routes from sitemap.xml.
  const routes = await fetchSitemapRoutes(`${base}/sitemap.xml`);

  // 2. For each route, fetch HTML and extract JSON-LD scripts.
  const findings: SchemaFinding[] = [];
  for (const route of routes) {
    const html = await fetchHtml(route);
    const schemaBlocks = extractJsonLd(html);
    for (const schema of schemaBlocks) {
      const result = await validateSchema(schema);
      findings.push({
        route,
        schemaType: schema['@type'] ?? 'Unknown',
        validatorResult: result.validator,
        richResultsResult: result.richResults,
        issues: result.issues,
      });
    }
  }

  // 3. Emit report.
  const date = new Date().toISOString().slice(0, 10);
  const report = renderReport(findings, date);
  await fs.writeFile(path.join('reports', `${date}-schema-validation.md`), report, 'utf-8');

  const failed = findings.filter((f) => f.validatorResult === 'fail').length;
  if (failed > 0) {
    console.error(`[validate-schema] ${failed} failure(s) — see reports/${date}-schema-validation.md`);
    process.exit(1);
  }
  console.log(`[validate-schema] ${findings.length} schema objects validated — all pass.`);
}

async function fetchSitemapRoutes(sitemapUrl: string): Promise<string[]> {
  // TODO: parse sitemap.xml
  throw new Error('not implemented — parse sitemap.xml and return route URLs');
}

async function fetchHtml(route: string): Promise<string> {
  // TODO: fetch with a real browser (playwright) if routes depend on hydration
  const res = await fetch(route);
  return res.text();
}

function extractJsonLd(html: string): Array<Record<string, unknown>> {
  // TODO: parse <script type="application/ld+json"> blocks, JSON.parse each
  const regex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks: Array<Record<string, unknown>> = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      // TODO: record parse failures as 'fail' findings
    }
  }
  return blocks;
}

async function validateSchema(schema: Record<string, unknown>) {
  // TODO: POST to https://validator.schema.org/validate
  // TODO: call Rich Results Test via Search Console API OR scripted browser
  return {
    validator: 'pass' as const,
    richResults: 'not-eligible' as const,
    issues: [] as string[],
  };
}

function renderReport(findings: SchemaFinding[], date: string): string {
  const header = `# Schema Validation Report — ${date}\n\n`;
  const table = [
    '| Route | Schema @type | Validator | Rich Results | Issues |',
    '|---|---|---|---|---|',
    ...findings.map((f) =>
      `| ${f.route} | ${f.schemaType} | ${f.validatorResult} | ${f.richResultsResult} | ${f.issues.join('; ') || '—'} |`),
  ].join('\n');
  return header + table + '\n';
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
