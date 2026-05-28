---
ai_description: |
  Reference knowledge for the that-git-life repository. Split into two audiences:
  `public/` for end-user documentation, `private/` for internal engineering,
  architecture, and AI-agent knowledge. When in doubt, default to `private/`.
  Promote a document to `public/` only when it is intentionally user-facing.
human_description: |
  Long-lived reference material lives here. Public docs are the user-facing
  surface (what TGL is, how to install it, FAQs). Private docs are everything
  internal: ADRs, standards, architecture, domain specs.
---

# knowledge/

| Folder | Audience |
|---|---|
| [`public/`](public/) | End-users — what TGL is, how to install, FAQs. |
| [`private/`](private/) | Internal team + AI agents — ADRs, standards, architecture, domain references. |

See Schema v2 §6 for the audience rule.
