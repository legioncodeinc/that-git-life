#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { git, jsonOut, parseArgs, rel, run } from "./tgl-utils.mjs";

function usage() {
  console.log(`Usage:
  node .codex/that-git-life/scripts/tgl-run-summary.mjs --root <repo> [options]

Options:
  --governing-artifact <path>   PRD, IRD, or ADR governing this run
  --ledger <path>               Ledger path, usually EXECUTION_LEDGER.md
  --command <text>              Command that was run, repeatable
  --verification <text>         Verification output summary, repeatable
  --report <path>               Report or proof path, repeatable
  --known-limit <text>          Known limit or unproven boundary, repeatable
  --failure-count <n>           Total known failures
  --successful-proof-count <n>  Total successful proof count
`);
}

function values(value) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function parseCount(value) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid count: ${value}`);
  }
  return parsed;
}

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function currentPrUrl(root) {
  const gh = run(root, "gh", ["pr", "view", "--json", "url", "--jq", ".url"]);
  return gh.ok ? gh.stdout.trim() : "";
}

function currentMergeStatus(root) {
  const gh = run(root, "gh", ["pr", "view", "--json", "state,mergedAt,mergeStateStatus"]);
  if (!gh.ok || !gh.stdout) return "unknown";
  try {
    const parsed = JSON.parse(gh.stdout);
    if (parsed.mergedAt) return "merged";
    if (parsed.state === "OPEN") return parsed.mergeStateStatus ? `open:${parsed.mergeStateStatus}` : "open";
    return String(parsed.state || "unknown").toLowerCase();
  } catch {
    return "unknown";
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2), {
    command: "array",
    verification: "array",
    report: "array",
    "known-limit": "array",
  });
  if (args.help) {
    usage();
    process.exit(0);
  }

  const summaryPath = join(args.root, ".codex", "that-git-life", "run-summary.json");
  const existing = readJson(summaryPath, {});
  const failureTotal = parseCount(args["failure-count"]);
  const proofTotal = parseCount(args["successful-proof-count"]);
  const reports = values(args.report).map((path) => rel(args.root, join(args.root, path)));

  const summary = {
    schema: "that-git-life.run-summary.v1",
    generatedAt: new Date().toISOString(),
    branch: git(args.root, ["branch", "--show-current"]),
    commit: git(args.root, ["rev-parse", "HEAD"]),
    prUrl: existing.prUrl || currentPrUrl(args.root),
    mergeStatus: currentMergeStatus(args.root),
    governingArtifactPath: args["governing-artifact"] || existing.governingArtifactPath || "",
    ledgerPath: args.ledger || existing.ledgerPath || (existsSync(join(args.root, "EXECUTION_LEDGER.md")) ? "EXECUTION_LEDGER.md" : ""),
    commandsRun: [...values(existing.commandsRun), ...values(args.command)].filter(Boolean),
    verificationOutputs: [...values(existing.verificationOutputs), ...values(args.verification)].filter(Boolean),
    reportPaths: [...values(existing.reportPaths), ...reports].filter(Boolean),
    failureCounts: {
      total: failureTotal ?? existing.failureCounts?.total ?? 0,
      tests: existing.failureCounts?.tests ?? 0,
      checks: existing.failureCounts?.checks ?? 0,
      security: existing.failureCounts?.security ?? 0,
      quality: existing.failureCounts?.quality ?? 0,
    },
    successfulProofCounts: {
      total: proofTotal ?? existing.successfulProofCounts?.total ?? 0,
      tests: existing.successfulProofCounts?.tests ?? 0,
      checks: existing.successfulProofCounts?.checks ?? 0,
      security: existing.successfulProofCounts?.security ?? 0,
      quality: existing.successfulProofCounts?.quality ?? 0,
    },
    knownLimits: [...values(existing.knownLimits), ...values(args["known-limit"])].filter(Boolean),
  };

  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  jsonOut({ ok: true, path: rel(args.root, summaryPath), summary });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
