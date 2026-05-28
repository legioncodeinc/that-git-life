# Auto-start spec

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

How the TGL service starts at log-on and stays running. Implements ADR-005.

---

## Unified contract

Every OS hook must satisfy:

1. **Starts at user log-on** — not boot, not before the user is present. (The service needs `~` to exist and the keychain to be unlocked.)
2. **Restarts on crash** — automatic, with bounded backoff (3 attempts in 60 s, then back off to once per 5 min).
3. **Survives log-out** — on macOS/Linux, the LaunchAgent/systemd unit continues running until next log-on. On Windows, it stops at log-off and restarts at the next log-on (Task Scheduler's default for "at log on" triggers).
4. **One command to register** — `tgl install-hook`.
5. **One command to remove** — `tgl uninstall-hook`.
6. **One command to inspect** — `tgl doctor`.
7. **Logs to `~/.tgl/logs/service.log`** with daily rotation. The hook redirects stdout/stderr there.

---

## Windows — Task Scheduler

A scheduled task created via `schtasks.exe` or PowerShell's `Register-ScheduledTask`. We use PowerShell.

**Trigger:** `At log on of <user>`
**Action:** `node "<install>\bin\tgl.js" start --daemon`
**Run only when user is logged on:** yes
**Stop if it runs longer than N hours:** disabled (long-running by design)
**If task fails, restart every:** 1 minute, up to 3 times
**Settings → Power:** "Start the task only if the computer is on AC power" → **unchecked** (run on battery too)

XML template lives at `src/hooks/templates/windows/tgl-task.xml.tmpl`. Variables substituted at install time:

| Token | Value |
|---|---|
| `{USER_SID}` | `(Get-CimInstance Win32_UserAccount -Filter "Name='$env:USERNAME'").SID` |
| `{NODE_PATH}` | `(Get-Command node).Source` |
| `{TGL_BIN_PATH}` | `(npm root -g) + "\@thenotoriousllama\that-git-life\bin\tgl.js"` |
| `{LOG_PATH}` | `$env:USERPROFILE + "\.tgl\logs\service.log"` |

Install logic:

```powershell
$xml = Get-Content $template | Out-String
$xml = $xml.Replace('{USER_SID}', $sid)...
$xml | Out-File -FilePath "$env:TEMP\tgl-task.xml" -Encoding Unicode
schtasks /Create /TN "ThatGitLife" /XML "$env:TEMP\tgl-task.xml" /F
```

Uninstall: `schtasks /Delete /TN "ThatGitLife" /F`.

---

## macOS — launchd LaunchAgent

A user LaunchAgent in `~/Library/LaunchAgents/com.thenotoriousllama.tgl.plist`.

**Key settings:**

```xml
<key>Label</key><string>com.thenotoriousllama.tgl</string>
<key>ProgramArguments</key>
<array>
  <string>/usr/local/bin/node</string>
  <string>{TGL_BIN_PATH}</string>
  <string>start</string>
  <string>--daemon</string>
</array>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key>
<dict>
  <key>SuccessfulExit</key><false/>
  <key>Crashed</key><true/>
</dict>
<key>ThrottleInterval</key><integer>10</integer>
<key>StandardOutPath</key><string>{HOME}/.tgl/logs/service.log</string>
<key>StandardErrorPath</key><string>{HOME}/.tgl/logs/service.log</string>
<key>EnvironmentVariables</key>
<dict>
  <key>PATH</key><string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
</dict>
```

Template at `src/hooks/templates/macos/com.thenotoriousllama.tgl.plist.tmpl`.

Install:

```bash
launchctl load ~/Library/LaunchAgents/com.thenotoriousllama.tgl.plist
```

Uninstall:

```bash
launchctl unload ~/Library/LaunchAgents/com.thenotoriousllama.tgl.plist
rm ~/Library/LaunchAgents/com.thenotoriousllama.tgl.plist
```

`launchd` does not natively rotate logs. We rely on Pino's daily rotation (see `service/runtime-topology.md`).

---

## Linux — systemd user unit

`~/.config/systemd/user/tgl.service`:

```ini
[Unit]
Description=That Git Life — local service
After=network-online.target

[Service]
ExecStart={NODE_PATH} {TGL_BIN_PATH} start --daemon
Restart=on-failure
RestartSec=10
StartLimitBurst=3
StartLimitIntervalSec=60
StandardOutput=append:%h/.tgl/logs/service.log
StandardError=append:%h/.tgl/logs/service.log

[Install]
WantedBy=default.target
```

Template at `src/hooks/templates/linux/tgl.service.tmpl`.

Install:

```bash
systemctl --user daemon-reload
systemctl --user enable tgl
systemctl --user start tgl
```

`systemctl --user enable` requires the user to have lingering sessions (`loginctl enable-linger <user>`) only if the service must run when the user is fully logged out. We do **not** enable linger — the brief calls for log-on starts, not boot-time.

Uninstall:

```bash
systemctl --user disable --now tgl
rm ~/.config/systemd/user/tgl.service
systemctl --user daemon-reload
```

---

## Doctor checks

`tgl doctor` calls into the hook subsystem and reports:

| Check | Pass criteria |
|---|---|
| `hook-registered` | The OS reports the unit/task as known. |
| `hook-enabled` | It's set to start at log-on (Windows: enabled; macOS: loaded; Linux: enabled). |
| `service-reachable` | `GET http://127.0.0.1:3050/api/v1/health` returns 200. |
| `log-writable` | `~/.tgl/logs/` exists and is writable. |
| `keychain-reachable` | `keytar.getPassword(...)` succeeds. |

A failure surfaces a single-line fix in the CLI output (e.g., `Run: tgl install-hook`).

---

## Permissions

- Windows: needs no admin rights for current-user tasks. `Register-ScheduledTask` works in user scope.
- macOS: no `sudo` required — user LaunchAgents live in `~/Library/LaunchAgents/`.
- Linux: no `sudo` required — user systemd units live in `~/.config/systemd/user/`.

---

## What we don't do

- Don't run as root/admin.
- Don't add the service to PATH globally (TGL adds itself via `npm i -g`, which is enough).
- Don't ship binaries — everything runs through the user's Node install.
