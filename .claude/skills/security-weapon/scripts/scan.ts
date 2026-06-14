#!/usr/bin/env -S node --loader tsx
// scripts/scan.ts — TypeScript port of scan.sh.
//
// Prefer this on Windows / non-Bash environments. Same outputs, same intent:
// populate reports/scan-output/ with deterministic findings so the Angel can
// focus on judgment calls (IDOR, PCI architecture, business-logic trust).
//
// Usage (from repo root being audited):
//   npx tsx .cursor/skills/security-weapon/scripts/scan.ts
//
// Exits with code 0 regardless. The Angel decides what is fatal.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT_DIR = resolve('reports/scan-output');
mkdirSync(OUT_DIR, { recursive: true });

const write = (name: string, body: string) =>
  writeFileSync(join(OUT_DIR, name), body.endsWith('\n') ? body : body + '\n', 'utf8');

const hr = (label: string) =>
  console.log(`\n${'='.repeat(60)}\n${label}\n${'='.repeat(60)}`);

const safeExec = (cmd: string): string => {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); }
  catch (e: any) { return (e.stdout?.toString() ?? '') + '\n' + (e.stderr?.toString() ?? ''); }
};

// ---------------------------------------------------------------------------
// 1. npm audit
// ---------------------------------------------------------------------------
hr('1. npm audit');
let auditJson = 'no lockfile found';
if (existsSync('pnpm-lock.yaml')) auditJson = safeExec('pnpm audit --prod --audit-level=high --json');
else if (existsSync('package-lock.json')) auditJson = safeExec('npm audit --audit-level=high --json');
else if (existsSync('yarn.lock')) auditJson = safeExec('yarn npm audit --severity=high --recursive --json');
write('npm-audit.json', auditJson);
console.log('  ->', join(OUT_DIR, 'npm-audit.json'));

// ---------------------------------------------------------------------------
// 2. CVE version gate
// ---------------------------------------------------------------------------
hr('2. CVE version gate');
let versionReport = 'CVE watchlist:\n';
versionReport += '  CVE-2025-29927 (Next.js middleware bypass) — patched: 14.2.25 / 15.2.3\n';
versionReport += '  CVE-2025-55182 (React2Shell RCE)           — patched: react 19.0.1 / 19.1.2 / 19.2.1\n\n';
if (existsSync('package.json')) {
  versionReport += '--- package.json (declared) ---\n';
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const n of ['next', 'react', 'react-dom']) {
    if (allDeps[n]) versionReport += `  ${n}: ${allDeps[n]}\n`;
  }
}
for (const lock of ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']) {
  if (existsSync(lock)) {
    const txt = readFileSync(lock, 'utf8');
    const hits = txt.split('\n')
      .filter((l) => /(next|react|react-dom)@?\d+\.\d+\.\d+/.test(l))
      .slice(0, 40);
    versionReport += `\n--- ${lock} (resolved, first 40 matches) ---\n${hits.join('\n')}\n`;
  }
}
write('cve-version-check.txt', versionReport);
console.log('  ->', join(OUT_DIR, 'cve-version-check.txt'));

// ---------------------------------------------------------------------------
// 3. Rules File Backdoor — hidden Unicode
// ---------------------------------------------------------------------------
hr('3. Unicode scan (AI rules files)');
const UNICODE_RE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g;
const RULE_TARGETS = [
  '.cursor/rules',
  '.cursorrules',
  'AGENTS.md',
  'CLAUDE.md',
  '.github/copilot-instructions.md',
];
const unicodeHits: string[] = [];
const walk = (p: string) => {
  if (!existsSync(p)) return;
  const st = statSync(p);
  if (st.isDirectory()) for (const e of readdirSync(p)) walk(join(p, e));
  else if (st.isFile()) {
    const body = readFileSync(p, 'utf8');
    body.split('\n').forEach((line, i) => {
      if (UNICODE_RE.test(line)) {
        UNICODE_RE.lastIndex = 0;
        unicodeHits.push(`${p}:${i + 1} — hidden Unicode detected`);
      }
    });
  }
};
for (const t of RULE_TARGETS) walk(t);
write('unicode-scan.txt',
  unicodeHits.length
    ? unicodeHits.join('\n')
    : 'clean — no zero-width or bidirectional Unicode detected');
console.log('  ->', join(OUT_DIR, 'unicode-scan.txt'));

// ---------------------------------------------------------------------------
// 4. Pattern sweeps
// ---------------------------------------------------------------------------
hr('4. Vulnerable-pattern sweep');
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'out', 'coverage']);
const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|prisma|sql|env|env.local|env.production)$/i;

const files: string[] = [];
const collect = (dir: string) => {
  for (const e of readdirSync(dir)) {
    if (IGNORE_DIRS.has(e)) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) collect(p);
    else if (st.isFile() && (CODE_EXT.test(e) || e.startsWith('.env'))) files.push(p);
  }
};
collect('.');

const patterns: { name: string; re: RegExp }[] = [
  { name: 'NEXT_PUBLIC_ leaks',
    re: /NEXT_PUBLIC_.*(sk_live_|sk_test_|SECRET|PRIVATE|TOKEN|PASSWORD)/ },
  { name: 'Hardcoded secrets',
    re: /(sk_live_[A-Za-z0-9]{10,}|sk_test_[A-Za-z0-9]{10,}|-----BEGIN\s+(RSA|OPENSSH|PRIVATE)|AIza[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})/ },
  { name: 'dangerouslySetInnerHTML',
    re: /dangerouslySetInnerHTML/ },
  { name: 'localStorage / sessionStorage writes',
    re: /(localStorage|sessionStorage)\.setItem\(/ },
  { name: 'Raw card fields (PCI)',
    re: /(cardNumber|card_number|\bcvv\b|\bcvc\b|exp_month|exp_year)/ },
  { name: 'jwt.verify without pinned algorithm (manual review)',
    re: /jwt\.(verify|decode)\(/ },
  { name: 'Prototype pollution sinks',
    re: /(Object\.assign\(.*JSON\.parse|_\.merge\(|_\.defaultsDeep\()/ },
  { name: 'SQL template literal in db.query',
    re: /(db|pool|connection|client)\.query\(\s*`/ },
  { name: 'Command injection shape',
    re: /(child_process\.)?exec\(\s*`/ },
  { name: 'Wildcard CORS',
    re: /Access-Control-Allow-Origin.*['"]\*['"]/ },
  { name: 'console.* / Sentry in api / payment paths',
    re: /(console\.(log|error|info)|Sentry\.captureException|LogRocket)/ },
];

const sections: string[] = [];
for (const p of patterns) {
  const hits: string[] = [];
  for (const f of files) {
    // skip console.* sweep outside relevant paths
    if (p.name.startsWith('console.*') && !/(^|\/)(app\/(api|actions)|pages\/api|src\/(lib|server))(\/|$)/.test(f)) continue;
    const text = readFileSync(f, 'utf8');
    text.split('\n').forEach((line, i) => {
      if (p.re.test(line)) hits.push(`${f}:${i + 1}: ${line.trim().slice(0, 200)}`);
    });
  }
  sections.push(`--- ${p.name} ---\n${hits.length ? hits.join('\n') : '(no hits)'}\n`);
}
write('grep-findings.txt', sections.join('\n'));
console.log('  ->', join(OUT_DIR, 'grep-findings.txt'));

// ---------------------------------------------------------------------------
// 5. Env summary
// ---------------------------------------------------------------------------
hr('5. Env files summary');
const envFiles = ['.env', '.env.local', '.env.production', '.env.development', '.env.example'];
let envReport = '';
for (const f of envFiles) {
  if (existsSync(f)) {
    envReport += `--- ${f} (keys only, values stripped) ---\n`;
    envReport += readFileSync(f, 'utf8').replace(/=.*/g, '=***') + '\n';
  }
}
try {
  const tracked = safeExec('git ls-files').split('\n').filter((l) => /^\.env(\.|$)/.test(l));
  if (tracked.length) envReport += `\nWARNING: .env* files tracked by git:\n${tracked.join('\n')}\n`;
} catch { /* no git */ }
write('env-summary.txt', envReport || '(no .env files found)');
console.log('  ->', join(OUT_DIR, 'env-summary.txt'));

// ---------------------------------------------------------------------------
// 6. next.config headers check
// ---------------------------------------------------------------------------
hr('6. next.config headers check');
const CONFIGS = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
const HEADERS = [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Content-Security-Policy',
  'Permissions-Policy',
];
let hdrReport = '';
for (const cfg of CONFIGS) {
  if (existsSync(cfg)) {
    const body = readFileSync(cfg, 'utf8');
    hdrReport += `--- ${cfg} ---\n`;
    for (const h of HEADERS) hdrReport += body.includes(h) ? `  PRESENT: ${h}\n` : `  MISSING: ${h}\n`;
  }
}
write('next-config-headers.txt', hdrReport || '(no next.config.* found)');
console.log('  ->', join(OUT_DIR, 'next-config-headers.txt'));

hr(`scan.ts complete — outputs in ${OUT_DIR}/`);
process.exit(0);
