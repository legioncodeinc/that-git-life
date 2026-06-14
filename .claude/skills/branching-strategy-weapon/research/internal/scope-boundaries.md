# Internal: Weapon Scope Boundaries

## What branching-strategy-weapon OWNS

| Topic | Owned by this weapon |
|---|---|
| Branching model selection (TBD vs GitHub Flow vs GitLab Flow vs GitFlow) | Yes |
| Model-selection decision tree (team size, release cadence, environment count, maintenance obligations) | Yes |
| Release branch lifecycle (cut, stabilize, tag, merge back) | Yes |
| Hotfix branch protocol (cut from tag, merge to main and to current release branch) | Yes |
| Feature-flag vs feature-branch trade-off decision | Yes |
| Long-lived-branch trap definition, threshold (2 working days), and anti-pattern catalog | Yes |
| Merge-vs-rebase strategic choice (when to use each) | Yes |
| Branching policy document template (naming conventions, merge strategy, protected-branch rules, hotfix/release process) | Yes |
| GitHub Merge Queue conceptual setup and when to use it | Yes |
| GitLab Merge Trains conceptual overview | Yes |
| Migration playbook (GitFlow → GitHub Flow → TBD) | Yes |

## What branching-strategy-weapon DOES NOT OWN

| Topic | Owned by whom |
|---|---|
| Rebase mechanics (interactive rebase, squash, fixup, reword) | git-guardian |
| Conflict resolution mechanics | git-guardian |
| History rewriting (git filter-repo, BFG) | git-guardian |
| Git hook script authoring (Husky, lefthook) | git-guardian |
| Branch protection ruleset configuration in GitHub/GitLab UI | github-repo-health-guardian |
| CI/CD pipeline topology and pipeline-as-code authoring | devops-guardian |
| Feature flag platform setup and SDK integration | (generic platform setup) |
| Release communication / changelogs | changelog-release-notes-guardian |

## Key cross-references for weapon-forge

- `git-guardian` weapon: for rebase/merge mechanics that feed into merge strategy decisions
- `github-repo-health-guardian` weapon: for branch protection ruleset setup that enforces the chosen model
- `devops-guardian` weapon: for CI/CD pipeline shape that enables TBD (fast tests, deployment gates)
- `changelog-release-notes-guardian` weapon: for the release communication step downstream of the release branch lifecycle

## Routing rules in the SKILL.md
The weapon must include explicit routing rules:
1. "If the user asks HOW to rebase or resolve a conflict → route to git-guardian"
2. "If the user asks HOW to configure branch protection in GitHub settings → route to github-repo-health-guardian"
3. "If the user asks HOW to speed up their CI pipeline → route to devops-guardian"
4. "If the user asks WHICH branch protection settings to use → answer using this weapon, then hand off to github-repo-health-guardian for implementation"
