# PRD-007: Auto-start hooks

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-002 (service must be runnable)

## 1. Problem

TGL must launch automatically when the user logs in, restart on crash, and survive log-out / re-login cycles. Per ADR-005, we use the native OS scheduler on each platform (Task Scheduler, launchd, systemd). This PRD implements the writers, removers, and verifiers for those hooks across all three OSes.

## 2. Goals

- `tgl install-hook` registers the right OS hook based on the detected platform.
- `tgl uninstall-hook` removes the hook cleanly.
- `tgl reinstall-hook` does both in one shot (useful after a path change).
- `tgl doctor` reports the hook's status accurately.
- The hook restarts the service on crash with bounded backoff.
- Logs go to `~/.tgl/logs/service.log` with daily rotation.

## 3. Non-goals

- Running TGL as a system service (always user-scope).
- Boot-time launch before user log-on.
- Hook editing UIs (CLI only).

## 4. User stories

- "As a user, I install TGL once and never have to start the service manually again."
- "As a user, I uninstall TGL and the hook goes away with it."
- "As Cursor, I detect a misconfigured hook and emit a one-line fix in `tgl doctor`."

## 5. Scope

### In scope

- Three implementations under `src/hooks/{windows,macos,linux}/`.
- Templates in `src/hooks/templates/` with documented substitution tokens.
- Per-platform install/uninstall/status methods exposed via a unified `OSHook` interface.
- CLI commands: `install-hook`, `uninstall-hook`, `reinstall-hook`.
- Doctor integration (checks `hook-registered`, `hook-enabled`, `service-reachable`, `log-writable`).

### Out of scope

- Hook registration UI in the web app.
- Boot-time variants requiring `loginctl enable-linger` on Linux.

## 6. Acceptance criteria

- [ ] `tgl install-hook` succeeds on a clean Windows 11, macOS 14+, Ubuntu 22.04 VM.
- [ ] After install, restarting the OS / logging out and back in launches the service automatically.
- [ ] Crashing the service (`kill -9`) results in a restart within ~10 s.
- [ ] `tgl uninstall-hook` removes all traces (no leftover plist / unit file / scheduled task).
- [ ] Re-running `tgl install-hook` on an already-installed system replaces (not duplicates) the hook.
- [ ] Logs land in `~/.tgl/logs/service.log` and rotate after 24 h.
- [ ] `tgl doctor` reports hook status correctly in all six combinations (installed/not × healthy/unhealthy × OS).
- [ ] Templates use the exact tokens documented in `auto-start-spec.md`.

## 7. File-level deliverables

- `src/hooks/index.ts` — factory returning the right `OSHook` implementation.
- `src/hooks/types.ts` — `OSHook` interface.
- `src/hooks/windows/index.ts` — PowerShell wrapper for `schtasks` / `Register-ScheduledTask`.
- `src/hooks/windows/template.ts` — Task Scheduler XML template loader + substitution.
- `src/hooks/macos/index.ts` — `launchctl` wrapper.
- `src/hooks/macos/template.ts` — LaunchAgent plist template + substitution.
- `src/hooks/linux/index.ts` — `systemctl --user` wrapper.
- `src/hooks/linux/template.ts` — systemd unit template + substitution.
- `src/hooks/templates/windows/tgl-task.xml.tmpl`
- `src/hooks/templates/macos/com.thenotoriousllama.tgl.plist.tmpl`
- `src/hooks/templates/linux/tgl.service.tmpl`
- `src/cli/install-hook.ts` / `uninstall-hook.ts` / `reinstall-hook.ts`
- `src/service/services/doctor.service.ts` (extended with hook checks)

## 8. Sequenced steps

1. Define the `OSHook` interface and the factory.
2. Implement macOS (simplest plist).
3. Implement Linux (systemd unit).
4. Implement Windows (Task Scheduler — most complex; XML template + PowerShell).
5. Substitute tokens at install time; write files; invoke the platform tool.
6. Verify install with platform-native `list` commands and parse the output.
7. Add CLI commands + doctor checks.
8. Write integration tests where possible (CI runners support all three OSes).
9. Write the QA artifact at `qa/prd-007-auto-start-hooks-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Token substitution fails on Windows path separators in XML. | Wrap paths in CDATA; test with a path containing spaces. |
| launchd ThrottleInterval defaults cause runaway restart loops on persistent failure. | Set explicit `ThrottleInterval` to 10 s. |
| User has a non-default Node install path. | Use `which node` (POSIX) / `(Get-Command node).Source` (Windows) at install time, store the resolved path in the unit. Re-resolve on `reinstall-hook`. |
| Linux without systemd (e.g., Alpine). | Detect, surface a friendly error pointing at the systemd requirement. |

## 10. References

- ADR-005.
- `library/knowledge/private/hooks/auto-start-spec.md`
