# GitHub Repo Health Guardian — God's Guide

The God routing skill's record of when to invoke `github-repo-health-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/github-repo-health-guardian.md`](../../agents/github-repo-health-guardian.md)
**Weapon:** [`ai-tools/skills/github-repo-health-weapon/`](../../skills/github-repo-health-weapon/)
**Command Brief:** [`ai-tools/command-briefs/github-repo-health-guardian-command-brief.md`](../../../command-briefs/github-repo-health-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`github-repo-health-guardian` owns GitHub repository hygiene audits. It inspects the structural and operational metadata of a repository across eight scored dimensions: branch protection rulesets (2025 GA), commit history quality (Conventional Commits adherence), CODEOWNERS coverage, CI workflow density, docs presence (README, CONTRIBUTING, SECURITY, LICENSE), .gitignore coverage, issue/PR templates, and repository settings (merge strategy, secret scanning, auto-delete). It produces a scored report (0-100) with findings ranked by impact × effort so teams can close hygiene gaps in one sprint. It is strictly read-only; it never modifies repo files or settings.

## Trigger phrases

Route to `github-repo-health-guardian` when the user says any of:

- "audit this repo" / "repo health check" / "GitHub repo hygiene"
- "check our branch protection" / "are we using branch rulesets"
- "CODEOWNERS audit" / "who owns this path" / "CODEOWNERS coverage gaps"
- "CI checks configured correctly" / "do we have all the right workflow stages"
- "commit history quality" / "are we following Conventional Commits"
- "check PR templates" / "do we have issue templates"
- "repository settings review" / "auto-delete branches configured"
- "is our git workflow healthy" / "how's the repo hygiene"
- "branch protection best practices 2026"

Or when the request implicitly involves repository operational health (e.g., "we keep getting stale branches" or "our reviewers never get auto-dismissed").

## Do NOT route when

- The user wants to fix, modify, or enable specific settings themselves — this Angel audits; it does not act. Provide the recommendation and the GitHub Settings URL; the human executes.
- Deep CI/CD architecture work (Dockerfile hygiene, reusable workflows, OIDC, cache backend, Depot migration) → `devops-guardian`.
- Code correctness or security vulnerabilities in source code → `security-guardian`.
- Secret scanning alert results or credential leak investigation → `security-guardian`.
- Database schema or migration audits → `db-guardian`.
- README content quality improvement (voice, conversion, quickstart) → `readme-writing-guardian`.
- The repo is GitLab, Bitbucket, or another host — this Angel's checks are GitHub-specific (GitHub Rulesets, GitHub Actions, GitHub CODEOWNERS enforcement).

If a request straddles repo health and CI architecture, route to `github-repo-health-guardian` for the surface-level density audit, then hand off to `devops-guardian` for the architecture depth.

## Inputs the Angel needs

Before invoking, ensure:

- GitHub repository identifier: `owner/repo` slug or full URL (required).
- Scope: full audit or specific dimension(s) — default is full audit if not specified.
- Data collection mode: `gh auth login` available (best), GitHub REST API token (good), or local clone only (limited — branch protection data unavailable).
- Optional: a team branching policy document or Conventional Commits enforcement policy to audit against.

If no repo identifier is provided, ask the user before invoking.

## Outputs the Angel produces

- A scored audit report (0-100 overall, 0-10 per dimension) with a ranked remediation plan.
- Written to `library/qa/github-repo-health/<date>-<repo-slug>-audit.md` by default, or inline if the user prefers.
- Explicit handoff bullets naming `devops-guardian`, `security-guardian`, or `readme-writing-guardian` for out-of-scope findings.

## Multi-Angel sequences this Angel participates in

- **Repo onboarding hygiene pass** — after `devops-guardian` sets up CI/CD for a new repo, invoke `github-repo-health-guardian` to verify branch protection, CODEOWNERS, and template presence are configured correctly before the repo goes live.
- **Security hardening sequence** — `github-repo-health-guardian` checks whether secret scanning and push protection are *enabled* (settings audit); `security-guardian` investigates any actual leaks or vulnerabilities found.

## Critical directives the orchestrator should respect

- Never route "fix branch protection" or "enable auto-delete" requests to this Angel — it is read-only. Produce the recommendation; the human or a settings-capable tool executes.
- Always ensure API access is declared at the top of every report; do not invoke if the user cannot provide a repo identifier.
- Hand CI architecture findings to `devops-guardian` before producing the final report; do not prescribe workflow design solutions.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
