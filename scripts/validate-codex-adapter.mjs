#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function usage() {
  console.log(`Usage:
  node scripts/validate-codex-adapter.mjs --root <generated-project>
`);
}

function parseArgs(argv) {
  const args = { root: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--root") {
      args.root = argv[++i] ?? "";
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.root) throw new Error("Missing required --root <generated-project>");
  return args;
}

function walkFiles(root) {
  const files = [];
  function walk(path) {
    for (const entry of readdirSync(path)) {
      const full = join(path, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      if (stat.isFile()) files.push(full);
    }
  }
  if (existsSync(root)) walk(root);
  return files;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return data;
}

function fail(errors, message) {
  errors.push(message);
}

function validateSkills(root, errors) {
  const skillsRoot = join(root, ".agents", "skills");
  if (!existsSync(skillsRoot)) {
    fail(errors, "missing .agents/skills");
    return 0;
  }
  let count = 0;
  for (const skillDir of readdirSync(skillsRoot).sort()) {
    const path = join(skillsRoot, skillDir);
    if (!statSync(path).isDirectory()) continue;
    const skillMd = join(path, "SKILL.md");
    if (!existsSync(skillMd)) {
      fail(errors, `${skillDir}: missing SKILL.md`);
      continue;
    }
    const meta = parseFrontmatter(readFileSync(skillMd, "utf8"));
    if (!meta.name) fail(errors, `${skillDir}: missing skill name frontmatter`);
    if (!meta.description) fail(errors, `${skillDir}: missing skill description frontmatter`);
    count += 1;
  }
  if (!existsSync(join(skillsRoot, "that-git-life", "SKILL.md"))) {
    fail(errors, "missing that-git-life router skill");
  }
  return count;
}

function validateAgents(root, errors) {
  const agentsRoot = join(root, ".codex", "agents");
  if (!existsSync(agentsRoot)) {
    fail(errors, "missing .codex/agents");
    return 0;
  }
  const files = readdirSync(agentsRoot).filter((entry) => entry.endsWith(".toml")).sort();
  for (const file of files) {
    const text = readFileSync(join(agentsRoot, file), "utf8");
    for (const key of ["name", "description", "developer_instructions"]) {
      if (!new RegExp(`^${key} = "`, "m").test(text)) {
        fail(errors, `${file}: missing ${key}`);
      }
    }
    if (/\.cursor\/skills|\.claude\/skills/.test(text)) {
      fail(errors, `${file}: contains stale Cursor or Claude skill path`);
    }
  }
  return files.length;
}

function validateHooks(root, errors) {
  let manifest = {};
  try {
    manifest = JSON.parse(readFileSync(join(root, ".codex", "that-git-life", "manifest.json"), "utf8"));
  } catch {
    manifest = {};
  }
  const hooksExpected = manifest.hooks !== false && manifest.installMode !== "ci-safe";
  const hooksJson = join(root, ".codex", "hooks.json");
  const hookScript = join(root, ".codex", "hooks", "that-git-life-hook.mjs");
  if (!hooksExpected) {
    if (existsSync(hooksJson)) fail(errors, "ci-safe install should not write .codex/hooks.json");
    return;
  }
  if (!existsSync(hooksJson)) fail(errors, "missing .codex/hooks.json");
  if (!existsSync(hookScript)) fail(errors, "missing .codex/hooks/that-git-life-hook.mjs");
  if (existsSync(hooksJson)) {
    const parsed = JSON.parse(readFileSync(hooksJson, "utf8"));
    for (const event of ["SessionStart", "UserPromptSubmit", "Stop"]) {
      if (!parsed.hooks?.[event]) fail(errors, `hooks.json missing ${event}`);
    }
  }
}

function validateGuidance(root, errors) {
  const agentsMd = join(root, "AGENTS.md");
  const fragment = join(root, "AGENTS.that-git-life.md");
  const fragmentExists = existsSync(fragment);
  const agentsHasManagedBlock = existsSync(agentsMd) && readFileSync(agentsMd, "utf8").includes("that-git-life-codex:start");
  if (!fragmentExists && !agentsHasManagedBlock) {
    fail(errors, "missing AGENTS.that-git-life.md or managed that-git-life block in AGENTS.md");
  }
}

function validateManifest(root, errors) {
  const manifestPath = join(root, ".codex", "that-git-life", "manifest.json");
  if (!existsSync(manifestPath)) {
    fail(errors, "missing .codex/that-git-life/manifest.json");
    return {};
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const key of ["adapter", "profile", "installMode", "sourceCommit", "generatedAt", "skills", "agents"]) {
    if (manifest[key] === undefined) fail(errors, `manifest missing ${key}`);
  }
  if (!["committed-project", "local-only", "ci-safe"].includes(manifest.installMode)) {
    fail(errors, `manifest installMode is invalid: ${manifest.installMode}`);
  }
  return manifest;
}

function validateRuntimeScripts(root, errors) {
  const scriptsRoot = join(root, ".codex", "that-git-life", "scripts");
  const required = [
    "tgl-utils.mjs",
    "tgl-inspect-project.mjs",
    "tgl-code-map.mjs",
    "tgl-bootstrap-library.mjs",
    "tgl-new-prd.mjs",
    "tgl-backwards-prd.mjs",
    "tgl-new-ird.mjs",
    "tgl-new-adr.mjs",
    "tgl-ledger.mjs",
    "tgl-gate-status.mjs",
    "tgl-start-work.mjs",
    "tgl-complete-work.mjs",
    "tgl-link-pr.mjs",
    "tgl-ship-preflight.mjs",
    "tgl-hook-policy.mjs",
    "tgl-run-summary.mjs",
    "tgl-doctor.mjs",
  ];
  if (!existsSync(scriptsRoot)) {
    fail(errors, "missing .codex/that-git-life/scripts");
    return;
  }
  for (const script of required) {
    if (!existsSync(join(scriptsRoot, script))) {
      fail(errors, `missing runtime script ${script}`);
    }
  }
}

function validateRunSummary(root, errors) {
  const summaryPath = join(root, ".codex", "that-git-life", "run-summary.json");
  if (!existsSync(summaryPath)) {
    fail(errors, "missing .codex/that-git-life/run-summary.json");
    return;
  }
  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  for (const key of [
    "branch",
    "commit",
    "prUrl",
    "mergeStatus",
    "governingArtifactPath",
    "ledgerPath",
    "commandsRun",
    "verificationOutputs",
    "reportPaths",
    "failureCounts",
    "successfulProofCounts",
    "knownLimits",
  ]) {
    if (summary[key] === undefined) fail(errors, `run-summary missing ${key}`);
  }
}

function validateGeneratedText(file, text, errors) {
  const rel = file;
  const lines = text.split("\n");
  if (/\n\n$/.test(text)) {
    fail(errors, `${rel}: extra blank line at EOF`);
  }
  lines.forEach((line, index) => {
    if (/[ \t]+$/.test(line)) {
      fail(errors, `${rel}:${index + 1}: trailing whitespace`);
    }
    if (/^(<{7}|={7}|>{7}|\|{7})(?:\s|$)/.test(line)) {
      fail(errors, `${rel}:${index + 1}: raw conflict marker`);
    }
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const errors = [];
  const skills = validateSkills(args.root, errors);
  const agents = validateAgents(args.root, errors);
  validateHooks(args.root, errors);
  validateGuidance(args.root, errors);
  const manifest = validateManifest(args.root, errors);
  validateRuntimeScripts(args.root, errors);
  validateRunSummary(args.root, errors);

  const allGenerated = walkFiles(join(args.root, ".agents"))
    .concat(walkFiles(join(args.root, ".codex")))
    .filter((path) => !path.endsWith("events.jsonl") && !path.endsWith("policy-warnings.jsonl"));
  for (const file of allGenerated) {
    const text = readFileSync(file, "utf8");
    if (/\0/.test(text)) fail(errors, `${file}: contains NUL byte`);
    validateGeneratedText(file, text, errors);
  }

  if (manifest.skills !== undefined && manifest.skills !== skills) {
    fail(errors, `manifest skills=${manifest.skills} but found ${skills}`);
  }
  if (manifest.agents !== undefined && manifest.agents !== agents) {
    fail(errors, `manifest agents=${manifest.agents} but found ${agents}`);
  }

  if (errors.length) {
    console.error(JSON.stringify({ ok: false, root: args.root, errors }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({ ok: true, root: args.root, profile: manifest.profile, skills, agents }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
