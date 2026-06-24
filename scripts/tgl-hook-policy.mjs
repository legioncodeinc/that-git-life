#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { git, jsonOut, listDirs, parseArgs } from "./tgl-utils.mjs";

const args = parseArgs(process.argv.slice(2));
const mode = process.env.TGL_HOOK_ENFORCEMENT === "block" ? "block" : "warn";
const event = args.event || "unknown";
const warnings = [];
const branch = git(args.root, ["branch", "--show-current"]);
const status = git(args.root, ["status", "--short"]);
const changed = status ? status.split("\n") : [];
const codeChanged = changed.some((line) => /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|vue|svelte)\b/.test(line));
const hasLibrary = existsSync(join(args.root, "library"));
const hasLedger = existsSync(join(args.root, "EXECUTION_LEDGER.md"));
const hasOpenLedger = hasLedger && /\|\s*(OPEN|IN_PROGRESS|DONE)\s*\|/.test(readFileSync(join(args.root, "EXECUTION_LEDGER.md"), "utf8"));
const prdCount = ["backlog", "in-work", "completed"]
  .map((state) => listDirs(join(args.root, "library", "requirements", state)).filter((p) => /^prd-\d+-/.test(basename(p))).length)
  .reduce((a, b) => a + b, 0);
const irdCount = ["backlog", "in-work", "completed"]
  .map((state) => listDirs(join(args.root, "library", "issues", state)).filter((p) => /^ird-\d+-/.test(basename(p))).length)
  .reduce((a, b) => a + b, 0);

if ((branch === "main" || branch === "master") && codeChanged) {
  warnings.push(`Code changes detected on ${branch}; feature work should use a branch or worktree.`);
}
if (codeChanged && (!hasLibrary || (prdCount + irdCount === 0))) {
  warnings.push("Code changes detected without a That Git Life PRD, IRD, or backwards PRD.");
}
if (event === "Stop" && hasOpenLedger) {
  warnings.push("Execution ledger still has OPEN, IN_PROGRESS, or DONE criteria. Do not claim complete until criteria are VERIFIED or BLOCKED.");
}

const payload = { ts: new Date().toISOString(), event, mode, branch, codeChanged, warnings };
const dir = join(args.root, ".codex", "that-git-life");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "policy-warnings.jsonl"), `${JSON.stringify(payload)}\n`, { flag: "a" });
jsonOut(payload);

if (mode === "block" && warnings.length) process.exit(1);
