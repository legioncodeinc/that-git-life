# Codex Adapter

This adapter installs That Git Life into Codex CLI and the Codex app without requiring Claude Code, Claude Cowork, or Cursor runtime support.

It translates the existing source assets into Codex-native surfaces:

| That Git Life source | Codex target |
|---|---|
| `.cursor/skills/*/SKILL.md` Stingers | `.agents/skills/*` Codex skills |
| `.cursor/agents/*.md` Bees | `.codex/agents/*.toml` Codex custom agents |
| `.cursor/rules/*.mdc` always-on rules | `AGENTS.md` or `AGENTS.that-git-life.md` |
| hook model | `.codex/hooks.json` plus `.codex/hooks/that-git-life-hook.mjs` |

Codex skills are available in the CLI, app, and IDE extension. Custom agents are available when you explicitly ask Codex to spawn subagents. Hooks run when trusted through Codex's hook trust flow.

## Build the adapter into a project

From this repository:

```bash
node scripts/build-codex-adapter.mjs --out /path/to/project --profile autopilot --agents-mode both
```

To install only the user-level launcher into a Codex home directory:

```bash
node scripts/build-codex-adapter.mjs --out "$CODEX_HOME" --install-mode global-launcher
```

That global launcher is intentionally small. It installs `skills/that-git-life/SKILL.md` plus a `skills/the-git-life/SKILL.md` alias, then bootstraps the project-local adapter into whichever repo you invoke it from. Set `THAT_GIT_LIFE_SOURCE` to the That Git Life source checkout, or pass `--source-root <path>` when creating a private local launcher. Omit `--source-root` for shareable launcher output.

Profiles:

- `core`: installs the router, Beekeeper Suit, and a compact set of engineering Stingers. This is the recommended starting point.
- `autopilot`: installs the router, library/PRD/IRD support, ADR writing, Thanos Gauntlet execution, git, security, quality, code-review, and core implementation Stingers. This is the recommended profile for idea-to-merged-PR work.
- `all`: installs every Stinger and Bee. Use this only when you want the complete roster available locally.

Flags:

- `--agents-mode auto|fragment|merge|both`: controls how Codex guidance is written.
- `--install-mode committed-project|local-only|ci-safe|global-launcher`: controls whether generated adapter assets are intended to be committed, kept local, shared in CI-safe form, or installed as a user-level launcher.
- `--source-root <path>`: optional source checkout embedded only in `global-launcher` output. Prefer `THAT_GIT_LIFE_SOURCE` for shareable setups.
- `--merge-agents`: backwards-compatible alias for `--agents-mode both` when `--agents-mode` is not provided.
- `--with-research`: copies Stinger `research/` folders into the target project. By default the adapter skips research folders to keep generated installs compact.
- `--clean`: removes previously generated adapter skills, agents, hooks, and runtime logs before writing the new output.

Install modes:

- `committed-project`: default and backwards-compatible mode. Writes durable repo-local adapter files intended to be committed with the project.
- `local-only`: writes the same local runtime scaffolding but adds project-local `.git/info/exclude` entries for `.agents/`, `.codex/`, and `AGENTS.that-git-life.md` so the install can stay uncommitted.
- `ci-safe`: writes deterministic adapter assets suitable for project sharing and validation, but skips project-local hook registration under `.codex/hooks.json`.
- `global-launcher`: writes only user-level launcher skills under `skills/that-git-life/` and `skills/the-git-life/`. It does not write project-local `.agents/`, `.codex/`, or `AGENTS.*` files.

Guidance modes:

- `auto`: default. If the target project has no `AGENTS.md`, write both `AGENTS.md` and `AGENTS.that-git-life.md`; if it already has `AGENTS.md`, write only the standalone fragment.
- `fragment`: write only `AGENTS.that-git-life.md`.
- `merge`: insert or update the managed That Git Life block in `AGENTS.md`.
- `both`: write the standalone fragment and insert or update the managed block in `AGENTS.md`.

Use `fragment` when you want to review instructions before touching an existing project-level `AGENTS.md`. Use `both` for repositories that should always route Codex through That Git Life.

## What gets installed

The adapter writes:

```text
.agents/skills/that-git-life/
.agents/skills/beekeeper-suit/
.agents/skills/*-stinger/
.codex/agents/*-worker-bee.toml
.codex/hooks.json
.codex/hooks/that-git-life-hook.mjs
.codex/that-git-life/manifest.json
.codex/that-git-life/run-summary.json
.codex/that-git-life/scripts/*.mjs
AGENTS.that-git-life.md
```

`ci-safe` installs omit `.codex/hooks.json` and `.codex/hooks/that-git-life-hook.mjs`.

`global-launcher` installs instead write:

```text
skills/that-git-life/SKILL.md
skills/that-git-life/global-launcher.json
skills/the-git-life/SKILL.md
```

With `--agents-mode merge` or `--agents-mode both`, it writes or updates a managed block in `AGENTS.md`:

```html
<!-- that-git-life-codex:start -->
...
<!-- that-git-life-codex:end -->
```

## Runtime behavior

- The `that-git-life` router skill is installed at `.agents/skills/that-git-life/SKILL.md`. It can be invoked explicitly with `$that-git-life` or implicitly when project-local skill discovery sees it. If Codex resolves `that-git-life` to a user-level path instead, read the project-local router file explicitly.
- Domain Stingers remain normal Codex skills. Codex reads their `SKILL.md` only when selected.
- Custom Bee agents do not auto-spawn. Ask Codex to spawn subagents when you want parallel or delegated worker-bee execution.
- Hooks record SessionStart, UserPromptSubmit, and Stop events in `.codex/that-git-life/events.jsonl`, and run policy checks on SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, and Stop.
- Policy hooks warn by default and append to `.codex/that-git-life/policy-warnings.jsonl`. Set `TGL_HOOK_ENFORCEMENT=block` when you want hook warnings to fail the hook command.
- The `autopilot` profile installs deterministic scripts for repo inspection, library bootstrap, PRD/IRD/ADR skeleton creation, backwards-PRD scaffolding, code-map generation, lifecycle moves, PR linking, execution-ledger generation, gate status checks, ship preflight, run-summary closeout, adapter doctor checks, and hook policy checks.
- Generated adapter text files are normalized so downstream smoke branches can pass `git diff --check`.

## Autopilot flow

For autonomous idea-to-merged-PR work, install the `autopilot` profile and prompt Codex like this:

```text
Use That Git Life autopilot. Build <feature or fix> and take it to merged PR.
```

The generated `that-git-life` skill then drives this state machine:

1. Inspect the repo with `tgl-inspect-project.mjs`.
2. Discover real repo routes, files, scripts, package commands, CI, and docs before turning examples into plans.
3. Bootstrap `library/` with `tgl-bootstrap-library.mjs` if missing.
4. If existing code is present and no PRDs exist, create a retroactive PRD with `tgl-backwards-prd.mjs` before planning new work.
5. Classify the request as feature/product work, bug/incident work, architecture decision, existing PRD/IRD execution, or tiny edit.
6. Create missing PRD, IRD, or ADR skeletons with `tgl-new-prd.mjs`, `tgl-new-ird.mjs`, or `tgl-new-adr.mjs`.
7. Fill the planning docs with `library-stinger` or `adr-writing-stinger` until acceptance criteria are binary and testable.
8. Move the governing PRD or IRD into `in-work` with `tgl-start-work.mjs`.
9. Generate `CODE_MAP.md` for existing code paths with `tgl-code-map.mjs`. The command prints compact JSON by default; pass `--include-summaries` only when full per-file JSON is useful.
10. Generate `EXECUTION_LEDGER.md` with `tgl-ledger.mjs`.
11. Create a branch/worktree and execute the work, using `thanos-gauntlet-glove` for PRD execution.
12. Run security before quality.
13. Check gates with `tgl-gate-status.mjs` and ship readiness with `tgl-ship-preflight.mjs`.
14. Commit, push, open a PR, watch CI, fix failures, and merge when authorized.
15. Link the merged PR to the governing artifact with `tgl-link-pr.mjs`.
16. Write `.codex/that-git-life/run-summary.json` with `tgl-run-summary.mjs`, then move the artifact to `completed` with `tgl-complete-work.mjs`.

PRDs, IRDs, ADRs, code maps, and ledgers are working artifacts. They are stopping points only when the user explicitly requested planning-only.

Route examples and prompt examples are candidate inputs, not assumed repo truth. The generated router instructs Codex to inventory the actual repo and repair nonexistent route or file assumptions before implementation.

Bug work without a GitHub issue number is treated as a tightly scoped PRD by default. Use an IRD only when a GitHub issue number exists or Codex creates one first. Existing repos that were built before That Git Life should get backwards PRDs first so future changes preserve already-shipped behavior.

## Smoke test

```bash
tmp="$(mktemp -d)"
git -C "$tmp" init
node scripts/build-codex-adapter.mjs --out "$tmp" --profile autopilot --agents-mode both --clean
node scripts/validate-codex-adapter.mjs --root "$tmp"
codex exec -C "$tmp" --skip-git-repo-check "List the That Git Life Codex adapter files you can see and explain which Codex surfaces they use."
cat "$tmp/.codex/that-git-life/events.jsonl"
```

On the first run in a new project, Codex may ask you to trust the project-local hooks with `/hooks`.

## Validation levels

Use three levels before claiming the adapter works in a real project.

### 1. Static validation

Static validation checks that generated Codex assets are structurally usable:

```bash
node scripts/build-codex-adapter.mjs --out "$tmp" --profile all --agents-mode both --clean
node scripts/validate-codex-adapter.mjs --root "$tmp"
```

This verifies:

- all generated skills have `SKILL.md` with `name` and `description`
- custom agents have `name`, `description`, and `developer_instructions`
- stale `.cursor/skills` and `.claude/skills` paths are not present in generated Codex agent instructions
- hooks, manifest, and guidance files exist
- `ci-safe` installs intentionally omit hooks while other modes include them
- runtime scripts exist under `.codex/that-git-life/scripts`
- `.codex/that-git-life/run-summary.json` exists and has the closeout schema fields
- generated adapter files do not contain NUL bytes
- generated adapter files do not contain trailing whitespace or raw conflict-marker lines

### 2. Runtime smoke

The repo includes a deterministic smoke runner that creates a disposable JavaScript project, installs the adapter, validates generated files, runs the installed script chain, runs tests, and checks generated diffs:

```bash
node scripts/smoke-codex-adapter.mjs --profile autopilot
```

Use `--keep` if you want to inspect the temporary smoke repo after the run.

Focused adapter tests cover install modes, generated router wording, validation, doctor behavior, and run-summary output:

```bash
node scripts/test-codex-adapter.mjs
```

The focused test also validates `global-launcher`, including the `the-git-life` alias and the absence of embedded user-specific paths when `--source-root` is omitted.

Run the generated doctor in a target project when you want a project-local health check:

```bash
node .codex/that-git-life/scripts/tgl-doctor.mjs --root .
```

### 3. Codex hook smoke

Runtime smoke proves Codex can load the adapter and fire hooks in a real session:

```bash
codex exec -C "$tmp" --skip-git-repo-check --dangerously-bypass-hook-trust \
  "Do not edit files. Verify the That Git Life Codex adapter surfaces in this repo."
cat "$tmp/.codex/that-git-life/events.jsonl"
```

Use `--dangerously-bypass-hook-trust` only for disposable smoke automation. For daily use, trust hooks through `/hooks`.

### 4. Development E2E

Development E2E proves the adapter can help with actual code:

1. Create a tiny repo with a failing test.
2. Install the autopilot adapter.
3. Commit the seed state so branch/worktree behavior can be tested.
4. Ask Codex to fix the failing implementation, use the adapter, run tests, and use a relevant worker-bee for review when available.

The first successful local E2E used:

- `that-git-life` router skill
- `beekeeper-suit`
- `typescript-node-stinger`
- `typescript-node-worker-bee` custom agent for read-only review
- project hooks for `SessionStart`, `UserPromptSubmit`, and `Stop`
- `npm test` as the verification gate

The branch/worktree E2E used a feature-sized change and proved the workflow path:

- Codex created a feature worktree before edits
- Codex worked on `feature/slugify-max-length`
- Codex used `that-git-life`, `beekeeper-suit`, `typescript-node-stinger`, `security-stinger`, and `quality-stinger`
- `npm test` passed after the implementation and review fixes
- `git diff --check` passed
- the security scan helper ran in the generated project

The autopilot script-chain E2E proved the repo-bootstrap path:

- generated an `autopilot` install with 13 skills and 10 agents
- validated the install successfully
- ran installed scripts from the target project
- created the Library Schema v2 folder structure
- created a PRD skeleton under `library/requirements/backlog`
- created an ADR skeleton under `library/knowledge/private/architecture`
- generated `EXECUTION_LEDGER.md`
- reported gate warnings for implementation still on `main` and open criteria

The backwards-PRD script-chain E2E proved the first-run existing-repo path:

- detected source files in an unbootstrapped repo
- reported `recommendations.backwardsPrdFirst: true`
- created a retroactive PRD skeleton with an evidence map of source files
- preserved deterministic PRD numbering and `qa/` folder creation

The lifecycle/preflight script-chain E2E proved the autonomous execution path:

- moved a forward PRD from `backlog` to `in-work`
- generated `CODE_MAP.md` for source files
- generated `EXECUTION_LEDGER.md` from the in-work PRD
- reported gate warnings for open criteria and direct work on `main`
- reported ship-preflight blockers when the repo had no remote
- linked a PR URL and merge SHA back to the governing artifact
- ran the Stop policy hook and recorded policy warnings
- moved the completed PRD from `in-work` to `completed`

The adapter also marks copied shell scripts executable. That matters because the first branch/worktree E2E exposed `security-stinger/scripts/scan.sh` as non-executable after generation.

What this proves:

- Codex can load the generated skill surface during a real coding task.
- Codex can use a relevant Stinger at the right time for implementation.
- Codex can spawn a generated worker-bee custom agent when explicitly asked.
- Codex hooks can fire and record lifecycle events once trusted.
- The full `all` profile can be generated and statically validated.

What this does not prove yet:

- It does not prove every Stinger semantically succeeds on every repository type. The `all` profile is structurally validated, but only representative core Stingers have been exercised in development E2E.
- It does not make policy hooks block by default. The generated router requires branch or worktree creation before non-trivial implementation; hooks still warn unless `TGL_HOOK_ENFORCEMENT=block` is set.
- It does not make custom Bees auto-spawn. Codex custom agents are explicit delegation tools.
- It does not write fully polished PRD/IRD/ADR content by script alone. Scripts create correct structure and skeletons; Codex fills the content using the matching Stinger.

## Design notes

This adapter intentionally does not install all Stingers globally. Codex includes skill names and descriptions in the starting context with a bounded budget, so installing the compact `core` profile is usually better than loading the full roster into every session.

For real projects, prefer one of these patterns:

- Project-local `autopilot` install with `--agents-mode both` for repositories that should always follow That Git Life from idea to merged PR.
- Project-local adapter install with `--agents-mode fragment` when you want to inspect the generated fragment first.
- A future Codex plugin bundle when the adapter stabilizes and should be installed once across multiple repositories.
