---
ai_description: |
  Internal engineering + AI-agent knowledge for that-git-life. Contains
  architecture (ADRs), standards (writing rules, conventions), and domain
  reference folders for each major component of the system. This is the
  primary surface an AI agent should consult before writing code in this repo.
  Approved domains for this product: architecture, standards, service, frontend,
  standardizer, scanner, installers, hooks, skills. New domain folders are
  allowed when justified by a new component.
human_description: |
  Engineering knowledge — ADRs, standards, and per-domain references that
  Cursor and human contributors read while building or modifying the system.
---

# private/

Internal reference material. Approved domains for this repo:

| Domain | Contents |
|---|---|
| [`architecture/`](architecture/) | ADRs only. System-shaping decisions captured as `ADR-<n>-<slug>.md`. |
| [`standards/`](standards/) | Documentation framework, coding conventions, API conventions, branding rules. |
| [`service/`](service/) | Backend service (`:3050`) — API contract, DB schema, runtime topology. |
| [`frontend/`](frontend/) | React + Vite web UI — page specs, design system, Notorious Llama brand application. |
| [`standardizer/`](standardizer/) | Library Schema v2 engine — canonical schema reference + behavior spec. |
| [`scanner/`](scanner/) | Repository health scanner — checks spec + scoring model. |
| [`installers/`](installers/) | OS-specific install scripts — per-OS dependency matrix and signup flow. |
| [`hooks/`](hooks/) | Auto-start hook writers (Task Scheduler, launchd, systemd). |
| [`skills/`](skills/) | Bundled defaults + remote-sync model for Cursor and Claude Code global skills. |
