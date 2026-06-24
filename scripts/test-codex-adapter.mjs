#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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

function seedRepo(root) {
  writeFileSync(join(root, "package.json"), `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`);
  run("git", ["init"], { cwd: root });
  run("git", ["add", "."], { cwd: root });
  run("git", ["-c", "user.name=That Git Life Test", "-c", "user.email=test@example.invalid", "commit", "-m", "seed"], {
    cwd: root,
  });
}

function buildFixture(installMode) {
  const target = mkdtempSync(join(tmpdir(), `tgl-adapter-${installMode}-`));
  seedRepo(target);
  const build = runJson("node", [
    join(ROOT, "scripts", "build-codex-adapter.mjs"),
    "--out",
    target,
    "--profile",
    "autopilot",
    "--agents-mode",
    "both",
    "--install-mode",
    installMode,
    "--clean",
  ]);
  return { target, build };
}

function assertRouterWording(target) {
  const router = readFileSync(join(target, ".agents", "skills", "that-git-life", "SKILL.md"), "utf8");
  assert.match(router, /Prompt examples, route examples, and user-supplied path guesses are candidate inputs only/);
  assert.match(router, /discover the real repo inventory/);
  assert.match(router, /Plans, PRDs, IRDs, ADRs, code maps, and ledgers are working artifacts/);
  assert.match(router, /repo inspection.*library bootstrap.*backwards PRD.*governing PRD\/IRD\/ADR.*EXECUTION_LEDGER\.md.*branch.*implementation.*verification.*PR.*checks.*authorized merge/is);
}

function main() {
  const retained = [];
  try {
    for (const mode of ["committed-project", "local-only", "ci-safe"]) {
      const { target, build } = buildFixture(mode);
      retained.push(target);
      assert.equal(build.installMode, mode);
      const manifest = JSON.parse(readFileSync(join(target, ".codex", "that-git-life", "manifest.json"), "utf8"));
      assert.equal(manifest.installMode, mode);

      const validation = runJson("node", [join(ROOT, "scripts", "validate-codex-adapter.mjs"), "--root", target]);
      assert.equal(validation.ok, true);
      runJson("node", [join(target, ".codex", "that-git-life", "scripts", "tgl-bootstrap-library.mjs"), "--root", target]);

      const doctor = runJson("node", [join(target, ".codex", "that-git-life", "scripts", "tgl-doctor.mjs"), "--root", target]);
      assert.equal(doctor.ok, true);

      assertRouterWording(target);
      assert.equal(existsSync(join(target, ".codex", "that-git-life", "run-summary.json")), true);

      const summary = runJson("node", [
        join(target, ".codex", "that-git-life", "scripts", "tgl-run-summary.mjs"),
        "--root",
        target,
        "--command",
        "node scripts/test-codex-adapter.mjs",
        "--verification",
        `${mode} validation passed`,
        "--successful-proof-count",
        "1",
      ]);
      assert.equal(summary.ok, true);
      assert.equal(summary.summary.successfulProofCounts.total, 1);

      if (mode === "local-only") {
        assert.equal(manifest.localGitExclude, true);
        assert.equal(run("git", ["check-ignore", ".agents"], { cwd: target }), ".agents");
      }
      if (mode === "ci-safe") {
        assert.equal(manifest.hooks, false);
        assert.equal(existsSync(join(target, ".codex", "hooks.json")), false);
      } else {
        assert.equal(manifest.hooks, true);
        assert.equal(existsSync(join(target, ".codex", "hooks.json")), true);
      }
    }

    const transition = buildFixture("committed-project");
    retained.push(transition.target);
    assert.equal(existsSync(join(transition.target, ".codex", "hooks.json")), true);
    runJson("node", [
      join(ROOT, "scripts", "build-codex-adapter.mjs"),
      "--out",
      transition.target,
      "--profile",
      "autopilot",
      "--agents-mode",
      "both",
      "--install-mode",
      "ci-safe",
      "--clean",
    ]);
    assert.equal(existsSync(join(transition.target, ".codex", "hooks.json")), false);
    const transitionValidation = runJson("node", [join(ROOT, "scripts", "validate-codex-adapter.mjs"), "--root", transition.target]);
    assert.equal(transitionValidation.ok, true);

    console.log(JSON.stringify({ ok: true, fixtures: retained.length }, null, 2));
  } finally {
    for (const path of retained) rmSync(path, { recursive: true, force: true });
  }
}

main();
