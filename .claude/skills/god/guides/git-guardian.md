# Git Guardian — God's Guide

The God routing skill's record of when to invoke `git-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/git-guardian.md`](../../agents/git-guardian.md)
**Weapon:** [`ai-tools/skills/git-weapon/`](../../skills/git-weapon/)
**Command Brief:** [`ai-tools/command-briefs/git-guardian-command-brief.md`](../../../command-briefs/git-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`git-guardian` owns the full Git workflow surface for developers: interactive rebase (`rebase -i` squash / fixup / reword / drop / autosquash), conflict resolution (merge conflicts, rebase conflicts, rerere, mergetool), history rewriting (`git filter-repo`, BFG — never `filter-branch`), the reset/reflog recovery toolkit (all three reset types, recovering deleted branches and commits, `ORIG_HEAD`), Git worktrees for parallel branch work, client-side hooks (pre-commit, commit-msg, pre-push; Husky, lefthook), submodules vs subtrees decision matrix, large-file storage (Git LFS, partial clone, sparse checkout), and commit signing. It does not own CI/CD pipeline configuration, server-side hooks in CI infrastructure, or credential rotation after a secrets incident — those escalate to `devops-guardian` and `security-guardian` respectively.

## Trigger phrases

Route to `git-guardian` when the user says any of:

- "squash my commits"
- "interactive rebase"
- "I accidentally pushed a secret / credential / API key"
- "my repo is huge / too big / slow to clone"
- "undo that rebase"
- "recover my deleted branch"
- "recover a lost commit"
- "work on two branches at the same time"
- "set up Git hooks"
- "submodules vs subtrees"
- "Git LFS"
- "partial clone"
- "sparse checkout"
- "git filter-repo"
- "remove file from Git history"
- "force push is blocked"
- "git reflog"
- "git reset --hard regret"
- "autosquash"
- "rerere"

Or when the request involves any Git workflow, history operation, or recovery scenario.

## Do NOT route when

- The request is about CI/CD pipeline configuration triggered by Git events (push hooks, PR pipelines) — route to **devops-guardian**
- Server-side Git hooks (`pre-receive`, `update`, `post-receive`) in a CI runner or hosting platform — route to **devops-guardian**
- Credential rotation after a leaked secret is discovered — route to **security-guardian** (in parallel with git-guardian for history cleanup)
- Secret scanning configuration, repository security policies, branch protection rules on GitHub/GitLab — route to **security-guardian** or **devops-guardian**
- The request is primarily about GitHub/GitLab REST API usage (creating PRs programmatically, webhook configuration) — route to **devops-guardian** or handle inline

If a request straddles git-guardian and devops-guardian (e.g., "set up a pre-push hook that runs in CI"), prefer git-guardian for the local hook setup and explicitly escalate the CI portion to devops-guardian.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The Git problem or goal: "squash my last 5 commits", "I accidentally pushed a secret to main", "my repo is 4 GB"
- The repository context (helpful but not required): monorepo vs polyrepo, public vs private, team-shared vs solo
- Optional: Git version (`git --version`) — the Angel will check this itself for advanced features
- Optional: the specific branch name, commit sha, or error message when diagnosing a problem

If the goal is unclear, the Angel will ask for clarification before proceeding — it will never guess on a potentially destructive operation.

## Outputs the Angel produces

- Exact shell commands in fenced code blocks, annotated line by line
- The escape hatch command (recovery) before any destructive operation
- A before-state / operation / after-state explanation
- Template files from `templates/`: `.gitattributes`, hook scripts, rebase cheat-sheet
- Escalation items for `security-guardian` (credential rotation) or `devops-guardian` (CI hooks) when applicable

## Multi-Angel sequences this Angel participates in

- **Secrets-in-history incident response** — `git-guardian` handles history rewriting and force-push coordination; `security-guardian` handles credential rotation, access log audit, and stakeholder notification. Both run in parallel; neither waits for the other.
- **Developer workstation setup** — `git-guardian` handles Git configuration and hooks; `terminal-bash-guardian` handles shell tooling and dotfiles; `devops-guardian` handles CI/CD.
- **Monorepo architecture** — `git-guardian` advises on sparse checkout and subtrees; `devops-guardian` handles CI configuration for the monorepo.

## Critical directives the orchestrator should respect

- Always show the escape hatch (recovery command) before any destructive Git operation
- Use `--force-with-lease` instead of `--force` for every force-push recommendation
- Never recommend `git filter-branch` — always use `git filter-repo` or BFG
- Escalate credential rotation to `security-guardian` immediately when a secret is discovered in history
- Confirm Git version before recommending worktrees, partial clone, sparse checkout, or `--rebase-merges`

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
