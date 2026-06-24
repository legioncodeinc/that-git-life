#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { git, jsonOut, listDirs, listFilesRecursive, parseArgs, rel } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-inspect-project.mjs --root <repo>");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

const req = join(args.root, "library", "requirements");
const issues = join(args.root, "library", "issues");
const arch = join(args.root, "library", "knowledge", "private", "architecture");
const branch = git(args.root, ["branch", "--show-current"]);
const status = git(args.root, ["status", "--short"]);
const ignoredDirs = new Set([".git", "node_modules", ".agents", ".codex", "library", "dist", "build", ".next", "coverage"]);

function topLevelEntries(root) {
  return readdirSync(root)
    .filter((entry) => !ignoredDirs.has(entry))
    .sort()
    .map((entry) => {
      const full = join(root, entry);
      const stat = statSync(full);
      return { name: entry, type: stat.isDirectory() ? "dir" : "file" };
    });
}

function filteredRepoFiles(root) {
  return listFilesRecursive(root).filter((file) => {
    const parts = rel(root, file).split("/");
    return !parts.some((part) => ignoredDirs.has(part));
  });
}

function existingPaths(paths) {
  return paths.filter((path) => existsSync(join(args.root, path)));
}

function packageInfo() {
  const path = join(args.root, "package.json");
  if (!existsSync(path)) return {};
  try {
    const pkg = JSON.parse(readFileSync(path, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const frameworks = [];
    for (const [name, label] of [
      ["next", "Next.js"],
      ["react", "React"],
      ["vite", "Vite"],
      ["vue", "Vue"],
      ["svelte", "Svelte"],
      ["express", "Express"],
      ["fastify", "Fastify"],
      ["typescript", "TypeScript"],
      ["vitest", "Vitest"],
      ["jest", "Jest"],
      ["playwright", "Playwright"],
    ]) {
      if (deps?.[name]) frameworks.push(label);
    }
    return {
      name: pkg.name || "",
      scripts: Object.keys(pkg.scripts || {}).sort(),
      packageManager: pkg.packageManager || "",
      frameworks,
    };
  } catch {
    return { parseError: true };
  }
}

function extensionCounts(files) {
  const counts = {};
  for (const file of files) {
    const ext = extname(file) || basename(file);
    counts[ext] = (counts[ext] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12));
}

function codeCandidates(files) {
  const codeExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".rb", ".php", ".java", ".cs", ".swift", ".kt", ".vue", ".svelte"]);
  return files.filter((file) => codeExts.has(extname(file))).map((file) => rel(args.root, file));
}

function countDirs(base, pattern) {
  return listDirs(base).filter((p) => pattern.test(basename(p))).length;
}

const repoFiles = filteredRepoFiles(args.root);
const code = codeCandidates(repoFiles);
const prdCounts = {
  backlog: countDirs(join(req, "backlog"), /^prd-\d+-/),
  inWork: countDirs(join(req, "in-work"), /^prd-\d+-/),
  completed: countDirs(join(req, "completed"), /^prd-\d+-/),
};
const irdCounts = {
  backlog: countDirs(join(issues, "backlog"), /^ird-\d+-/),
  inWork: countDirs(join(issues, "in-work"), /^ird-\d+-/),
  completed: countDirs(join(issues, "completed"), /^ird-\d+-/),
};
const totalPrds = prdCounts.backlog + prdCounts.inWork + prdCounts.completed;
const libraryExists = existsSync(join(args.root, "library"));
const hasExistingCode = code.length > 0;

jsonOut({
  ok: true,
  root: args.root,
  git: {
    branch,
    hasRemote: Boolean(git(args.root, ["remote"])),
    dirty: Boolean(status),
    status: status ? status.split("\n") : [],
  },
  library: {
    exists: libraryExists,
    requirementsExists: existsSync(req),
    issuesExists: existsSync(issues),
    architectureExists: existsSync(arch),
    schemaV2Likely:
      existsSync(join(req, "backlog")) &&
      existsSync(join(req, "in-work")) &&
      existsSync(join(req, "completed")) &&
      existsSync(join(args.root, "library", "knowledge", "private", "architecture")),
    staleV1Paths: existingPaths([
      "library/knowledge-base",
      "library/architecture",
      "library/requirements/features",
      "library/requirements/issues",
      "library/qa",
    ]),
  },
  docs: {
    prds: prdCounts,
    irds: irdCounts,
    adrs: listFilesRecursive(arch).filter((file) => /\/ADR-\d+/i.test(file)).length,
    hasLedger: existsSync(join(args.root, "EXECUTION_LEDGER.md")),
  },
  repo: {
    topLevel: topLevelEntries(args.root),
    package: packageInfo(),
    sourceDirs: existingPaths(["src", "app", "pages", "api", "server", "components", "lib", "packages", "apps"]),
    testDirs: existingPaths(["test", "tests", "__tests__", "e2e", "cypress", "playwright"]),
    ci: existingPaths([".github/workflows"]),
    configFiles: existingPaths([
      "package.json",
      "pnpm-workspace.yaml",
      "turbo.json",
      "next.config.js",
      "next.config.mjs",
      "vite.config.ts",
      "vite.config.js",
      "tsconfig.json",
      ".env.example",
      "README.md",
    ]),
    fileCount: repoFiles.length,
    codeFileCount: code.length,
    extensionCounts: extensionCounts(repoFiles),
    sampleCodeFiles: code.slice(0, 40),
  },
  recommendations: {
    bootstrapLibrary: !libraryExists,
    backwardsPrdFirst: hasExistingCode && totalPrds === 0,
    reason: hasExistingCode && totalPrds === 0
      ? "Existing code is present but no PRDs were found. Create backwards PRDs before planning new feature work."
      : !libraryExists
        ? "library/ is missing. Bootstrap the That Git Life library before writing PRDs, IRDs, or ADRs."
        : "Use existing library artifacts to route the task.",
  },
});
