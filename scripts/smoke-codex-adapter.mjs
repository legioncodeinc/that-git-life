#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function usage() {
  console.log(`Usage:
  node scripts/smoke-codex-adapter.mjs [--profile core|autopilot|all] [--agents-mode auto|fragment|merge|both] [--install-mode committed-project|local-only|ci-safe] [--with-research] [--keep]
`);
}

function parseArgs(argv) {
  const args = {
    profile: "autopilot",
    agentsMode: "both",
    installMode: "committed-project",
    withResearch: false,
    keep: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--profile") {
      args.profile = argv[++i] ?? "";
      continue;
    }
    if (arg === "--agents-mode") {
      args.agentsMode = argv[++i] ?? "";
      continue;
    }
    if (arg === "--install-mode") {
      args.installMode = argv[++i] ?? "";
      continue;
    }
    if (arg === "--with-research") {
      args.withResearch = true;
      continue;
    }
    if (arg === "--keep") {
      args.keep = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!["core", "autopilot", "all"].includes(args.profile)) throw new Error("--profile must be core, autopilot, or all");
  if (!["auto", "fragment", "merge", "both"].includes(args.agentsMode)) {
    throw new Error("--agents-mode must be auto, fragment, merge, or both");
  }
  if (!["committed-project", "local-only", "ci-safe"].includes(args.installMode)) {
    throw new Error("--install-mode must be committed-project, local-only, or ci-safe");
  }
  return args;
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd || ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function runJson(command, args, options = {}) {
  const stdout = run(command, args, options);
  return stdout ? JSON.parse(stdout) : {};
}

function writeSeedProject(root) {
  mkdirSync(join(root, "src"), { recursive: true });
  mkdirSync(join(root, "test"), { recursive: true });
  writeFileSync(
    join(root, "package.json"),
    `${JSON.stringify(
      {
        name: "tgl-codex-smoke",
        private: true,
        type: "module",
        scripts: {
          test: "node --test",
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(root, "src", "slugify.js"),
    `export function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
`,
  );
  writeFileSync(
    join(root, "test", "slugify.test.js"),
    `import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/slugify.js";

test("slugify normalizes words", () => {
  assert.equal(slugify("Hello, Codex Adapter!"), "hello-codex-adapter");
});
`,
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const target = mkdtempSync(join(tmpdir(), "tgl-codex-smoke-"));
  let ok = false;

  try {
    writeSeedProject(target);
    run("git", ["init"], { cwd: target });
    run("git", ["add", "."], { cwd: target });
    run("git", ["-c", "user.name=That Git Life Smoke", "-c", "user.email=smoke@example.invalid", "commit", "-m", "seed smoke project"], {
      cwd: target,
    });

    const buildArgs = [
      join(ROOT, "scripts", "build-codex-adapter.mjs"),
      "--out",
      target,
      "--profile",
      args.profile,
      "--agents-mode",
      args.agentsMode,
      "--install-mode",
      args.installMode,
      "--clean",
    ];
    if (args.withResearch) buildArgs.push("--with-research");

    const build = runJson("node", buildArgs);
    const validation = runJson("node", [join(ROOT, "scripts", "validate-codex-adapter.mjs"), "--root", target]);
    const inspect = runJson("node", [join(target, ".codex", "that-git-life", "scripts", "tgl-inspect-project.mjs"), "--root", target]);
    const bootstrap = runJson("node", [join(target, ".codex", "that-git-life", "scripts", "tgl-bootstrap-library.mjs"), "--root", target]);
    const doctor = runJson("node", [join(target, ".codex", "that-git-life", "scripts", "tgl-doctor.mjs"), "--root", target]);
    const backwardsPrd = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-backwards-prd.mjs"),
      "--root",
      target,
      "--title",
      "Existing slug utility",
      "--scope",
      "src",
      "--lifecycle",
      "completed",
    ]);
    const prd = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-new-prd.mjs"),
      "--root",
      target,
      "--title",
      "Add slug length option",
      "--summary",
      "Add an optional maximum length for generated slugs.",
    ]);
    const start = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-start-work.mjs"),
      "--root",
      target,
      "--artifact",
      prd.dir,
    ]);
    const codeMapCompact = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-code-map.mjs"),
      "--root",
      target,
      "--scope",
      "src",
    ]);
    const codeMapFull = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-code-map.mjs"),
      "--root",
      target,
      "--scope",
      "src",
      "--include-summaries",
    ]);
    const ledger = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-ledger.mjs"),
      "--root",
      target,
      "--from",
      start.to,
    ]);
    const gate = runJson("node", [join(target, ".codex", "that-git-life", "scripts", "tgl-gate-status.mjs"), "--root", target]);
    const tests = run("npm", ["test"], { cwd: target });
    const runSummary = runJson("node", [
      join(target, ".codex", "that-git-life", "scripts", "tgl-run-summary.mjs"),
      "--root",
      target,
      "--governing-artifact",
      start.to,
      "--ledger",
      ledger.ledger,
      "--command",
      "npm test",
      "--verification",
      "node --test passed",
      "--successful-proof-count",
      "1",
      "--known-limit",
      "Disposable smoke repo has no remote PR.",
    ]);

    run("git", ["add", "."], { cwd: target });
    const diffCheck = run("git", ["diff", "--cached", "--check"], { cwd: target });

    ok = true;
    console.log(
      JSON.stringify(
        {
          ok: true,
          root: target,
          retained: args.keep,
          profile: args.profile,
          agentsMode: args.agentsMode,
          installMode: args.installMode,
          withResearch: args.withResearch,
          build,
          validation,
          doctor: {
            ok: doctor.ok,
            blockers: doctor.blockers?.length || 0,
          },
          inspect: {
            codeFiles: inspect.codeFiles,
            backwardsPrdFirst: inspect.recommendations?.backwardsPrdFirst,
          },
          bootstrap,
          backwardsPrd: {
            dir: backwardsPrd.dir,
            evidenceFiles: backwardsPrd.evidenceFiles?.length || 0,
          },
          prd: {
            dir: prd.dir,
            startedAt: start.to,
          },
          codeMap: {
            compactHasSummaries: Object.hasOwn(codeMapCompact, "summaries"),
            fullSummaries: codeMapFull.summaries?.length || 0,
          },
          ledger: {
            file: ledger.ledger,
            criteria: ledger.criteria,
          },
          gate: {
            ok: gate.ok,
            warnings: gate.warnings?.length || 0,
            blockers: gate.blockers?.length || 0,
          },
          runSummary: {
            path: runSummary.path,
            commands: runSummary.summary?.commandsRun?.length || 0,
            proofs: runSummary.summary?.successfulProofCounts?.total || 0,
          },
          tests: tests.split("\n").slice(-2),
          diffCheck: diffCheck || "clean",
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          root: target,
          retained: true,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } finally {
    if (ok && !args.keep) {
      rmSync(target, { recursive: true, force: true });
    } else if (ok) {
      console.error(`Smoke repo retained at ${target}`);
    } else {
      console.error(`Failed smoke repo retained at ${target}`);
    }
  }
}

main();
