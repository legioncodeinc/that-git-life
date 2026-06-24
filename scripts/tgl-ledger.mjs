#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { jsonOut, listFilesRecursive, parseArgs, rel, resolveInsideRoot } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-ledger.mjs --root <repo> [--from <prd-or-ird-file-or-dir>] [--out EXECUTION_LEDGER.md]");
}

function markdownFiles(path) {
  if (!path || !existsSync(path)) return [];
  if (path.endsWith(".md")) return [path];
  return listFilesRecursive(path).filter((file) => file.endsWith(".md") && !/\/qa\//.test(file));
}

function extractCriteria(file, root) {
  const text = readFileSync(file, "utf8");
  const rows = [];
  for (const line of text.split("\n")) {
    const table = line.match(/^\|\s*(AC-[A-Za-z0-9_.-]+)\s*\|\s*(.*?)\s*\|/);
    if (table && table[2].trim() && !/^-+$/.test(table[2].trim())) {
      rows.push({ id: table[1], criterion: table[2].trim(), source: rel(root, file) });
    }
    const checkbox = line.match(/^\s*-\s+\[[ xX]\]\s+(AC-[A-Za-z0-9_.-]+)[:\s-]+(.+)/);
    if (checkbox) {
      rows.push({ id: checkbox[1], criterion: checkbox[2].trim(), source: rel(root, file) });
    }
  }
  return rows;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

const source = args.from ? resolveInsideRoot(args.root, args.from, "--from") : join(args.root, "library");
const files = markdownFiles(source);
const criteria = files.flatMap((file) => extractCriteria(file, args.root));
const out = join(args.root, args.out || "EXECUTION_LEDGER.md");

const body = [
  "# Execution Ledger",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Source: ${args.from || "library"}`,
  "",
  "| ID | Status | Owner | Source | Criterion | Verification |",
  "|---|---|---|---|---|---|",
  ...criteria.map((item, index) => {
    const id = item.id || `AC-${index + 1}`;
    return `| ${id} | OPEN | unassigned | ${item.source} | ${item.criterion.replace(/\|/g, "\\|")} | pending |`;
  }),
  "",
  "## Notes",
  "",
  "- Status values: OPEN, IN_PROGRESS, DONE, VERIFIED, BLOCKED.",
  "- A criterion is VERIFIED only after implementation and an independent verification pass.",
  "",
].join("\n");

writeFileSync(out, body);

jsonOut({
  ok: true,
  source: args.from || "library",
  ledger: rel(args.root, out),
  criteria: criteria.length,
  files: files.map((file) => rel(args.root, file)),
  warning: criteria.length ? "" : `No acceptance criteria found under ${basename(source)}`,
});
