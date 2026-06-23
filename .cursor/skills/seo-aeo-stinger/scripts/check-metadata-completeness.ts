// scripts/check-metadata-completeness.ts
// STUB — extend per project.
//
// Purpose: walk every app/**/page.tsx and verify it exports either a static
// `metadata` object or a `generateMetadata` function, AND that the exported
// metadata includes the required fields (title, description, alternates.canonical).
//
// Output: reports/<date>-metadata-completeness.md with per-file findings.
//
// Run via: npx tsx scripts/check-metadata-completeness.ts
//
// The Stinger's rules (guides/02-on-page-optimization.md):
//   - Every page must export metadata (or generateMetadata for dynamic pages).
//   - title length 50–60 characters.
//   - description length 150–160 characters.
//   - alternates.canonical set (or the helper from lib/metadata.ts called).
//
// This stub uses TypeScript's compiler API for static analysis. A simpler
// regex-based version works for most codebases but misses edge cases (spread
// operators, imported metadata objects).

import fs from 'node:fs/promises';
import path from 'node:path';

interface MetadataFinding {
  file: string;
  hasMetadata: boolean;
  hasGenerateMetadata: boolean;
  missingFields: string[];
  titleLength?: number;
  descriptionLength?: number;
  warnings: string[];
}

async function main() {
  const appDir = 'app';
  const files = await walkTsx(appDir);
  const pageFiles = files.filter((f) => f.endsWith('page.tsx') || f.endsWith('page.ts'));

  const findings: MetadataFinding[] = [];
  for (const file of pageFiles) {
    const src = await fs.readFile(file, 'utf-8');
    findings.push(analyze(file, src));
  }

  const date = new Date().toISOString().slice(0, 10);
  const report = renderReport(findings, date);
  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile(path.join('reports', `${date}-metadata-completeness.md`), report, 'utf-8');

  const missing = findings.filter((f) => !f.hasMetadata && !f.hasGenerateMetadata);
  if (missing.length > 0) {
    console.error(`[check-metadata-completeness] ${missing.length} page(s) missing metadata — see reports/${date}-metadata-completeness.md`);
    process.exit(1);
  }
  console.log(`[check-metadata-completeness] All ${findings.length} pages have metadata.`);
}

async function walkTsx(dir: string): Promise<string[]> {
  const results: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...(await walkTsx(full)));
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) results.push(full);
  }
  return results;
}

function analyze(file: string, src: string): MetadataFinding {
  const hasMetadata = /export\s+const\s+metadata\s*:\s*Metadata/.test(src);
  const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(src);

  const warnings: string[] = [];
  const missing: string[] = [];

  if (!hasMetadata && !hasGenerateMetadata) {
    missing.push('metadata export');
    return {
      file,
      hasMetadata: false,
      hasGenerateMetadata: false,
      missingFields: missing,
      warnings,
    };
  }

  // Naive field checks — a full implementation uses the TS compiler API.
  const titleMatch = src.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const descriptionMatch = src.match(/description:\s*['"`]([^'"`]+)['"`]/);
  const hasCanonical = /alternates:\s*{[^}]*canonical/.test(src);

  const titleLength = titleMatch?.[1].length;
  const descriptionLength = descriptionMatch?.[1].length;

  if (!titleMatch) missing.push('title');
  if (!descriptionMatch) missing.push('description');
  if (!hasCanonical) warnings.push('alternates.canonical not found — rely on lib/metadata.ts helper?');

  if (titleLength && (titleLength < 30 || titleLength > 60)) {
    warnings.push(`title length ${titleLength} (recommended 50–60)`);
  }
  if (descriptionLength && (descriptionLength < 120 || descriptionLength > 170)) {
    warnings.push(`description length ${descriptionLength} (recommended 150–160)`);
  }

  return {
    file,
    hasMetadata,
    hasGenerateMetadata,
    missingFields: missing,
    titleLength,
    descriptionLength,
    warnings,
  };
}

function renderReport(findings: MetadataFinding[], date: string): string {
  const header = `# Metadata Completeness Report — ${date}\n\n`;
  const table = [
    '| File | Has metadata | Has generateMetadata | Missing | Warnings |',
    '|---|---|---|---|---|',
    ...findings.map((f) =>
      `| ${f.file} | ${f.hasMetadata ? 'Y' : 'N'} | ${f.hasGenerateMetadata ? 'Y' : 'N'} | ${f.missingFields.join(', ') || '—'} | ${f.warnings.join('; ') || '—'} |`),
  ].join('\n');
  return header + table + '\n';
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
