# PRD-008: Auto-update + remote skill sync

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-002 (service), PRD-009 (bundled skills land first)

## 1. Problem

The brief calls for TGL to "auto update itself and download new skills from the public repository." We need a daily update check for the npm package and a periodic sync against `the-notorious-llama/global-skills`. Both must be safe (no surprise restarts mid-work), visible (the UI shows progress and outcomes), and reversible (failed updates don't brick the install).

## 2. Goals

- Daily npm version check (`npm view @thenotoriousllama/that-git-life version`).
- In-UI prompt when a new version is available: "Install update" button that runs `npm i -g`.
- Service self-restarts via the OS hook after the install completes.
- Daily remote skill sync per `remote-sync.md`.
- Conflict handling for user-edited skills (per ADR-007).
- Settings toggles for both (auto-update on/off, skill-sync on/off).

## 3. Non-goals

- Auto-installing updates without user confirmation (the brief says "auto-update" but the safer read is "auto-check + one-click install" — confirmed in ADR-007). This is intentional.
- Forking the skills repo or letting users point at a different one.
- Rolling back a bad update — `npm i -g @thenotoriousllama/that-git-life@<prev>` is the manual remedy.

## 4. User stories

- "As a user, I see a discreet 'Update available' badge when there's a new version."
- "As a user, I install the update from the dashboard; the service restarts itself and I'm back where I was."
- "As a user, my IDE picks up new skills from the community repo without me lifting a finger."

## 5. Scope

### In scope

- Cron-registered jobs for both update check (05:00 local) and skill sync (04:00 local).
- `/api/v1/updates/check` and `/api/v1/updates/install` endpoints.
- `/api/v1/skills/sync` endpoint.
- The skill-sync conflict UI in `/settings/skills` (built in PRD-006; extended here with conflict actions).
- Update-available badge on the dashboard.
- Settings toggles (writes to `settings` table).

### Out of scope

- Beta / RC channel selection (we always pull from `@latest`).
- Skill marketplaces or third-party skill sources beyond `global-skills`.

## 6. Acceptance criteria

- [ ] The daily cron writes the latest npm version to `settings.latest_version`.
- [ ] The dashboard shows the update badge when `latest_version > current_version`.
- [ ] Clicking "Install update" runs `npm i -g …@latest`, surfaces stdout/stderr in a modal, and exits cleanly. The OS hook restarts the service within ~15 s.
- [ ] The post-restart UI loads the new version (verified via `/api/v1/health`).
- [ ] The daily skill-sync job clones (first time) or fast-forwards `~/.tgl/skills-remote/` from `main`.
- [ ] New skills land in the IDE's global skill dir; updated skills replace prior bundled/remote versions only when hashes match the previous remote baseline.
- [ ] User-edited skills are preserved and surface a `skill-conflict` finding.
- [ ] The conflict UI offers Keep / Take / Open-both actions per `remote-sync.md`.
- [ ] Disabling either toggle stops the cron and prevents the next run.

## 7. File-level deliverables

- `src/service/services/updates.service.ts` — `checkLatest()`, `installLatest()`.
- `src/service/routes/updates.routes.ts` — `/api/v1/updates/*`.
- `src/service/services/skills-sync.service.ts` — clone/fetch + build + diff + apply.
- `src/service/routes/skills.routes.ts` — `/api/v1/skills/sync`, conflict-resolution endpoints.
- `src/service/cron/register.ts` — registers the two daily jobs (uses PRD-002's cron plumbing).
- `src/web/components/UpdateBadge.tsx`
- `src/web/pages/settings/updates.tsx` — extended with the install button and stream output.
- `src/web/pages/settings/skills.tsx` — extended with conflict resolution UI.

## 8. Sequenced steps

1. Implement `updates.service.ts` and its two routes; show the badge.
2. Implement the install flow (spawning `npm i -g` and streaming output).
3. Verify the post-restart UX (the OS hook brings the service back; the page polls health and reloads when version changes).
4. Implement `skills-sync.service.ts` clone/fetch + apply pipeline.
5. Implement the conflict-finding emit + resolution endpoints.
6. Wire the settings UI for both flows.
7. Register the cron jobs.
8. Write tests with mocked `npm view` and a local fixture remote.
9. Write the QA artifact at `qa/prd-008-auto-update-and-skill-sync-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| `npm i -g` needs sudo on some Linux setups. | Detect EACCES and surface a clear `sudo npm i -g …` suggestion. |
| `git fetch` fails on flaky networks. | Retry once with jitter; fall back to bundled silently. |
| User's IDE skills directory has files we don't recognize. | Leave them alone; only manage files TGL itself has recorded in the `skills` table. |
| Update mid-job kills running scans. | Update install runs only when no jobs are `running`; surface a "1 scan running, retry?" prompt otherwise. |

## 10. References

- ADR-007.
- `library/knowledge/private/skills/bundled-defaults.md`
- `library/knowledge/private/skills/remote-sync.md`
- `library/knowledge/private/service/api-contract.md`
