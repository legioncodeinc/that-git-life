#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const CORE_SKILLS = [
  "that-git-life",
  "beekeeper-suit",
  "git-stinger",
  "harness-integration-stinger",
  "library-stinger",
  "code-review-pr-stinger",
  "security-stinger",
  "quality-stinger",
  "typescript-node-stinger",
  "react-stinger",
  "devops-stinger",
];

const CORE_AGENTS = [
  "git-worker-bee",
  "harness-integration-worker-bee",
  "library-worker-bee",
  "code-review-pr-worker-bee",
  "security-worker-bee",
  "quality-worker-bee",
  "typescript-node-worker-bee",
  "react-worker-bee",
  "devops-worker-bee",
];

const AUTOPILOT_SKILLS = [
  "that-git-life",
  "beekeeper-suit",
  "library-stinger",
  "adr-writing-stinger",
  "thanos-gauntlet-glove",
  "git-stinger",
  "code-review-pr-stinger",
  "security-stinger",
  "quality-stinger",
  "typescript-node-stinger",
  "react-stinger",
  "devops-stinger",
  "harness-integration-stinger",
];

const AUTOPILOT_AGENTS = [
  "library-worker-bee",
  "adr-writing-worker-bee",
  "git-worker-bee",
  "code-review-pr-worker-bee",
  "security-worker-bee",
  "quality-worker-bee",
  "typescript-node-worker-bee",
  "react-worker-bee",
  "devops-worker-bee",
  "harness-integration-worker-bee",
];

const RUNTIME_SCRIPTS = [
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

const INSTALL_MODES = ["committed-project", "local-only", "ci-safe", "global-launcher"];
const LOCAL_ONLY_EXCLUDE_MARKER = "# That Git Life local-only Codex adapter";
const LOCAL_ONLY_EXCLUDE_LINES = [LOCAL_ONLY_EXCLUDE_MARKER, ".agents/", ".codex/", "AGENTS.that-git-life.md"];

function usage() {
  console.log(`Usage:
  node scripts/build-codex-adapter.mjs --out <target-project-or-codex-home> [--profile core|autopilot|all] [--agents-mode auto|fragment|merge|both] [--install-mode committed-project|local-only|ci-safe|global-launcher] [--source-root <that-git-life-source>] [--merge-agents] [--with-research] [--clean]

Examples:
  node scripts/build-codex-adapter.mjs --out /tmp/tgl-codex-smoke --profile core --agents-mode both --clean
  node scripts/build-codex-adapter.mjs --out /path/to/repo --profile autopilot --agents-mode both
  node scripts/build-codex-adapter.mjs --out /path/to/repo --profile autopilot --install-mode local-only
  node scripts/build-codex-adapter.mjs --out "$CODEX_HOME" --install-mode global-launcher
  node scripts/build-codex-adapter.mjs --out /path/to/repo --profile all
`);
}

function parseArgs(argv) {
  const args = {
    out: "",
    profile: "core",
    agentsMode: "",
    installMode: "committed-project",
    sourceRoot: "",
    mergeAgents: false,
    withResearch: false,
    clean: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--out") {
      args.out = argv[++i] ?? "";
      continue;
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
    if (arg === "--source-root") {
      args.sourceRoot = argv[++i] ?? "";
      continue;
    }
    if (arg === "--merge-agents") {
      args.mergeAgents = true;
      continue;
    }
    if (arg === "--with-research") {
      args.withResearch = true;
      continue;
    }
    if (arg === "--clean") {
      args.clean = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.out) throw new Error("Missing required --out <target-project>");
  if (!["core", "autopilot", "all"].includes(args.profile)) throw new Error("--profile must be core, autopilot, or all");
  if (!INSTALL_MODES.includes(args.installMode)) {
    throw new Error("--install-mode must be committed-project, local-only, ci-safe, or global-launcher");
  }
  if (!args.agentsMode) args.agentsMode = args.mergeAgents ? "both" : "auto";
  if (!["auto", "fragment", "merge", "both"].includes(args.agentsMode)) {
    throw new Error("--agents-mode must be auto, fragment, merge, or both");
  }
  return args;
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function listDirs(path) {
  return readdirSync(path)
    .filter((entry) => statSync(join(path, entry)).isDirectory())
    .sort();
}

function normalizeCopiedText(text) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .map((line) => (/^(<{7}|={7}|>{7}|\|{7})(?:\s|$)/.test(line) ? `\\${line}` : line));
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return `${lines.join("\n")}\n`;
}

function copyDir(source, target, options = {}) {
  ensureDir(target);
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === "__pycache__") continue;
    const from = join(source, entry.name);
    const to = join(target, entry.name);
    if (entry.isDirectory()) {
      if (!options.withResearch && entry.name === "research") continue;
      copyDir(from, to, options);
    } else if (entry.isFile()) {
      if (entry.name.endsWith(".pyc")) continue;
      const bytes = readFileSync(from);
      if (bytes.includes(0)) continue;
      writeFileSync(to, normalizeCopiedText(bytes.toString("utf8")));
      if (entry.name.endsWith(".sh")) chmodSync(to, 0o755);
    }
  }
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const raw = kv[2].trim();
    data[kv[1]] = raw.replace(/^["']|["']$/g, "");
  }
  return data;
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function tomlString(value) {
  return JSON.stringify(String(value));
}

function readSkillMeta(skillDir) {
  const skillMd = join(ROOT, ".cursor", "skills", skillDir, "SKILL.md");
  const markdown = readFileSync(skillMd, "utf8");
  const meta = parseFrontmatter(markdown);
  return {
    dir: skillDir,
    name: meta.name || skillDir,
    description: meta.description || `That Git Life skill: ${skillDir}`,
  };
}

function readAgentMeta(agentFile) {
  const markdown = readFileSync(agentFile, "utf8");
  const meta = parseFrontmatter(markdown);
  const body = adaptAgentBody(markdown.replace(/^---\n[\s\S]*?\n---\n?/, "").trim());
  return {
    name: meta.name || basename(agentFile, ".md"),
    description: meta.description || `That Git Life worker agent: ${basename(agentFile, ".md")}`,
    body,
  };
}

function adaptAgentBody(body) {
  return body
    .replaceAll(".cursor/skills/", ".agents/skills/")
    .replaceAll("ai-tools/skills/", ".agents/skills/")
    .replaceAll("`../skills/", "`.agents/skills/")
    .replaceAll("](../skills/", "](.agents/skills/");
}

function writeOpenAiYaml(skillTarget, meta, implicit) {
  const path = join(skillTarget, "agents");
  ensureDir(path);
  writeFileSync(
    join(path, "openai.yaml"),
    [
      "interface:",
      `  display_name: ${yamlQuote(meta.name)}`,
      `  short_description: ${yamlQuote(meta.description.slice(0, 180))}`,
      "policy:",
      `  allow_implicit_invocation: ${implicit ? "true" : "false"}`,
      "",
    ].join("\n"),
  );
}

function globalLauncherMarkdown(name, options = {}) {
  const isAlias = name !== "that-git-life";
  const sourceRoot = options.sourceRoot || "";
  return `---
name: ${name}
description: ${isAlias ? "Alias launcher for That Git Life in Codex." : "Global launcher for That Git Life in Codex. Use when the user invokes $that-git-life or asks That Git Life to take work from request through planning, implementation, verification, PR, and closeout."}
---

# That Git Life Global Launcher

${isAlias ? "This is an alias for `$that-git-life`. Follow the same launcher flow below." : "This is the user-level Codex entry point for That Git Life."}

It is not the full runtime. The full runtime is project-local and lives in:

\`\`\`text
.agents/skills/that-git-life/SKILL.md
.codex/agents/
.codex/hooks.json
.codex/that-git-life/scripts/
AGENTS.that-git-life.md
\`\`\`

Your job is to make sure the current project has that local adapter, then follow the project-local router.

## Source Repo Resolution

Resolve the That Git Life source checkout in this order:

1. Use \`THAT_GIT_LIFE_SOURCE\` when it is set.
2. Use this launcher install's embedded source root when present.
3. Use the current git repo only when it contains \`scripts/build-codex-adapter.mjs\`.

Embedded source root:

\`\`\`text
${sourceRoot}
\`\`\`

If no source checkout can be resolved, stop and ask the user to set \`THAT_GIT_LIFE_SOURCE\` to a That Git Life checkout containing \`scripts/build-codex-adapter.mjs\`, or reinstall the global launcher with \`--source-root <path>\`.

## Startup

1. Resolve the current project root:

\`\`\`bash
git rev-parse --show-toplevel 2>/dev/null || pwd
\`\`\`

2. Check whether the project-local router exists:

\`\`\`text
<project-root>/.agents/skills/that-git-life/SKILL.md
\`\`\`

3. If it is missing, install the adapter with the \`autopilot\` profile:

\`\`\`bash
node "<source>/scripts/build-codex-adapter.mjs" \\
  --out "<project-root>" \\
  --profile autopilot \\
  --agents-mode both \\
  --clean
\`\`\`

Use \`--agents-mode fragment\` only when the user explicitly asks to inspect generated instructions before touching \`AGENTS.md\`.

4. Validate the install:

\`\`\`bash
node "<source>/scripts/validate-codex-adapter.mjs" --root "<project-root>"
\`\`\`

If validation fails, fix the install or report the exact blocker.

5. Read the project-local router completely:

\`\`\`text
<project-root>/.agents/skills/that-git-life/SKILL.md
\`\`\`

Then follow it for the requested work.

## Operating Posture

- Treat the project-local router as the source of truth after installation.
- Inspect the repo before planning or editing.
- Bootstrap \`library/\` if missing.
- Create backwards PRDs for existing undocumented behavior when the router recommends it.
- Create or locate the governing PRD, IRD, or ADR before substantive implementation.
- Generate and maintain \`EXECUTION_LEDGER.md\` for non-trivial work.
- Work on a branch unless the user explicitly asks for direct-main work.
- Run security before quality.
- Open a PR for implementation work unless the user explicitly asks for local-only work.
- Do not merge unless the user explicitly authorizes merge-through and the checks are green.

## Important Boundaries

- Do not treat this global skill as proof that the project is installed. Always check for the project-local adapter.
- Do not copy all That Git Life skills globally. The global layer should stay a launcher.
- Preserve unrelated dirty work.
- If the user asked for planning-only, create the durable plan and stop before implementation.
`;
}

function writeGlobalLauncher(targetRoot, args) {
  const launcherNames = ["that-git-life", "the-git-life"];
  for (const name of launcherNames) {
    const skillRoot = join(targetRoot, "skills", name);
    if (args.clean && existsSync(skillRoot)) rmSync(skillRoot, { recursive: true, force: true });
    ensureDir(skillRoot);
    writeFileSync(join(skillRoot, "SKILL.md"), globalLauncherMarkdown(name, { sourceRoot: args.sourceRoot }));
    writeOpenAiYaml(
      skillRoot,
      {
        name,
        description: name === "that-git-life" ? "Global That Git Life launcher for Codex." : "Alias for the global That Git Life launcher.",
      },
      true,
    );
  }

  const manifest = {
    adapter: "that-git-life-codex",
    installMode: "global-launcher",
    sourceCommit: sourceCommit(),
    generatedAt: new Date().toISOString(),
    canonicalSkill: "that-git-life",
    aliases: ["the-git-life"],
    embeddedSourceRoot: args.sourceRoot || "",
    targetRelativePaths: {
      canonicalSkill: "skills/that-git-life/SKILL.md",
      aliasSkill: "skills/the-git-life/SKILL.md",
    },
  };
  writeFileSync(join(targetRoot, "skills", "that-git-life", "global-launcher.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

function writeRouterSkill(targetRoot, profile) {
  const skillRoot = join(targetRoot, ".agents", "skills", "that-git-life");
  ensureDir(skillRoot);
  const autopilotNote =
    profile === "core"
      ? "If the request needs PRDs, ADRs, or Gauntlet execution but the matching Stinger is not installed, tell the user to reinstall with `--profile autopilot` or `--profile all`."
      : "This install includes the autopilot workflow Stingers for library bootstrap, PRD/IRD/ADR creation, and Gauntlet execution.";
  writeFileSync(
    join(skillRoot, "SKILL.md"),
    `---
name: that-git-life
description: Autopilot router for That Git Life in Codex. Use when the user gives a task, bug, feature, product idea, PRD, IRD, ADR, or asks to take work from idea to merged PR. It inspects the repo, bootstraps library/ when missing, creates PRDs/IRDs/ADRs as needed, executes acceptance criteria through the Gauntlet, runs security before quality, and ships through PR when possible.
---

# That Git Life for Codex

This is the Codex entry point for the That Git Life adapter.

${autopilotNote}

## First move

For any non-trivial task, run:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-inspect-project.mjs --root .
\`\`\`

If \`library/\` is missing, run:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-bootstrap-library.mjs --root .
\`\`\`

Then classify the request.

Prompt examples, route examples, and user-supplied path guesses are candidate inputs only. Before hardcoding a route, file, script, command, or product surface into a plan or implementation, discover the real repo inventory with shell search, project manifests, route trees, package scripts, framework config, and existing docs. If an example names a route or file that does not exist, repair the assumption from repo truth and record the correction in the governing artifact or ledger.

## Request classification

- New product, module, or feature: create a PRD with \`tgl-new-prd.mjs\`, then fill it using \`library-stinger\`.
- Existing repo with code but no PRD history: create one or more backwards PRDs with \`tgl-backwards-prd.mjs\`, then fill them using \`library-stinger/guides/05-backwards-prd.md\` before planning new work. When the backwards PRD documents behavior that is already shipped and verified, create it with \`--lifecycle completed\` or immediately move it with \`tgl-complete-work.mjs\`; do not leave shipped baseline documentation as ordinary backlog work.
- Bug, regression, or incident with a GitHub issue number: create an IRD with \`tgl-new-ird.mjs\`, then fill it using \`library-stinger\`.
- Bug without a GitHub issue number: create a tightly scoped PRD unless the user wants you to create a GitHub issue first.
- Durable architecture decision: create an ADR with \`tgl-new-adr.mjs\`, then fill it using \`adr-writing-stinger\`.
- Existing PRD or IRD named by the user: read it and execute it.
- Tiny local edit: branch if needed, use the relevant Stinger, verify, and ship without manufacturing docs unless the change deserves them.

## Autopilot execution order

For non-trivial work, enforce this order. Plans, PRDs, IRDs, ADRs, code maps, and ledgers are working artifacts that enable implementation; they are stopping points only when the user explicitly requested planning-only.

Required sequence: repo inspection -> library bootstrap -> backwards PRD when needed -> governing PRD/IRD/ADR -> move governing artifact to in-work -> EXECUTION_LEDGER.md -> branch -> implementation -> verification -> PR -> checks -> authorized merge.

1. Inspect the repo with \`tgl-inspect-project.mjs\`, then confirm real routes, files, scripts, framework conventions, package commands, CI, and docs with direct repo searches.
2. Read \`../beekeeper-suit/SKILL.md\` when routing is needed.
3. Bootstrap \`library/\` if missing.
4. If \`tgl-inspect-project.mjs\` reports \`recommendations.backwardsPrdFirst: true\`, create a retroactive PRD with \`tgl-backwards-prd.mjs --lifecycle completed\` before planning new work when it documents already-shipped baseline behavior. Then fill it by reading the current code through \`library-stinger/guides/05-backwards-prd.md\`. Use backlog only when the backwards PRD intentionally captures unfinished or unverified follow-up work.
5. Create or locate the governing forward PRD, IRD, and ADRs for the requested change.
6. For existing code or backwards PRDs, generate \`CODE_MAP.md\` with \`tgl-code-map.mjs\` and use it as the starting evidence map. The command prints a compact JSON summary by default; pass \`--include-summaries\` only when you need every file summary in stdout.
7. Fill planning docs until acceptance criteria are binary and testable.
8. Move the governing PRD or IRD to \`in-work\` before implementation begins:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-start-work.mjs --root . --artifact <path-to-prd-or-ird-folder>
\`\`\`

9. Generate \`EXECUTION_LEDGER.md\` from the governing doc:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-ledger.mjs --root . --from <path-to-prd-or-ird>
\`\`\`

10. Create a feature branch or worktree before implementation unless the user explicitly asks for direct-main work.
11. Execute the work with the relevant domain Stinger. For PRD execution, read \`../thanos-gauntlet-glove/SKILL.md\` and follow its phases, mapped to Codex custom agents when explicit delegation is useful.
12. Keep the ledger current. Criteria move OPEN -> IN_PROGRESS -> DONE -> VERIFIED. Do not mark VERIFIED until tests or direct checks prove it.
13. Run security before quality:
   - read \`../security-stinger/SKILL.md\`
   - fix medium or higher findings
   - read \`../quality-stinger/SKILL.md\`
   - fix medium or higher findings
14. Run gate and ship preflight:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-gate-status.mjs --root .
node .codex/that-git-life/scripts/tgl-ship-preflight.mjs --root .
\`\`\`

15. Commit scoped changes, push the branch, open a PR, watch checks, fix failures, and merge when green if the user authorized merge-through.
16. Link the PR back to the governing artifact with \`tgl-link-pr.mjs\`.
17. Write or update the closeout summary before and after merge:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-run-summary.mjs --root . --governing-artifact <path> --ledger EXECUTION_LEDGER.md
\`\`\`

18. When the PR is merged, move the governing PRD or IRD folder from \`in-work\` to \`completed\` with \`tgl-complete-work.mjs\`. This is mandatory closeout for merged work, not optional bookkeeping:

\`\`\`bash
node .codex/that-git-life/scripts/tgl-complete-work.mjs --root . --artifact <path-to-in-work-prd-or-ird-folder>
\`\`\`

19. After completion, rerun \`tgl-run-summary.mjs\` with the completed artifact path, verify \`EXECUTION_LEDGER.md\` no longer references the old \`in-work\` path, and confirm no shipped or fully verified governing artifact remains under \`library/requirements/in-work\`, \`library/issues/in-work\`, or ordinary backlog.

## Codex surface rules

- In Codex, use \`AGENTS.md\`, \`.agents/skills\`, \`.codex/agents\`, \`.codex/hooks.json\`, and \`.codex/that-git-life/scripts\`.
- Do not pretend Cursor or Claude-specific commands are active. Map them to Codex skills, Codex custom agents, and local scripts.
- Custom Bee agents do not auto-spawn. Spawn them only when the task benefits from explicit subagents or parallel review.
- If a required Stinger is missing, stop and recommend reinstalling the adapter with \`--profile autopilot\` or \`--profile all\`.

The default posture is autonomous: inspect, scaffold, document, execute, verify, PR, and merge when authorized. Ask the user only for genuine blockers such as credentials, destructive permissions, missing GitHub issue numbers for IRDs, or ambiguous product intent that cannot be resolved from the repo.
`,
  );

  writeOpenAiYaml(
    skillRoot,
    {
      name: "that-git-life",
      description:
        "Autopilot That Git Life workflow for taking tasks, bugs, features, and PRDs from idea to merged PR.",
    },
    true,
  );
}

function writeAgentToml(targetRoot, agentMeta) {
  const target = join(targetRoot, ".codex", "agents", `${agentMeta.name}.toml`);
  ensureDir(dirname(target));
  const instructions = [
    agentMeta.body,
    "",
    "Codex adapter instructions:",
    "- Before work, load the paired Stinger from .agents/skills when present.",
    "- Return concise findings or changes to the parent Codex thread.",
    "- Respect the repository AGENTS.md and That Git Life branch/security/quality ordering.",
  ].join("\n");

  writeFileSync(
    target,
    [
      `name = ${tomlString(agentMeta.name)}`,
      `description = ${tomlString(agentMeta.description)}`,
      `developer_instructions = ${tomlString(instructions)}`,
      "",
    ].join("\n"),
  );
}

function readRulesBlock() {
  const rulesDir = join(ROOT, ".cursor", "rules");
  const parts = [
    "# That Git Life Codex Guidance",
    "",
    "These instructions were generated from That Git Life Cursor rules for Codex CLI and Codex app.",
    "",
    "## Codex Surfaces",
    "",
    "- Use `.agents/skills` for Stingers.",
    "- The project-local That Git Life router is `.agents/skills/that-git-life/SKILL.md`; if automatic skill discovery points to a user-level path or does not find it, read that file explicitly.",
    "- Use `.codex/agents` for explicit Codex subagents.",
    "- Use `.codex/hooks.json` for deterministic lifecycle checks.",
    "- Cursor `.cursor/*` and Claude `.claude/*` files are source assets, not active Codex runtime files.",
    "",
  ];

  for (const file of readdirSync(rulesDir).filter((entry) => entry.endsWith(".mdc")).sort()) {
    const raw = readFileSync(join(rulesDir, file), "utf8");
    const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
    parts.push(`## ${file.replace(/\.mdc$/, "")}`, "", body, "");
  }

  parts.push(
    "## Closeout",
    "",
    "- For implementation work, run security review before quality review when the change is ready.",
    "- Do not claim completion until the relevant verification commands or review reports have run, or state exactly why they could not run.",
    "",
  );

  return parts.join("\n");
}

function mergeManagedBlock(existing, block) {
  const start = "<!-- that-git-life-codex:start -->";
  const end = "<!-- that-git-life-codex:end -->";
  const managed = `${start}\n${block.trim()}\n${end}`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (pattern.test(existing)) return `${existing.replace(pattern, managed).trim()}\n`;
  return `${existing.trim()}\n\n${managed}\n`;
}

function resolveAgentsMode(targetRoot, requestedMode) {
  if (requestedMode !== "auto") return requestedMode;
  return existsSync(join(targetRoot, "AGENTS.md")) ? "fragment" : "both";
}

function writeAgentsGuidance(targetRoot, requestedMode) {
  const block = readRulesBlock();
  const mode = resolveAgentsMode(targetRoot, requestedMode);
  const agentsPath = join(targetRoot, "AGENTS.md");
  const result = {
    requestedMode,
    mode,
    action: "none",
    wroteAgents: false,
    wroteFragment: false,
  };

  if (mode === "fragment" || mode === "both") {
    writeFileSync(join(targetRoot, "AGENTS.that-git-life.md"), `${block.trim()}\n`);
    result.wroteFragment = true;
  }

  if (mode === "merge" || mode === "both") {
    const existed = existsSync(agentsPath);
    const existing = existed ? readFileSync(agentsPath, "utf8") : "";
    writeFileSync(agentsPath, mergeManagedBlock(existing, block));
    result.wroteAgents = true;
    result.action = existed ? "merged" : "created";
    return result;
  }

  result.action = "fragment-only";
  return result;
}

function writeHooks(targetRoot) {
  const hookDir = join(targetRoot, ".codex", "hooks");
  ensureDir(hookDir);
  writeFileSync(
    join(hookDir, "that-git-life-hook.mjs"),
    `#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const eventArg = process.argv.indexOf("--event");
const event = eventArg >= 0 ? process.argv[eventArg + 1] : "unknown";
let input = "";
try {
  input = readFileSync(0, "utf8");
} catch {
  input = "";
}

const dir = join(process.cwd(), ".codex", "that-git-life");
mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, "events.jsonl"),
  JSON.stringify({
    ts: new Date().toISOString(),
    event,
    cwd: process.cwd(),
    inputBytes: input.length,
  }) + "\\n",
  { flag: "a" },
);
`,
  );
  chmodSync(join(hookDir, "that-git-life-hook.mjs"), 0o755);

  const eventHookCommand = (event) =>
    `root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; script="$root/.codex/hooks/that-git-life-hook.mjs"; [ -f "$script" ] || exit 0; node "$script" --event ${event}`;
  const policyHookCommand = (event) =>
    `root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; script="$root/.codex/that-git-life/scripts/tgl-hook-policy.mjs"; [ -f "$script" ] || exit 0; node "$script" --root "$root" --event ${event}`;

  writeFileSync(
    join(targetRoot, ".codex", "hooks.json"),
    JSON.stringify(
      {
        hooks: {
          SessionStart: [
            {
              matcher: "startup|resume|clear|compact",
              hooks: [
                {
                  type: "command",
                  command: eventHookCommand("SessionStart"),
                  timeout: 10,
                  statusMessage: "That Git Life session context",
                },
                {
                  type: "command",
                  command: policyHookCommand("SessionStart"),
                  timeout: 10,
                  statusMessage: "That Git Life policy check",
                },
              ],
            },
          ],
          UserPromptSubmit: [
            {
              hooks: [
                {
                  type: "command",
                  command: eventHookCommand("UserPromptSubmit"),
                  timeout: 10,
                  statusMessage: "That Git Life prompt route",
                },
                {
                  type: "command",
                  command: policyHookCommand("UserPromptSubmit"),
                  timeout: 10,
                  statusMessage: "That Git Life policy check",
                },
              ],
            },
          ],
          PreToolUse: [
            {
              hooks: [
                {
                  type: "command",
                  command: policyHookCommand("PreToolUse"),
                  timeout: 10,
                  statusMessage: "That Git Life pre-tool policy",
                },
              ],
            },
          ],
          PostToolUse: [
            {
              hooks: [
                {
                  type: "command",
                  command: policyHookCommand("PostToolUse"),
                  timeout: 10,
                  statusMessage: "That Git Life post-tool policy",
                },
              ],
            },
          ],
          Stop: [
            {
              hooks: [
                {
                  type: "command",
                  command: eventHookCommand("Stop"),
                  timeout: 10,
                  statusMessage: "That Git Life closeout",
                },
                {
                  type: "command",
                  command: policyHookCommand("Stop"),
                  timeout: 10,
                  statusMessage: "That Git Life closeout policy",
                },
              ],
            },
          ],
        },
      },
      null,
      2,
    ) + "\n",
  );
}

function writeRuntimeScripts(targetRoot) {
  const scriptsDir = join(targetRoot, ".codex", "that-git-life", "scripts");
  ensureDir(scriptsDir);
  for (const script of RUNTIME_SCRIPTS) {
    const source = join(ROOT, "scripts", script);
    if (!existsSync(source)) continue;
    const target = join(scriptsDir, script);
    writeFileSync(target, readFileSync(source));
    chmodSync(target, 0o755);
  }
}

function writeRunSummaryTemplate(targetRoot) {
  const summaryPath = join(targetRoot, ".codex", "that-git-life", "run-summary.json");
  if (existsSync(summaryPath)) return false;
  ensureDir(dirname(summaryPath));
  writeFileSync(
    summaryPath,
    JSON.stringify(
      {
        schema: "that-git-life.run-summary.v1",
        generatedAt: new Date().toISOString(),
        branch: "",
        commit: "",
        prUrl: "",
        mergeStatus: "unknown",
        governingArtifactPath: "",
        ledgerPath: "",
        commandsRun: [],
        verificationOutputs: [],
        reportPaths: [],
        failureCounts: {
          total: 0,
          tests: 0,
          checks: 0,
          security: 0,
          quality: 0,
        },
        successfulProofCounts: {
          total: 0,
          tests: 0,
          checks: 0,
          security: 0,
          quality: 0,
        },
        knownLimits: [],
      },
      null,
      2,
    ) + "\n",
  );
  return true;
}

function appendLocalOnlyGitExclude(targetRoot) {
  const gitDir = join(targetRoot, ".git");
  if (!existsSync(gitDir)) return false;
  const excludePath = join(gitDir, "info", "exclude");
  ensureDir(dirname(excludePath));
  const block = LOCAL_ONLY_EXCLUDE_LINES.join("\n");
  const existing = existsSync(excludePath) ? readFileSync(excludePath, "utf8") : "";
  if (existing.includes(LOCAL_ONLY_EXCLUDE_MARKER)) return true;
  writeFileSync(excludePath, `${existing.trimEnd()}\n${block}\n`);
  return true;
}

function removeLocalOnlyGitExclude(targetRoot) {
  const excludePath = join(targetRoot, ".git", "info", "exclude");
  if (!existsSync(excludePath)) return false;
  const existing = readFileSync(excludePath, "utf8");
  if (!existing.includes(LOCAL_ONLY_EXCLUDE_MARKER)) return false;
  const blockPattern = new RegExp(`\\n?${LOCAL_ONLY_EXCLUDE_LINES.map((line) => line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\n")}\\n?`, "g");
  const next = existing.replace(blockPattern, "\n").replace(/\n{3,}/g, "\n\n");
  writeFileSync(excludePath, next.endsWith("\n") ? next : `${next}\n`);
  return true;
}

function sourceCommit() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetRoot = args.out;
  ensureDir(targetRoot);

  if (args.installMode === "global-launcher") {
    const manifest = writeGlobalLauncher(targetRoot, args);
    console.log(
      JSON.stringify(
        {
          ok: true,
          out: targetRoot,
          installMode: args.installMode,
          canonicalSkill: manifest.canonicalSkill,
          aliases: manifest.aliases,
          manifest: relative(process.cwd(), join(targetRoot, "skills", "that-git-life", "global-launcher.json")),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (args.clean) {
    for (const rel of [".agents/skills", ".codex/agents", ".codex/hooks", ".codex/hooks.json", ".codex/that-git-life"]) {
      const path = join(targetRoot, rel);
      if (existsSync(path)) rmSync(path, { recursive: true, force: true });
    }
  }

  const selectedSkills =
    args.profile === "all" ? listDirs(join(ROOT, ".cursor", "skills")) : args.profile === "autopilot" ? AUTOPILOT_SKILLS : CORE_SKILLS;
  const selectedAgents = args.profile === "autopilot" ? AUTOPILOT_AGENTS : CORE_AGENTS;

  const skillDirs = selectedSkills.filter((name) => name !== "that-git-life");

  const copiedSkills = [];
  for (const skillDir of skillDirs) {
    const source = join(ROOT, ".cursor", "skills", skillDir);
    if (!existsSync(join(source, "SKILL.md"))) continue;
    const meta = readSkillMeta(skillDir);
    const target = join(targetRoot, ".agents", "skills", skillDir);
    if (args.clean && existsSync(target)) rmSync(target, { recursive: true, force: true });
    copyDir(source, target, { withResearch: args.withResearch });
    writeOpenAiYaml(target, meta, args.profile !== "all");
    copiedSkills.push(meta.name);
  }
  writeRouterSkill(targetRoot, args.profile);
  copiedSkills.unshift("that-git-life");

  const agentFiles = readdirSync(join(ROOT, ".cursor", "agents"))
    .filter((entry) => entry.endsWith(".md"))
    .sort();
  const copiedAgents = [];
  for (const file of agentFiles) {
    const meta = readAgentMeta(join(ROOT, ".cursor", "agents", file));
    if (args.profile !== "all" && !selectedAgents.includes(meta.name)) continue;
    writeAgentToml(targetRoot, meta);
    copiedAgents.push(meta.name);
  }

  const writesHooks = args.installMode !== "ci-safe";
  if (writesHooks) writeHooks(targetRoot);
  writeRuntimeScripts(targetRoot);
  writeRunSummaryTemplate(targetRoot);
  const guidance = writeAgentsGuidance(targetRoot, args.agentsMode);
  const localGitExclude = args.installMode === "local-only" ? appendLocalOnlyGitExclude(targetRoot) : false;
  const removedLocalGitExclude = args.installMode === "local-only" ? false : removeLocalOnlyGitExclude(targetRoot);

  const manifest = {
    adapter: "that-git-life-codex",
    profile: args.profile,
    installMode: args.installMode,
    agentsMode: guidance.mode,
    requestedAgentsMode: guidance.requestedMode,
    withResearch: args.withResearch,
    hooks: writesHooks,
    localGitExclude,
    removedLocalGitExclude,
    sourceCommit: sourceCommit(),
    generatedAt: new Date().toISOString(),
    skills: copiedSkills.length,
    agents: copiedAgents.length,
    agentsGuidance: guidance.action,
    targetRelativePaths: {
      skills: ".agents/skills",
      agents: ".codex/agents",
      hooks: writesHooks ? ".codex/hooks.json" : "",
      scripts: ".codex/that-git-life/scripts",
      runSummary: ".codex/that-git-life/run-summary.json",
      guidance: guidance.wroteAgents ? "AGENTS.md" : "AGENTS.that-git-life.md",
      guidanceFragment: guidance.wroteFragment ? "AGENTS.that-git-life.md" : "",
    },
  };
  ensureDir(join(targetRoot, ".codex", "that-git-life"));
  writeFileSync(join(targetRoot, ".codex", "that-git-life", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  console.log(
    JSON.stringify(
      {
        ok: true,
        out: targetRoot,
        profile: args.profile,
        installMode: args.installMode,
        skills: copiedSkills.length,
        agents: copiedAgents.length,
        agentsMode: guidance.mode,
        agentsGuidance: guidance.action,
        withResearch: args.withResearch,
        manifest: relative(process.cwd(), join(targetRoot, ".codex", "that-git-life", "manifest.json")),
      },
      null,
      2,
    ),
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
