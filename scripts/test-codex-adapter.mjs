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

function buildGlobalLauncherFixture() {
  const target = mkdtempSync(join(tmpdir(), "tgl-global-launcher-"));
  const build = runJson("node", [
    join(ROOT, "scripts", "build-codex-adapter.mjs"),
    "--out",
    target,
    "--install-mode",
    "global-launcher",
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
  assert.match(router, /--lifecycle completed/);
  assert.match(router, /mandatory closeout for merged work/);
  assert.match(router, /verify `EXECUTION_LEDGER\.md` no longer references the old `in-work` path/);
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

    const ignoreTransition = buildFixture("local-only");
    retained.push(ignoreTransition.target);
    assert.equal(run("git", ["check-ignore", ".agents"], { cwd: ignoreTransition.target }), ".agents");
    runJson("node", [
      join(ROOT, "scripts", "build-codex-adapter.mjs"),
      "--out",
      ignoreTransition.target,
      "--profile",
      "autopilot",
      "--agents-mode",
      "both",
      "--install-mode",
      "committed-project",
    ]);
    assert.throws(() => run("git", ["check-ignore", ".agents"], { cwd: ignoreTransition.target }));

    const summaryTarget = buildFixture("committed-project");
    retained.push(summaryTarget.target);
    runJson("node", [
      join(summaryTarget.target, ".codex", "that-git-life", "scripts", "tgl-run-summary.mjs"),
      "--root",
      summaryTarget.target,
      "--command",
      "first proof",
      "--successful-proof-count",
      "1",
    ]);
    runJson("node", [
      join(ROOT, "scripts", "build-codex-adapter.mjs"),
      "--out",
      summaryTarget.target,
      "--profile",
      "autopilot",
      "--agents-mode",
      "both",
      "--install-mode",
      "committed-project",
    ]);
    const preserved = JSON.parse(readFileSync(join(summaryTarget.target, ".codex", "that-git-life", "run-summary.json"), "utf8"));
    assert.deepEqual(preserved.commandsRun, ["first proof"]);
    assert.throws(() =>
      run("node", [
        join(summaryTarget.target, ".codex", "that-git-life", "scripts", "tgl-run-summary.mjs"),
        "--root",
        summaryTarget.target,
        "--successful-proof-count",
        "one",
      ]),
    );

    const closeoutTarget = buildFixture("committed-project");
    retained.push(closeoutTarget.target);
    runJson("node", [join(closeoutTarget.target, ".codex", "that-git-life", "scripts", "tgl-bootstrap-library.mjs"), "--root", closeoutTarget.target]);
    const closeoutPrd = runJson("node", [
      join(closeoutTarget.target, ".codex", "that-git-life", "scripts", "tgl-new-prd.mjs"),
      "--root",
      closeoutTarget.target,
      "--title",
      "Closeout path rewrite",
    ]);
    const closeoutStart = runJson("node", [
      join(closeoutTarget.target, ".codex", "that-git-life", "scripts", "tgl-start-work.mjs"),
      "--root",
      closeoutTarget.target,
      "--artifact",
      closeoutPrd.dir,
    ]);
    runJson("node", [
      join(closeoutTarget.target, ".codex", "that-git-life", "scripts", "tgl-ledger.mjs"),
      "--root",
      closeoutTarget.target,
      "--from",
      closeoutStart.to,
    ]);
    runJson("node", [
      join(closeoutTarget.target, ".codex", "that-git-life", "scripts", "tgl-run-summary.mjs"),
      "--root",
      closeoutTarget.target,
      "--governing-artifact",
      closeoutStart.to,
      "--ledger",
      "EXECUTION_LEDGER.md",
    ]);
    const complete = runJson("node", [
      join(closeoutTarget.target, ".codex", "that-git-life", "scripts", "tgl-complete-work.mjs"),
      "--root",
      closeoutTarget.target,
      "--artifact",
      closeoutStart.to,
    ]);
    assert.equal(complete.ledgerUpdated, true);
    assert.equal(complete.runSummaryUpdated, true);
    assert.match(complete.to, /library\/requirements\/completed\/prd-/);
    assert.doesNotMatch(readFileSync(join(closeoutTarget.target, "EXECUTION_LEDGER.md"), "utf8"), /library\/requirements\/in-work\//);
    assert.match(readFileSync(join(closeoutTarget.target, "EXECUTION_LEDGER.md"), "utf8"), /library\/requirements\/completed\//);
    const completedSummary = JSON.parse(readFileSync(join(closeoutTarget.target, ".codex", "that-git-life", "run-summary.json"), "utf8"));
    assert.equal(completedSummary.governingArtifactPath, complete.to);

    const globalLauncher = buildGlobalLauncherFixture();
    retained.push(globalLauncher.target);
    assert.equal(globalLauncher.build.installMode, "global-launcher");
    const globalValidation = runJson("node", [
      join(ROOT, "scripts", "validate-codex-adapter.mjs"),
      "--root",
      globalLauncher.target,
      "--global-launcher",
    ]);
    assert.equal(globalValidation.ok, true);
    const canonical = readFileSync(join(globalLauncher.target, "skills", "that-git-life", "SKILL.md"), "utf8");
    const alias = readFileSync(join(globalLauncher.target, "skills", "the-git-life", "SKILL.md"), "utf8");
    assert.match(canonical, /THAT_GIT_LIFE_SOURCE/);
    assert.match(alias, /alias for `\$that-git-life`/);
    assert.doesNotMatch(`${canonical}\n${alias}`, /\/Users\//);

    console.log(JSON.stringify({ ok: true, fixtures: retained.length }, null, 2));
  } finally {
    for (const path of retained) rmSync(path, { recursive: true, force: true });
  }
}

main();
