#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { git, jsonOut, parseArgs } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-gate-status.mjs --root <repo>");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

const warnings = [];
const branch = git(args.root, ["branch", "--show-current"]);
const status = git(args.root, ["status", "--short"]);
const ledgerPath = join(args.root, "EXECUTION_LEDGER.md");
const libraryExists = existsSync(join(args.root, "library"));

if (!libraryExists) warnings.push("library/ is missing. Run tgl-bootstrap-library before PRD, IRD, or ADR work.");
if (branch === "main" || branch === "master") warnings.push(`Current branch is ${branch}. Feature implementation should use a feature branch or worktree.`);
if (!ledgerPath || !existsSync(ledgerPath)) warnings.push("EXECUTION_LEDGER.md is missing. Generate it before executing a PRD or IRD.");

let ledger = { open: 0, inProgress: 0, done: 0, verified: 0, blocked: 0 };
if (existsSync(ledgerPath)) {
  const text = readFileSync(ledgerPath, "utf8");
  ledger = {
    open: (text.match(/\|\s*OPEN\s*\|/g) || []).length,
    inProgress: (text.match(/\|\s*IN_PROGRESS\s*\|/g) || []).length,
    done: (text.match(/\|\s*DONE\s*\|/g) || []).length,
    verified: (text.match(/\|\s*VERIFIED\s*\|/g) || []).length,
    blocked: (text.match(/\|\s*BLOCKED\s*\|/g) || []).length,
  };
  if (ledger.open || ledger.inProgress || ledger.done) {
    warnings.push("Ledger still has criteria that are not VERIFIED or BLOCKED.");
  }
}

jsonOut({
  ok: warnings.length === 0,
  root: args.root,
  branch,
  dirty: Boolean(status),
  libraryExists,
  ledger,
  warnings,
});
