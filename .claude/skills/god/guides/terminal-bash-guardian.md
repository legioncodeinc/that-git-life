# Terminal Bash Guardian — God's Guide

The God routing skill's record of when to invoke `terminal-bash-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/terminal-bash-guardian.md`](../../agents/terminal-bash-guardian.md)
**Weapon:** [`ai-tools/skills/terminal-bash-weapon/`](../../skills/terminal-bash-weapon/)
**Command Brief:** [`ai-tools/command-briefs/terminal-bash-guardian-command-brief.md`](../../../command-briefs/terminal-bash-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`terminal-bash-guardian` owns the full terminal productivity surface for developers: shell runtime configuration (Bash, Zsh, Fish), modern POSIX-aligned CLI tooling (ripgrep, fd, fzf, bat, eza, zoxide), shell scripting best practices, dotfile architecture, terminal multiplexer setup (tmux, Zellij), and task-automation tooling (just, make). It treats the terminal as a layered stack and advises each layer distinctly. It collaborates with `devops-guardian` on CI shell scripts (handing off when the shell context is a container) and with `python-guardian` on Python build tooling, but never crosses into those domains itself.

## Trigger phrases

Route to `terminal-bash-guardian` when the user says any of:

- "improve my dotfiles"
- "review this shell script"
- "set up tmux"
- "modern CLI tools"
- "bash best practices"
- "just vs make"
- "terminal setup"
- "help with zsh/fish/bash config"
- "set -euo pipefail"

Or when the request involves dotfiles, shell scripting correctness, terminal multiplexers, or CLI tool replacements.

## Do NOT route when

- The shell script runs inside a Docker container or CI runner image — route to `devops-guardian`
- The task runner is for a Python project's build/test pipeline — route to `python-guardian`
- The request is about security hardening of shell scripts in production infrastructure — route to `security-guardian`
- The scope exceeds a developer workstation (OS-level system administration, kernel configuration) — handle inline

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The shell runtime (Bash, Zsh, Fish) or the script file under review
- OS context (macOS, Linux distro) — matters for tool availability and portability tier
- Goal (audit existing config, write a new script, set up tooling, migrate to just) — optional; Angel will ask if missing

## Outputs the Angel produces

- Shell configuration improvements (`.bashrc`, `.zshrc`, `config.fish` edits) with explanations
- Shell script review with severity-classified findings and copy-paste-ready fixes
- Modern CLI tool init snippets with primary gotcha warnings
- `justfile` or `Makefile` from canonical templates
- Findings report at `templates/findings-report.md` shape

## Multi-Angel sequences this Angel participates in

- **Full-stack developer workstation setup** — `terminal-bash-guardian` handles shell/CLI layer; `devops-guardian` handles CI/container shell; `python-guardian` handles Python toolchain

## Critical directives the orchestrator should respect

- Always check portability before writing Bash-specific syntax
- Never add `set -e` alone without `-u` and `-o pipefail`
- Quote every shell variable expansion unless deliberately word-splitting
- Always explain the trade-offs when recommending a modern CLI replacement
- Escalate to `devops-guardian` for CI shell steps running in containers

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
