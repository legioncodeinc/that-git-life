# ADR-005 — Native OS hooks for auto-start

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The brief requires TGL to "auto start on reboot of computer." Three obvious approaches: native OS hooks (Task Scheduler / launchd / systemd), startup-folder shortcuts (lighter touch), or a PM2 daemon. We need restart-on-crash, log persistence, and a one-command removal path.

## Decision

Use **native OS hooks**:

| OS | Mechanism | Path |
|---|---|---|
| Windows | Task Scheduler | trigger: `At log on of <user>`; action: `node <install>/bin/tgl.js start --daemon` |
| macOS | `launchd` LaunchAgent | `~/Library/LaunchAgents/com.thenotoriousllama.tgl.plist`, `RunAtLoad=true`, `KeepAlive=true` |
| Linux | `systemd --user` unit | `~/.config/systemd/user/tgl.service`, `Restart=on-failure`, enabled with `systemctl --user enable tgl` |

Install script registers the appropriate hook automatically. `tgl uninstall-hook` removes it cleanly. `tgl reinstall-hook` re-registers (useful if install path changed).

## Why

- **Reliability.** Task Scheduler / launchd / systemd are battle-tested. They restart the service if it crashes, manage log rotation (or hand off to `journald`), and survive log-out.
- **Native = familiar.** A power user who wants to inspect or disable can find the hook in the place they expect (Task Scheduler GUI, `launchctl list`, `systemctl --user status tgl`).
- **No global PM2 dependency.** PM2 would work but adds a heavy runtime dep + its own startup hook chain.

## Implementation notes

- We **generate** the hook files from templates at install time (substituting `{INSTALL_PATH}`, `{USER}`, `{LOG_PATH}`). Templates live at `src/hooks/templates/`.
- Logs go to `~/.tgl/logs/service.log` with daily rotation, capped at 30 days.
- `tgl doctor` checks the hook is registered and the service is reachable.

## Consequences

- Cross-platform install scripts must handle three different mechanisms. Acceptable complexity.
- Removing the package via `npm uninstall -g` does **not** remove the hook unless the user runs `tgl uninstall-hook` first. The README and uninstall doc must call this out.
- On macOS, the LaunchAgent runs as the user (not root), so the service has access to keychain and SSH dir. Good.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Startup folder shortcut | Lighter, but no restart-on-crash and no clean log rotation. |
| PM2 with `pm2 startup` | Adds a global dependency and a second daemon. PM2 itself relies on the same native hooks under the hood. |
| Docker | Wrong shape for a tool that touches the user's filesystem and keychain. |
| Cron `@reboot` | Linux-only, no macOS/Windows analogue, and no restart-on-crash. |
