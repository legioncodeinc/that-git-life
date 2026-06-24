#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { git, jsonOut, parseArgs, run } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-ship-preflight.mjs --root <repo>");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

let packageJson = {};
try {
  packageJson = JSON.parse(readFileSync(join(args.root, "package.json"), "utf8"));
} catch {
  packageJson = {};
}

const remotes = git(args.root, ["remote", "-v"]);
const branch = git(args.root, ["branch", "--show-current"]);
const defaultBranch = git(args.root, ["symbolic-ref", "refs/remotes/origin/HEAD"]);
const gh = run(args.root, "gh", ["auth", "status"]);
const scripts = Object.keys(packageJson.scripts || {}).sort();
const checks = {
  gitRepo: Boolean(git(args.root, ["rev-parse", "--show-toplevel"])),
  branch,
  onMain: branch === "main" || branch === "master",
  remote: Boolean(remotes),
  defaultBranch: defaultBranch.replace("refs/remotes/origin/", ""),
  ghAuth: gh.ok,
  packageScripts: scripts,
  testCommand: scripts.includes("test") ? "npm test" : "",
  lintCommand: scripts.includes("lint") ? "npm run lint" : "",
  ci: existsSync(join(args.root, ".github", "workflows")),
};

const blockers = [];
if (!checks.gitRepo) blockers.push("Not a git repository.");
if (!checks.remote) blockers.push("No git remote configured.");
if (!checks.ghAuth) blockers.push("GitHub CLI is not authenticated or unavailable.");
if (!checks.testCommand) blockers.push("No package.json test script detected; define a verification fallback before merge.");

jsonOut({ ok: blockers.length === 0, root: args.root, checks, blockers });
