# PRD-009: Bundled skills + agents

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-002 (service)

## 1. Problem

The brief calls for global skills/agents to be pulled down on first install for the chosen IDE. Per ADR-007, we ship a bundled baseline and then sync more from the public repo (PRD-008). This PRD covers the bundled side: authoring the `shared/` source files, building per-IDE outputs, and copying them to the user's global IDE directory at the right time.

## 2. Goals

- Author the v1 baseline skill + agent set listed in `bundled-defaults.md`.
- Build pipeline that compiles `shared/<id>/SKILL.md` into Cursor and Claude Code formats.
- First-boot install step that copies the right format to the right global dir.
- Idempotent re-application: re-running the install replaces only files with hash mismatches.
- Visible inventory in the settings page (`/settings/skills`).

## 3. Non-goals

- Authoring a deep catalog. v1 = the listed seven skills + three agents.
- A skill-discovery UI ("browse community skills"). PRD-008 covers the sync of skills the team curates; community discovery is later.
- Custom user skills inside this folder.

## 4. User stories

- "As a user, my IDE knows about the Notorious Llama brand the moment I finish onboarding."
- "As a user, I see the list of installed skills in settings and can toggle them off."
- "As Cursor, when I edit code in a standardized repo, the `library-schema-v2-guardian` skill keeps me from messing up the folder structure."

## 5. Scope

### In scope

- `src/skills/bundled/shared/<id>/SKILL.md` for each v1 skill (7) and agent (3).
- `scripts/build-skills.ts` — compiles `shared/` → `cursor/` + `claude-code/` outputs and writes hashes.
- First-boot installer step (called from PRD-003's `/onboarding/skills`).
- Inventory + disable surface in PRD-006's `/settings/skills`.
- Hash recording in the `skills` table for later sync diffs.

### Out of scope

- The remote sync mechanics (PRD-008).
- Editing skills via the UI.

## 6. Acceptance criteria

- [ ] All seven baseline skills and three baseline agents exist under `src/skills/bundled/shared/<id>/`.
- [ ] `scripts/build-skills.ts` produces `cursor/` and `claude-code/` outputs matching the format conventions in `bundled-defaults.md`.
- [ ] On first onboarding, the matching format set is copied to the user's global IDE dir.
- [ ] The `skills` table reflects installed skills with `source: bundled`, IDE, version, hash.
- [ ] Re-running the installer on a healthy system results in zero file changes.
- [ ] If the user has manually edited a skill, the installer preserves it and emits a `skill-conflict` finding.
- [ ] `/settings/skills` shows each installed skill with source, version, last-updated, and a disable toggle.

## 7. File-level deliverables

- `src/skills/bundled/shared/notorious-llama-design/SKILL.md` (+ assets) — adapted from `The Notorious Llama/SKILL.md`.
- `src/skills/bundled/shared/library-schema-v2-guardian/SKILL.md` — enforces Schema v2 in any active repo.
- `src/skills/bundled/shared/prd-author/SKILL.md`
- `src/skills/bundled/shared/ird-author/SKILL.md`
- `src/skills/bundled/shared/adr-author/SKILL.md`
- `src/skills/bundled/shared/commit-conventions/SKILL.md`
- `src/skills/bundled/shared/git-hygiene/SKILL.md`
- `src/skills/bundled/shared/library-guardian-agent/AGENT.md`
- `src/skills/bundled/shared/repo-doctor-agent/AGENT.md`
- `src/skills/bundled/shared/signup-orchestrator-agent/AGENT.md`
- `scripts/build-skills.ts` — build pipeline.
- `src/service/services/skills-install.service.ts` — first-boot installer.
- `src/service/routes/skills.routes.ts` — list, disable (extended in PRD-008).
- `src/web/pages/settings/skills.tsx` — initial implementation (extended in PRD-008 with sync UI).

## 8. Sequenced steps

1. Author each `SKILL.md` / `AGENT.md` with the right frontmatter (id, name, description, version, formats).
2. Build the compiler: `shared/<id>/` → both per-IDE folders, with hash metadata.
3. Implement `skills-install.service.ts` (copy + record in DB, with hash diff for re-runs).
4. Wire to the onboarding skills step.
5. Implement `/api/v1/skills` list + disable.
6. Build the `/settings/skills` page to show inventory.
7. Add tests against fixture global-dirs (temp dirs in the test runner).
8. Write the QA artifact at `qa/prd-009-bundled-skills-and-agents-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Cursor's global-skills path or format changes in a release. | Centralize the path constant in one file; bump on a Cursor change. |
| Claude Code skill format differs more than expected from Cursor. | Verify formats during the build step; add format-specific transforms in `build-skills.ts`. |
| User has many existing skills and we'd clobber. | Hash-check before write; never delete a skill we didn't install. |

## 10. References

- ADR-006, ADR-007.
- `library/knowledge/private/skills/bundled-defaults.md`
- `library/knowledge/private/skills/remote-sync.md`
- `The Notorious Llama/SKILL.md` — source for the `notorious-llama-design` skill.
