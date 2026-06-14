# Branching Strategy Guardian — God's Guide

The God routing skill's record of when to invoke `branching-strategy-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/branching-strategy-guardian.md`](../../agents/branching-strategy-guardian.md)
**Weapon:** [`ai-tools/skills/branching-strategy-weapon/`](../../skills/branching-strategy-weapon/)
**Command Brief:** [`ai-tools/command-briefs/branching-strategy-guardian-command-brief.md`](../../command-briefs/branching-strategy-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`branching-strategy-guardian` owns the strategic and tactical decisions around version-control workflow: which branching model to adopt (trunk-based development, GitHub Flow, GitLab Flow, or GitFlow), how to manage release branches and hotfixes, when to use feature flags instead of long-lived branches, how to evaluate the merge-vs-rebase choice, how to avoid the long-lived-branch trap, and when GitHub Merge Queue pays for its complexity. It produces a branching policy document committed to the repo and routes configuration work (protection rules, CI trigger changes) to the correct sibling Angels.

It does NOT own Git mechanics (interactive rebase, conflict resolution, history rewriting — that is `git-guardian`), branch protection ruleset configuration (that is `github-repo-health-guardian`), or CI/CD pipeline topology (that is `devops-guardian`).

## Trigger phrases

Route to `branching-strategy-guardian` when the user says any of:

- "which branching model should we use"
- "we have too many merge conflicts"
- "our release process is broken / unclear / chaotic"
- "GitFlow or trunk-based?"
- "GitHub Flow vs GitFlow"
- "should we use trunk-based development?"
- "merge or rebase?"
- "should I use a feature flag or a feature branch?"
- "our branches are getting too old / too big"
- "long-lived branches are causing problems"
- "hotfix process is unclear"
- "we want to migrate away from GitFlow"
- "set up GitHub Merge Queue"
- "our CI is failing because of concurrent merges"

Or when a PR, incident postmortem, or retrospective surfaces branching pain or unclear release processes.

## Do NOT route when

- The request involves Git mechanics: interactive rebase, conflict resolution, history surgery, filter-repo, LFS, worktrees → route to **git-guardian**
- The request involves configuring branch protection rules, required reviews, or CODEOWNERS in GitHub/GitLab → route to **github-repo-health-guardian**
- The request involves CI/CD pipeline design, Dockerfile hygiene, GitHub Actions architecture → route to **devops-guardian**
- The request is about release notes or changelog communication → route to **changelog-release-notes-guardian**
- Feature flag platform selection and implementation code → scope decision here; route implementation to **react-guardian** or **python-guardian**

If a request straddles branching-strategy-guardian and git-guardian (e.g., "help me rebase my old branches before migrating to trunk-based"), prefer branching-strategy-guardian for the strategy framing and explicitly escalate the mechanical rebase operations to git-guardian.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Release cadence** — continuous deployment, sprint-based, quarterly, or hotfix-heavy
- **Team size** — approximate number of engineers
- **Product type** — SaaS web app, mobile SDK, desktop software, library, internal tooling
- **Multi-version support** — does the team support multiple live production versions simultaneously?
- **Feature flag infrastructure** — already in use, planned, or none
- **Current pain points** — merge conflicts, unclear hotfix process, long-lived branches, rebase wars

Optional but helpful: `git log --oneline --graph` dump, branch list, or `.github/` folder for context.

## Outputs the Angel produces

- A branching model recommendation with explicit rationale (citing the 9-factor decision matrix)
- A merge strategy ruling (squash vs merge commit vs rebase, with team-level policy)
- A feature-flag vs branch verdict (with the Fowler flag taxonomy and cost/benefit accounting)
- A filled-in `docs/engineering/branching-policy.md` committed to the repo
- Escalation items: protection-rule deltas for `github-repo-health-guardian`, CI trigger changes for `devops-guardian`

## Multi-Angel sequences this Angel participates in

- **Branching model overhaul** — `branching-strategy-guardian` owns the strategy and policy document; `github-repo-health-guardian` applies the protection ruleset changes; `devops-guardian` updates CI workflows (e.g., adds `merge_group:` trigger for Merge Queue)
- **GitFlow migration** — `branching-strategy-guardian` writes the 5-step migration playbook; `git-guardian` may be invoked for the branch history cleanup steps
- **Release process setup** — `branching-strategy-guardian` defines the release branch lifecycle and hotfix protocol; `changelog-release-notes-guardian` owns the post-release communication

## Critical directives the orchestrator should respect

- Always ask for release cadence before recommending a model
- Never recommend GitFlow as a default — require multi-version justification
- Always surface the 2-working-day branch-age threshold (DORA 2025: elite teams median 0.8 days)
- Present feature flag costs honestly — not just benefits
- Route protection-ruleset configuration to `github-repo-health-guardian`, not `devops-guardian`

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
