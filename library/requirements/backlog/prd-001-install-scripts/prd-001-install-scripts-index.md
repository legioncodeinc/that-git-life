# PRD-001: Install scripts

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** —

## 1. Problem

Users can't install TGL until there's a single-command installer that bootstraps every dependency on Windows, macOS, and Linux. The brief mandates a one-shot install: GitHub CLI, Node LTS, Python 3.12, nano, the chosen IDE (Cursor or VS Code + Claude Code), Claude Desktop, Obsidian, the npm package itself, and the auto-start hook.

## 2. Goals

- A user with a fresh machine can run one command and have a working TGL installation within ~10 minutes.
- Re-running the script on a fully-bootstrapped machine is a no-op (idempotent).
- The script opens browser tabs to each required affiliate signup URL during install (per ADR-008).
- The script registers the OS auto-start hook (per ADR-005, implemented in PRD-007).

## 3. Non-goals

- Custom installation paths beyond the OS defaults.
- Uninstall scripts (separate PRD if requested later — `tgl uninstall` CLI covers it).
- GUI installer.
- Headless / unattended install for CI (we expose flags for it but don't optimize the UX for it).

## 4. User stories

- "As a new vibe coder, I run one command and get every dep I need so I can start coding."
- "As a returning user, I re-run the installer to repair a broken install and nothing bad happens."
- "As a Windows user, I get the same first-run experience as a macOS user."

## 5. Scope

### In scope

- `installers/install.sh` (bash) for macOS + Linux.
- `installers/install.ps1` (PowerShell) for Windows.
- A `tgl post-install` CLI command both scripts invoke as their final step — handles hook registration, browser tab opening, and service start.
- IDE-choice prompt with `--ide=cursor|claude-code` CLI override.
- Idempotency: every install step checks "is this already installed?" before installing.

### Out of scope

- The `tgl install-hook` / `uninstall-hook` implementation (PRD-007).
- The web onboarding UI (PRD-003).
- Localization.

## 6. Acceptance criteria

- [ ] `install.sh` runs on a clean macOS 14+ VM and produces a healthy TGL install in < 10 min.
- [ ] `install.sh` runs on a clean Ubuntu 22.04 VM and produces a healthy TGL install in < 10 min.
- [ ] `install.ps1` runs on a clean Windows 11 VM (winget available) and produces a healthy TGL install in < 10 min.
- [ ] Re-running any script on a healthy machine produces only `[ ok ]` log lines and exits 0 in < 30 s.
- [ ] The IDE prompt only fires if `--ide` is not provided.
- [ ] Affiliate browser tabs open in the user's default browser, one at a time, with `<Enter>` to advance.
- [ ] `tgl post-install` registers the auto-start hook and starts the daemon.
- [ ] After install, `http://localhost:3050/api/v1/health` returns 200.
- [ ] After install, `tgl doctor` reports all green.
- [ ] Failing dependency installs surface a clear error with a remediation hint.

## 7. File-level deliverables

- `installers/install.sh` — bash installer (macOS + Linux).
- `installers/install.ps1` — PowerShell installer (Windows).
- `installers/lib/common.sh` — shared shell utilities (logging, `is_installed`, browser-open).
- `installers/lib/common.ps1` — shared PowerShell utilities.
- `installers/affiliate-urls.ts` — typed constants (consumed at build time to generate per-OS env files).
- `installers/affiliate-urls.env.sh` — build-generated env file for bash.
- `installers/affiliate-urls.env.ps1` — build-generated env file for PowerShell.
- `src/cli/post-install.ts` — Node command invoked by both scripts at the end.
- `scripts/build-installers.ts` — generates the env files and stages the scripts for `npm pack`.
- `library/knowledge/public/guides/install-tgl.md` — user-facing install guide (the "one-liner" landing page).

## 8. Sequenced steps

1. Implement `installers/lib/common.sh` and `installers/lib/common.ps1` (logging + helpers).
2. Implement `affiliate-urls.ts` with TODO placeholders and the build-time emitter.
3. Write `install.sh` per the dependency matrix in `library/knowledge/private/installers/dependency-matrix.md`.
4. Write `install.ps1` per the same matrix.
5. Implement `src/cli/post-install.ts` to call: hook registration → browser tab loop → service start → final summary.
6. Add a CI matrix that runs both scripts against fresh OS images (GitHub Actions runners).
7. Document the one-liner in `library/knowledge/public/guides/install-tgl.md`.
8. Write the QA artifact at `qa/prd-001-install-scripts-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Package managers' download mirrors go down. | Script surfaces a clear retry hint. We don't try to be a mirror. |
| Cursor or VS Code change their install URLs. | Pin URLs in a single constants file; bump on release. |
| `winget` is missing on older Windows 10. | Fallback to chocolatey; final fallback is a friendly error pointing at winget install instructions. |
| The browser-tab UX feels spammy. | Pause for `<Enter>` between tabs; cap the number of tabs at 7. |

## 10. References

- ADR-006 — IDE-choice handling.
- ADR-008 — Signup flow.
- `library/knowledge/private/installers/dependency-matrix.md`
- `library/knowledge/private/installers/signup-flow.md`
