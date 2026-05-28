---
ai_description: |
  OS auto-start hook writers for that-git-life. Three implementations:
  Windows Task Scheduler XML, macOS launchd LaunchAgent plist, Linux systemd
  user unit. The unified contract is in auto-start-spec.md — service must
  survive reboot and log-out, restart on crash, and be removable with one
  tgl CLI command (tgl uninstall-hook).
human_description: |
  How the service auto-starts on each OS. One spec, three implementations.
---

# hooks/

| Document | Purpose |
|---|---|
| [`auto-start-spec.md`](auto-start-spec.md) | Unified contract + per-OS implementation notes. |
