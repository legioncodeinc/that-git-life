#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { jsonOut, listFilesRecursive, parseArgs, rel } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-code-map.mjs --root <repo> [--scope <path>] [--out CODE_MAP.md] [--max-files 150] [--include-summaries]");
}

const args = parseArgs(process.argv.slice(2), { "include-summaries": "boolean" });
if (args.help) {
  usage();
  process.exit(0);
}

const root = args.root;
const scope = args.scope || ".";
const base = join(root, scope);
const maxFiles = Number.parseInt(args["max-files"] || "150", 10);
const limit = Number.isFinite(maxFiles) && maxFiles > 0 ? maxFiles : 150;
const ignored = new Set([".git", "node_modules", ".agents", ".codex", "library", "dist", "build", ".next", "coverage"]);
const codeExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".vue", ".svelte"]);
const matchedFiles = existsSync(base)
  ? listFilesRecursive(base)
      .filter((file) => !rel(root, file).split("/").some((part) => ignored.has(part)))
      .filter((file) => codeExts.has(extname(file)))
  : [];
const files = matchedFiles.slice(0, limit);

function summarize(file) {
  const text = readFileSync(file, "utf8").slice(0, 20000);
  const exports = [...text.matchAll(/^\s*export\s+(?:async\s+)?(?:function|class|const|let|var|interface|type)\s+([A-Za-z0-9_$]+)/gm)].map((m) => m[1]);
  const defaultExport = /export\s+default\s+/m.test(text);
  const routes = [
    ...text.matchAll(/\b(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)/g),
    ...text.matchAll(/\b(?:GET|POST|PUT|PATCH|DELETE)\s*=/g),
  ].map((m) => (m[2] ? `${m[1].toUpperCase()} ${m[2]}` : m[0].replace(/\s*=/, "")));
  const tests = /\.(test|spec)\.[cm]?[jt]sx?$/.test(file) || /\b(describe|it|test)\s*\(/.test(text);
  return {
    file: rel(root, file),
    exports,
    defaultExport,
    routes,
    tests,
  };
}

const summaries = files.map(summarize);
const out = join(root, args.out || "CODE_MAP.md");
const body = [
  "# Code Map",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Scope: ${scope}`,
  "",
  "| File | Exports | Routes | Test file |",
  "|---|---|---|---|",
  ...summaries.map((item) => `| \`${item.file}\` | ${[...item.exports, item.defaultExport ? "default" : ""].filter(Boolean).join(", ") || "-"} | ${item.routes.join(", ") || "-"} | ${item.tests ? "yes" : "no"} |`),
  "",
].join("\n");
writeFileSync(out, body);

const payload = {
  ok: true,
  scope,
  out: rel(root, out),
  files: summaries.length,
  totalMatchedFiles: matchedFiles.length,
  truncated: matchedFiles.length > files.length,
  sampleFiles: summaries.slice(0, 10).map((item) => item.file),
};

if (args["include-summaries"]) {
  payload.summaries = summaries;
}

jsonOut(payload);
