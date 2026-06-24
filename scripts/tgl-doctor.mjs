#!/usr/bin/env node
import { accessSync, constants, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { git, jsonOut, parseArgs, run } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node .codex/that-git-life/scripts/tgl-doctor.mjs --root <repo>");
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

function check(name, ok, details = {}) {
  return { name, ok: Boolean(ok), ...details };
}

function executable(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function hookCommandLooksSafe(command) {
  if (!command) return false;
  if (!command.includes(".codex/that-git-life") && !command.includes(".codex/hooks")) return false;
  return !/(curl|wget|nc|ncat|rm\s+-rf|sudo|chmod\s+777|eval\s|base64\s+-d|osascript)/.test(command);
}

function collectHookCommands(parsed) {
  const commands = [];
  for (const hooks of Object.values(parsed.hooks || {})) {
    for (const group of hooks || []) {
      for (const hook of group.hooks || []) {
        if (hook.type === "command") commands.push(hook.command || "");
      }
    }
  }
  return commands;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    process.exit(0);
  }

  const manifestPath = join(args.root, ".codex", "that-git-life", "manifest.json");
  const manifest = readJson(manifestPath);
  const hooksExpected = manifest.hooks !== false && manifest.installMode !== "ci-safe";
  const hooksPath = join(args.root, ".codex", "hooks.json");
  const hookScript = join(args.root, ".codex", "hooks", "that-git-life-hook.mjs");
  const hookPolicy = join(args.root, ".codex", "that-git-life", "scripts", "tgl-hook-policy.mjs");
  const hookCommands = existsSync(hooksPath) ? collectHookCommands(readJson(hooksPath)) : [];
  const ghVersion = run(args.root, "gh", ["--version"]);
  const ghAuth = run(args.root, "gh", ["auth", "status"]);
  const status = git(args.root, ["status", "--short"]);
  const branch = git(args.root, ["branch", "--show-current"]);
  const committedProject = manifest.installMode === "committed-project";
  const localOnly = manifest.installMode === "local-only";
  const ciSafe = manifest.installMode === "ci-safe";

  const checks = [
    check("adapter install", existsSync(join(args.root, ".codex", "that-git-life")) && existsSync(join(args.root, ".agents", "skills"))),
    check("manifest", manifest.adapter === "that-git-life-codex" && Boolean(manifest.installMode), {
      installMode: manifest.installMode || "missing",
      profile: manifest.profile || "missing",
    }),
    check("generated router", existsSync(join(args.root, ".agents", "skills", "that-git-life", "SKILL.md"))),
    check("runtime scripts", existsSync(join(args.root, ".codex", "that-git-life", "scripts", "tgl-doctor.mjs"))),
    check("run summary", existsSync(join(args.root, ".codex", "that-git-life", "run-summary.json"))),
    check("hooks", hooksExpected ? existsSync(hooksPath) && existsSync(hookScript) : !existsSync(hooksPath), {
      expected: hooksExpected,
    }),
    check("hook script safety", hooksExpected ? executable(hookScript) && executable(hookPolicy) && hookCommands.every(hookCommandLooksSafe) : true, {
      commands: hookCommands.length,
    }),
    check("AGENTS wiring", existsSync(join(args.root, "AGENTS.that-git-life.md")) || (existsSync(join(args.root, "AGENTS.md")) && readFileSync(join(args.root, "AGENTS.md"), "utf8").includes("that-git-life-codex:start"))),
    check("library structure", existsSync(join(args.root, "library", "requirements")) && existsSync(join(args.root, "library", "issues"))),
    check("git state", Boolean(git(args.root, ["rev-parse", "--show-toplevel"])), {
      branch,
      dirty: Boolean(status),
    }),
    check("GitHub CLI", ghVersion.ok, {
      authenticated: ghAuth.ok,
    }),
    check("install mode", committedProject || localOnly || ciSafe, {
      committedProject,
      localOnly,
      ciSafe,
      localGitExclude: Boolean(manifest.localGitExclude),
    }),
  ];

  const blockers = checks.filter((item) => !item.ok && item.name !== "GitHub CLI");
  jsonOut({
    ok: blockers.length === 0,
    root: args.root,
    manifestPath: existsSync(manifestPath) ? ".codex/that-git-life/manifest.json" : "",
    checks,
    blockers: blockers.map((item) => item.name),
  });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
