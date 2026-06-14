<div align="center">

<a href="https://www.ospry.ai">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/ospry/logos/png/core-assets/transparent/horizontal-white-1024.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/ospry/logos/png/core-assets/transparent/horizontal-ink-1024.png">
    <img alt="OSPRY" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/ospry/logos/png/core-assets/transparent/horizontal-ink-1024.png" width="300">
  </picture>
</a>

<sub>Want to know what will actually drive more revenue? **[OSPRY](https://www.ospry.ai)** is the insight engine built for exactly that. Check it out at [ospry.ai](https://www.ospry.ai).</sub>

</div>

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-logo-light.svg">
  <img alt="Legion" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-logo-light.svg" width="280">
</picture>

<br>
<br>

# That Git Life

**Get the Git life.** A one-shot dev-environment installer and always-on local service that keeps your GitHub folder healthy, standardized, and ready to vibe.

</div>

---

`@legioncodeinc/that-git-life` is a globally-installed npm package by [Legion Code Inc.](https://www.legioncodeinc.com) It ships a single-command installer (Windows, macOS, and Linux), a background service on `http://localhost:3050`, and a React web UI that runs your day-to-day: standardize new repos, scan existing ones for drift, manage your GitHub root, and sync skills and agents for Cursor or Claude Code.

---

## What this repo is

This repo is the **planning and source of truth** for the product. Cursor (or another AI coding agent) reads the docs here and builds the product against them. Nothing here is shipping code yet. This is the blueprint.

| Where | What's in it |
|---|---|
| [`library/`](library/) | Library Schema v2 scaffold. Lifecycle folder structure (knowledge, requirements, issues, notes) with seeded READMEs. |
| [`.cursor/`](.cursor/) | Cursor agents, skills, and rules. The source of truth for the asset system. |
| [`.claude/`](.claude/) | The same agents and skills, in the structure Claude Code consumes. |
| [`.cowork/`](.cowork/) | Every skill packaged as an installable `.skill` for Claude Cowork. |
| `AGENTS.md` · `SKILLS.md` · `HOOKS.md` · `RULES.md` | Deep explainers for each asset type and how they work across harnesses. |
| `README.md` | This file. |
| `LICENSE.md` | License. |

The work lives in `library/`. The agents read the PRDs there and build the product against them.

---

## The asset system

This repo ships a full army of AI assets that work across Cursor, Claude Code, and Claude Cowork. There are four kinds. Each has a deep-dive doc.

### Agents

Focused AI personas, one per domain, with their own instructions and guardrails. A primary orchestrator routes each request to the specialist that owns it. In this repo they are called **Angels**, and each one is paired with a skill it reads from. They live in [`.cursor/agents/`](./.cursor/agents/) and [`.claude/agents/`](./.claude/agents/).

**[Read more in AGENTS.md](./AGENTS.md)**

### Skills

Packaged, reusable expertise an agent loads on demand: instructions, guides, templates, and examples behind a `SKILL.md`. In this repo they are called **Weapons**. They are the most portable asset, working in all three harnesses, and ship for Cowork as one-click `.skill` packages.

**[Read more in SKILLS.md](./SKILLS.md)**

### Hooks

Scripts that fire automatically on session events (before or after a tool runs, on prompt submit, on session start). They make "always do X" a guarantee instead of a hope. This repo currently ships none; the doc explains the model and how to add them per harness.

**[Read more in HOOKS.md](./HOOKS.md)**

### Rules

Always-on guidance that constrains every agent at all times: house style, safety constraints, and workflow gates. This repo carries four, including a strict no-em-dashes rule and a plan-construction protocol.

**[Read more in RULES.md](./RULES.md)**

---

## Cross-harness compatibility

| Asset | Cursor | Claude Code | Claude Cowork |
|---|---|---|---|
| **Agents** | `.cursor/agents/*.md` | `.claude/agents/*.md` | runs on the Agent SDK; skills are the portable unit |
| **Skills** | `.cursor/skills/<name>/` | `.claude/skills/<name>/` | `.cowork/skills/<name>.skill` (one-click install) |
| **Hooks** | `.cursor/hooks.json` | `.claude/settings.json` | not user-configurable |
| **Rules** | `.cursor/rules/*.mdc` | `CLAUDE.md` | `CLAUDE.md` + project instructions |

Skills port one-to-one across all three. Agents share a format across Cursor and Claude Code. Hooks and rules use different formats per harness, so they are translated rather than copied. The Cowork skill copies have their angle brackets swapped for curly braces so they survive import (see [SKILLS.md](./SKILLS.md)).

---

## Agent and skill catalog

Every capability in the army, with its description and a direct link for each harness. Where a row shows an **Agent** and a **Skill**, the Angel is the persona and the Weapon is the arsenal it wields. Standalone skills (the factory line and orchestrators) have no paired Angel.

<details>
<summary><b>Browse all 85 capabilities</b></summary>

| Capability | What it does | Cursor | Claude Code | Cowork |
|---|---|---|---|---|
| **Adr Writing** | Architecture Decision Records specialist , authors, reviews, and governs ADRs in Nygard format (Context / Decision / Consequences / Alternatives Considered), MADR... | [Agent](./.cursor/agents/adr-writing-guardian.md) · [Skill](./.cursor/skills/adr-writing-weapon/) | [Agent](./.claude/agents/adr-writing-guardian.md) · [Skill](./.claude/skills/adr-writing-weapon/) | [Skill](./.cowork/skills/adr-writing-weapon.skill) |
| **Affiliate Referral Program** | Affiliate and referral program specialist for SaaS products -- platform selection (Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, Refersion), the affiliate... | [Agent](./.cursor/agents/affiliate-referral-program-guardian.md) · [Skill](./.cursor/skills/affiliate-referral-program-weapon/) | [Agent](./.claude/agents/affiliate-referral-program-guardian.md) · [Skill](./.claude/skills/affiliate-referral-program-weapon/) | [Skill](./.cowork/skills/affiliate-referral-program-weapon.skill) |
| **Agile Scrum** | Scrum methodology specialist , audits whether teams are actually practising Scrum, coaches Sprint Planning / Daily Scrum / Sprint Review / Retrospective / Backlog... | [Agent](./.cursor/agents/agile-scrum-guardian.md) · [Skill](./.cursor/skills/agile-scrum-weapon/) | [Agent](./.claude/agents/agile-scrum-guardian.md) · [Skill](./.claude/skills/agile-scrum-weapon/) | [Skill](./.cowork/skills/agile-scrum-weapon.skill) |
| **Ai Coding Tools** | The vibe-coder's AI coding tool advisor , recommends, compares, and configures Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent,... | [Agent](./.cursor/agents/ai-coding-tools-guardian.md) · [Skill](./.cursor/skills/ai-coding-tools-weapon/) | [Agent](./.claude/agents/ai-coding-tools-guardian.md) · [Skill](./.claude/skills/ai-coding-tools-weapon/) | [Skill](./.cowork/skills/ai-coding-tools-weapon.skill) |
| **Ai Docs** | API documentation research notes. Stub skill, no SKILL.md yet. | [Skill](./.cursor/skills/ai-docs-weapon/) | [Skill](./.claude/skills/ai-docs-weapon/) | [Skill](./.cowork/skills/ai-docs-weapon.skill) |
| **Ai Tools Platform** | The vibe coder's AI toolbox specialist , AI gateways (Portkey, OpenRouter), cloud providers (AWS Bedrock, Vertex AI, Azure OpenAI), frontier model selection (Clau... | [Agent](./.cursor/agents/ai-tools-platform-guardian.md) · [Skill](./.cursor/skills/ai-tools-platform-weapon/) | [Agent](./.claude/agents/ai-tools-platform-guardian.md) · [Skill](./.claude/skills/ai-tools-platform-weapon/) | [Skill](./.cowork/skills/ai-tools-platform-weapon.skill) |
| **Alt Ads Platforms** | Paid acquisition specialist for alternative ad platforms beyond Meta and Google Search , LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM), TikTok Ads (S... | [Agent](./.cursor/agents/alt-ads-platforms-guardian.md) · [Skill](./.cursor/skills/alt-ads-platforms-weapon/) | [Agent](./.claude/agents/alt-ads-platforms-guardian.md) · [Skill](./.claude/skills/alt-ads-platforms-weapon/) | [Skill](./.cowork/skills/alt-ads-platforms-weapon.skill) |
| **Angel Creator** | Phase 3 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/angel-creator/) | [Skill](./.claude/skills/angel-creator/) | [Skill](./.cowork/skills/angel-creator.skill) |
| **Api Docs** | API documentation authority , Swagger UI / Redoc / Scalar / Mintlify / Stoplight / Bump.sh tool selection, OpenAPI spec enrichment with JSON request + response ex... | [Agent](./.cursor/agents/api-docs-guardian.md) · [Skill](./.cursor/skills/api-docs-weapon/) | [Agent](./.claude/agents/api-docs-guardian.md) · [Skill](./.claude/skills/api-docs-weapon/) | [Skill](./.cowork/skills/api-docs-weapon.skill) |
| **App Store Submission** | App store publication specialist for iOS (App Store Connect + TestFlight) and Android (Google Play Console). | [Agent](./.cursor/agents/app-store-submission-guardian.md) · [Skill](./.cursor/skills/app-store-submission-weapon/) | [Agent](./.claude/agents/app-store-submission-guardian.md) · [Skill](./.claude/skills/app-store-submission-weapon/) | [Skill](./.cowork/skills/app-store-submission-weapon.skill) |
| **Asset** | Single owner of the Universal Asset Registry , the platform-owned catalog of every Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken,... | [Agent](./.cursor/agents/asset-guardian.md) · [Skill](./.cursor/skills/asset-weapon/) | [Agent](./.claude/agents/asset-guardian.md) · [Skill](./.claude/skills/asset-weapon/) | [Skill](./.cowork/skills/asset-weapon.skill) |
| **Auth** | End-to-end authentication implementation specialist , provider selection (Clerk / Better Auth / Auth.js / Supabase Auth / WorkOS / Stack Auth / Kinde / Stytch), G... | [Agent](./.cursor/agents/auth-guardian.md) · [Skill](./.cursor/skills/auth-weapon/) | [Agent](./.claude/agents/auth-guardian.md) · [Skill](./.claude/skills/auth-weapon/) | [Skill](./.cowork/skills/auth-weapon.skill) |
| **Big Bang Space** | Front-of-the-pipeline Angel for the Legion AI Tools Factory. | [Agent](./.cursor/agents/big-bang-space.md) · [Skill](./.cursor/skills/big-bang-earth/) | [Agent](./.claude/agents/big-bang-space.md) · [Skill](./.claude/skills/big-bang-earth/) | [Skill](./.cowork/skills/big-bang-earth.skill) |
| **Blogging Content Strategy** | Editorial blogging strategy specialist , cluster + pillar topical authority architecture, post-length decisions by search intent, title + H1 + meta description cr... | [Agent](./.cursor/agents/blogging-content-strategy-guardian.md) · [Skill](./.cursor/skills/blogging-content-strategy-weapon/) | [Agent](./.claude/agents/blogging-content-strategy-guardian.md) · [Skill](./.claude/skills/blogging-content-strategy-weapon/) | [Skill](./.cowork/skills/blogging-content-strategy-weapon.skill) |
| **Branching Strategy** | Branching strategy advisor for Git-based teams. | [Agent](./.cursor/agents/branching-strategy-guardian.md) · [Skill](./.cursor/skills/branching-strategy-weapon/) | [Agent](./.claude/agents/branching-strategy-guardian.md) · [Skill](./.claude/skills/branching-strategy-weapon/) | [Skill](./.cowork/skills/branching-strategy-weapon.skill) |
| **Changelog Release Notes** | Publishes engaging public changelogs and release notes that drive user engagement. | [Agent](./.cursor/agents/changelog-release-notes-guardian.md) · [Skill](./.cursor/skills/changelog-release-notes-weapon/) | [Agent](./.claude/agents/changelog-release-notes-guardian.md) · [Skill](./.claude/skills/changelog-release-notes-weapon/) | [Skill](./.cowork/skills/changelog-release-notes-weapon.skill) |
| **Code Forensics** | Conducts forensic investigations of software-development and agency-services engagements to support fee-clawback, breach-of-contract, fraud, and gross-negligence... | [Agent](./.cursor/agents/code-forensics-guardian.md) · [Skill](./.cursor/skills/code-forensics-weapon/) | [Agent](./.claude/agents/code-forensics-guardian.md) · [Skill](./.claude/skills/code-forensics-weapon/) | [Skill](./.cowork/skills/code-forensics-weapon.skill) |
| **Code Review Pr** | Code review culture and PR lifecycle specialist. | [Agent](./.cursor/agents/code-review-pr-guardian.md) · [Skill](./.cursor/skills/code-review-pr-weapon/) | [Agent](./.claude/agents/code-review-pr-guardian.md) · [Skill](./.claude/skills/code-review-pr-weapon/) | [Skill](./.cowork/skills/code-review-pr-weapon.skill) |
| **Cold Outreach** | Outbound sales specialist for founders running cold email. | [Agent](./.cursor/agents/cold-outreach-guardian.md) · [Skill](./.cursor/skills/cold-outreach-weapon/) | [Agent](./.claude/agents/cold-outreach-guardian.md) · [Skill](./.claude/skills/cold-outreach-weapon/) | [Skill](./.cowork/skills/cold-outreach-weapon.skill) |
| **Command Center** | Phase 1 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/command-center/) | [Skill](./.claude/skills/command-center/) | [Skill](./.cowork/skills/command-center.skill) |
| **Crm Integration** | CRM connectivity specialist for HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper. | [Agent](./.cursor/agents/crm-integration-guardian.md) · [Skill](./.cursor/skills/crm-integration-weapon/) | [Agent](./.claude/agents/crm-integration-guardian.md) · [Skill](./.claude/skills/crm-integration-weapon/) | [Skill](./.cowork/skills/crm-integration-weapon.skill) |
| **Cron Scheduling** | Scheduled-job specialist for cron expression authoring and auditing, platform-specific limits (Vercel Cron, Cloudflare Cron Triggers, GitHub Actions schedule), di... | [Agent](./.cursor/agents/cron-scheduling-guardian.md) · [Skill](./.cursor/skills/cron-scheduling-weapon/) | [Agent](./.claude/agents/cron-scheduling-guardian.md) · [Skill](./.claude/skills/cron-scheduling-weapon/) | [Skill](./.cowork/skills/cron-scheduling-weapon.skill) |
| **Csv Xlsx Import Export** | Implements and audits the "upload your spreadsheet" feature surface for React/Next.js products. | [Agent](./.cursor/agents/csv-xlsx-import-export-guardian.md) · [Skill](./.cursor/skills/csv-xlsx-import-export-weapon/) | [Agent](./.claude/agents/csv-xlsx-import-export-guardian.md) · [Skill](./.claude/skills/csv-xlsx-import-export-weapon/) | [Skill](./.cowork/skills/csv-xlsx-import-export-weapon.skill) |
| **Cursor Ide** | Cursor IDE platform specialist , project rules (.cursorrules migration, .cursor/rules/*.mdc authoring), MCP server registration and tool authoring, @cursor/sdk AP... | [Agent](./.cursor/agents/cursor-ide-guardian.md) · [Skill](./.cursor/skills/cursor-ide-weapon/) | [Agent](./.claude/agents/cursor-ide-guardian.md) · [Skill](./.claude/skills/cursor-ide-weapon/) | [Skill](./.cowork/skills/cursor-ide-weapon.skill) |
| **Customer Support Tooling** | Support stack specialist for SaaS products. | [Agent](./.cursor/agents/customer-support-tooling-guardian.md) · [Skill](./.cursor/skills/customer-support-tooling-weapon/) | [Agent](./.claude/agents/customer-support-tooling-guardian.md) · [Skill](./.claude/skills/customer-support-tooling-weapon/) | [Skill](./.cowork/skills/customer-support-tooling-weapon.skill) |
| **Dark Mode Theming** | Audits and implements the full dark-mode theming surface for React/Next.js applications. | [Agent](./.cursor/agents/dark-mode-theming-guardian.md) · [Skill](./.cursor/skills/dark-mode-theming-weapon/) | [Agent](./.claude/agents/dark-mode-theming-guardian.md) · [Skill](./.claude/skills/dark-mode-theming-weapon/) | [Skill](./.cowork/skills/dark-mode-theming-weapon.skill) |
| **Db** | PostgreSQL data architecture specialist , schema design, indexing strategy, zero-downtime migrations, ORM choice (Drizzle / Prisma / raw SQL), and serverless DB p... | [Agent](./.cursor/agents/db-guardian.md) · [Skill](./.cursor/skills/db-weapon/) | [Agent](./.claude/agents/db-guardian.md) · [Skill](./.claude/skills/db-weapon/) | [Skill](./.cowork/skills/db-weapon.skill) |
| **Dependency Audit** | Supply-chain security specialist for open-source dependency hygiene. | [Agent](./.cursor/agents/dependency-audit-guardian.md) · [Skill](./.cursor/skills/dependency-audit-weapon/) | [Agent](./.claude/agents/dependency-audit-guardian.md) · [Skill](./.claude/skills/dependency-audit-weapon/) | [Skill](./.cowork/skills/dependency-audit-weapon.skill) |
| **Design System** | Bootstraps complete design systems from scratch for any product , master design brief, tokens CSS, utility layer CSS, per-component specs, per-screen specs, stati... | [Agent](./.cursor/agents/design-system-guardian.md) · [Skill](./.cursor/skills/design-system-weapon/) | [Agent](./.claude/agents/design-system-guardian.md) · [Skill](./.claude/skills/design-system-weapon/) | [Skill](./.cowork/skills/design-system-weapon.skill) |
| **Devops** | Container build + CI/CD pipeline specialist for Node / Next.js / TypeScript stacks , Dockerfile hygiene (multi-stage, BuildKit secrets + cache mounts, non-root, H... | [Agent](./.cursor/agents/devops-guardian.md) · [Skill](./.cursor/skills/devops-weapon/) | [Agent](./.claude/agents/devops-guardian.md) · [Skill](./.claude/skills/devops-weapon/) | [Skill](./.cowork/skills/devops-weapon.skill) |
| **Discord Bot** | Discord bot and application specialist. | [Agent](./.cursor/agents/discord-bot-guardian.md) · [Skill](./.cursor/skills/discord-bot-weapon/) | [Agent](./.claude/agents/discord-bot-guardian.md) · [Skill](./.claude/skills/discord-bot-weapon/) | [Skill](./.cowork/skills/discord-bot-weapon.skill) |
| **Discovery Research** | Continuous product discovery coach , Teresa Torres interview cadence, Opportunity Solution Trees (OST), Jobs-to-be-Done (JTBD) interviews, assumption mapping, and... | [Agent](./.cursor/agents/discovery-research-guardian.md) · [Skill](./.cursor/skills/discovery-research-weapon/) | [Agent](./.claude/agents/discovery-research-guardian.md) · [Skill](./.claude/skills/discovery-research-weapon/) | [Skill](./.cowork/skills/discovery-research-weapon.skill) |
| **Docs Site** | Documentation-site infrastructure specialist. | [Agent](./.cursor/agents/docs-site-guardian.md) · [Skill](./.cursor/skills/docs-site-weapon/) | [Agent](./.claude/agents/docs-site-guardian.md) · [Skill](./.claude/skills/docs-site-weapon/) | [Skill](./.cowork/skills/docs-site-weapon.skill) |
| **Estimation** | Software estimation and forecasting specialist , relative-sizing frameworks (Fibonacci story points, T-shirt sizing, Planning Poker), the NoEstimates movement and... | [Agent](./.cursor/agents/estimation-guardian.md) · [Skill](./.cursor/skills/estimation-weapon/) | [Agent](./.claude/agents/estimation-guardian.md) · [Skill](./.claude/skills/estimation-weapon/) | [Skill](./.cowork/skills/estimation-weapon.skill) |
| **Font Loading** | Production-focused web font loading specialist. | [Agent](./.cursor/agents/font-loading-guardian.md) · [Skill](./.cursor/skills/font-loading-weapon/) | [Agent](./.claude/agents/font-loading-guardian.md) · [Skill](./.claude/skills/font-loading-weapon/) | [Skill](./.cowork/skills/font-loading-weapon.skill) |
| **Git** | Git mastery specialist , interactive rebase (squash, fixup, reword, autosquash), conflict resolution (rerere, mergetool, diff3), history rewriting (git filter-rep... | [Agent](./.cursor/agents/git-guardian.md) · [Skill](./.cursor/skills/git-weapon/) | [Agent](./.claude/agents/git-guardian.md) · [Skill](./.claude/skills/git-weapon/) | [Skill](./.cowork/skills/git-weapon.skill) |
| **Github Repo Health** | Repository hygiene auditor for GitHub repositories. | [Agent](./.cursor/agents/github-repo-health-guardian.md) · [Skill](./.cursor/skills/github-repo-health-weapon/) | [Agent](./.claude/agents/github-repo-health-guardian.md) · [Skill](./.claude/skills/github-repo-health-weapon/) | [Skill](./.cowork/skills/github-repo-health-weapon.skill) |
| **God** | Routing skill for the Cursor IDE Army. | [Skill](./.cursor/skills/god/) | [Skill](./.claude/skills/god/) | [Skill](./.cowork/skills/god.skill) |
| **God Registrar** | Phase 4 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/god-registrar/) | [Skill](./.claude/skills/god-registrar/) | [Skill](./.cowork/skills/god-registrar.skill) |
| **Gods Hand** | Pipeline controller and orchestration Angel for the Legion AI Tools Factory. | [Agent](./.cursor/agents/gods-hand.md) · [Skill](./.cursor/skills/gods-hand-weapon/) | [Agent](./.claude/agents/gods-hand.md) · [Skill](./.claude/skills/gods-hand-weapon/) | [Skill](./.cowork/skills/gods-hand-weapon.skill) |
| **Hiring Ats** | Applicant Tracking Systems authority for recruiting-tech stacks. | [Agent](./.cursor/agents/hiring-ats-guardian.md) · [Skill](./.cursor/skills/hiring-ats-weapon/) | [Agent](./.claude/agents/hiring-ats-guardian.md) · [Skill](./.claude/skills/hiring-ats-weapon/) | [Skill](./.cowork/skills/hiring-ats-weapon.skill) |
| **Hr Payroll** | HR infrastructure and payroll decision specialist for software startups , domestic payroll platform selection (Gusto, Rippling, Justworks), international contract... | [Agent](./.cursor/agents/hr-payroll-guardian.md) · [Skill](./.cursor/skills/hr-payroll-weapon/) | [Agent](./.claude/agents/hr-payroll-guardian.md) · [Skill](./.claude/skills/hr-payroll-weapon/) | [Skill](./.cowork/skills/hr-payroll-weapon.skill) |
| **Http Rest Fundamentals** | HTTP and REST protocol authority. | [Agent](./.cursor/agents/http-rest-fundamentals-guardian.md) · [Skill](./.cursor/skills/http-rest-fundamentals-weapon/) | [Agent](./.claude/agents/http-rest-fundamentals-guardian.md) · [Skill](./.claude/skills/http-rest-fundamentals-weapon/) | [Skill](./.cowork/skills/http-rest-fundamentals-weapon.skill) |
| **Icon System** | Icon-system specialist for React/Next.js applications. | [Agent](./.cursor/agents/icon-system-guardian.md) · [Skill](./.cursor/skills/icon-system-weapon/) | [Agent](./.claude/agents/icon-system-guardian.md) · [Skill](./.claude/skills/icon-system-weapon/) | [Skill](./.cowork/skills/icon-system-weapon.skill) |
| **Image Optimization** | Image optimization specialist for React/Next.js and HTML contexts. | [Agent](./.cursor/agents/image-optimization-guardian.md) · [Skill](./.cursor/skills/image-optimization-weapon/) | [Agent](./.claude/agents/image-optimization-guardian.md) · [Skill](./.claude/skills/image-optimization-weapon/) | [Skill](./.cowork/skills/image-optimization-weapon.skill) |
| **Incorporation Startup Stack** | Company formation advisor for software startup founders. | [Agent](./.cursor/agents/incorporation-startup-stack-guardian.md) · [Skill](./.cursor/skills/incorporation-startup-stack-weapon/) | [Agent](./.claude/agents/incorporation-startup-stack-guardian.md) · [Skill](./.claude/skills/incorporation-startup-stack-weapon/) | [Skill](./.cowork/skills/incorporation-startup-stack-weapon.skill) |
| **Investor Cap Table** | Cap-table management and fundraising paperwork specialist for startup founders. | [Agent](./.cursor/agents/investor-cap-table-guardian.md) · [Skill](./.cursor/skills/investor-cap-table-weapon/) | [Agent](./.claude/agents/investor-cap-table-guardian.md) · [Skill](./.claude/skills/investor-cap-table-weapon/) | [Skill](./.cowork/skills/investor-cap-table-weapon.skill) |
| **Kanban Flow** | Kanban method specialist , WIP limit design and enforcement, flow-metric calculation (cycle time, lead time, throughput, flow efficiency), Little's Law diagnostic... | [Agent](./.cursor/agents/kanban-flow-guardian.md) · [Skill](./.cursor/skills/kanban-flow-weapon/) | [Agent](./.claude/agents/kanban-flow-guardian.md) · [Skill](./.claude/skills/kanban-flow-weapon/) | [Skill](./.cowork/skills/kanban-flow-weapon.skill) |
| **Knowledge** | Authors narrative knowledge documentation for any repository , the human-readable, technically deep domain docs under `library/knowledge/private/<domain>/`. | [Agent](./.cursor/agents/knowledge-guardian.md) · [Skill](./.cursor/skills/knowledge-weapon/) | [Agent](./.claude/agents/knowledge-guardian.md) · [Skill](./.claude/skills/knowledge-weapon/) | [Skill](./.cowork/skills/knowledge-weapon.skill) |
| **Knowledge Base Help Center** | Customer-facing knowledge base specialist , platform selection (Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide), search-fir... | [Agent](./.cursor/agents/knowledge-base-help-center-guardian.md) · [Skill](./.cursor/skills/knowledge-base-help-center-weapon/) | [Agent](./.claude/agents/knowledge-base-help-center-guardian.md) · [Skill](./.claude/skills/knowledge-base-help-center-weapon/) | [Skill](./.cowork/skills/knowledge-base-help-center-weapon.skill) |
| **Legal Docs** | SaaS legal documentation specialist for Terms of Service, Privacy Policy, DPA, MSA, and Cookie Notice. | [Agent](./.cursor/agents/legal-docs-guardian.md) · [Skill](./.cursor/skills/legal-docs-weapon/) | [Agent](./.claude/agents/legal-docs-guardian.md) · [Skill](./.claude/skills/legal-docs-weapon/) | [Skill](./.cowork/skills/legal-docs-weapon.skill) |
| **Library** | Owns the full documentation lifecycle for any repository , scaffolds the canonical `library/` folder on first run, ingests GitHub issues into IRDs, generates feat... | [Agent](./.cursor/agents/library-guardian.md) · [Skill](./.cursor/skills/library-weapon/) | [Agent](./.claude/agents/library-guardian.md) · [Skill](./.claude/skills/library-weapon/) | [Skill](./.cowork/skills/library-weapon.skill) |
| **Lighthouse Pagespeed** | Lighthouse + PageSpeed Insights specialist , running audits locally vs in CI (LHCI 0.15.x / GitHub Actions), interpreting all four audit categories (Performance,... | [Agent](./.cursor/agents/lighthouse-pagespeed-guardian.md) · [Skill](./.cursor/skills/lighthouse-pagespeed-weapon/) | [Agent](./.claude/agents/lighthouse-pagespeed-guardian.md) · [Skill](./.claude/skills/lighthouse-pagespeed-weapon/) | [Skill](./.cowork/skills/lighthouse-pagespeed-weapon.skill) |
| **Live Chat Support** | Customer support surface specialist , Intercom, Crisp, Plain, Pylon, Help Scout , widget integration, HMAC/JWT identity verification, conversation routing, AI def... | [Agent](./.cursor/agents/live-chat-support-guardian.md) · [Skill](./.cursor/skills/live-chat-support-weapon/) | [Agent](./.claude/agents/live-chat-support-guardian.md) · [Skill](./.claude/skills/live-chat-support-weapon/) | [Skill](./.cowork/skills/live-chat-support-weapon.skill) |
| **Markdown Mdx Content Pipeline** | Markdown/MDX content processing specialist. | [Agent](./.cursor/agents/markdown-mdx-content-pipeline-guardian.md) · [Skill](./.cursor/skills/markdown-mdx-content-pipeline-weapon/) | [Agent](./.claude/agents/markdown-mdx-content-pipeline-guardian.md) · [Skill](./.claude/skills/markdown-mdx-content-pipeline-weapon/) | [Skill](./.cowork/skills/markdown-mdx-content-pipeline-weapon.skill) |
| **Mind** | Cognitive-layer specialist for the deploying product , coach/agent routing, prompt cascade, RAG / GraphRAG, three-tier memory, observability, evaluation, multimod... | [Agent](./.cursor/agents/mind-guardian.md) · [Skill](./.cursor/skills/mind-weapon/) | [Agent](./.claude/agents/mind-guardian.md) · [Skill](./.claude/skills/mind-weapon/) | [Skill](./.cowork/skills/mind-weapon.skill) |
| **Modal Toast Dialog** | Accessible overlay specialist for React. | [Agent](./.cursor/agents/modal-toast-dialog-guardian.md) · [Skill](./.cursor/skills/modal-toast-dialog-weapon/) | [Agent](./.claude/agents/modal-toast-dialog-guardian.md) · [Skill](./.claude/skills/modal-toast-dialog-weapon/) | [Skill](./.cowork/skills/modal-toast-dialog-weapon.skill) |
| **Newsletter Platform** | Newsletter-as-channel specialist for product builders and founders , platform selection (Beehiiv, ConvertKit/Kit, Loops, Substack, Resend Audiences, Ghost), embed... | [Agent](./.cursor/agents/newsletter-platform-guardian.md) · [Skill](./.cursor/skills/newsletter-platform-weapon/) | [Agent](./.claude/agents/newsletter-platform-guardian.md) · [Skill](./.claude/skills/newsletter-platform-weapon/) | [Skill](./.cowork/skills/newsletter-platform-weapon.skill) |
| **Okr Goal Setting** | OKR methodology specialist , writes, grades, and iterates on Objectives and Key Results. | [Agent](./.cursor/agents/okr-goal-setting-guardian.md) · [Skill](./.cursor/skills/okr-goal-setting-weapon/) | [Agent](./.claude/agents/okr-goal-setting-guardian.md) · [Skill](./.claude/skills/okr-goal-setting-weapon/) | [Skill](./.cowork/skills/okr-goal-setting-weapon.skill) |
| **Payments** | Stripe (non-Connect) integration specialist , Checkout, Payment Intents, Subscriptions, Customer Portal, Invoicing, Payment Links, and webhook processing. | [Agent](./.cursor/agents/payments-guardian.md) · [Skill](./.cursor/skills/payments-weapon/) | [Agent](./.claude/agents/payments-guardian.md) · [Skill](./.claude/skills/payments-weapon/) | [Skill](./.cowork/skills/payments-weapon.skill) |
| **Preact** | Preact 11 specialist , signals API (v2 with createModel/useModel/action), preact/compat migration from React (alias setup, known gaps, compat blockers), third-par... | [Agent](./.cursor/agents/preact-guardian.md) · [Skill](./.cursor/skills/preact-weapon/) | [Agent](./.claude/agents/preact-guardian.md) · [Skill](./.claude/skills/preact-weapon/) | [Skill](./.cowork/skills/preact-weapon.skill) |
| **Product Feedback Roadmap** | Customer-feedback-to-roadmap loop specialist , Userback, Canny, Featurebase, Productboard, Frill, Productlane , in-app-widget vs portal vs voting-board taxonomy,... | [Agent](./.cursor/agents/product-feedback-roadmap-guardian.md) · [Skill](./.cursor/skills/product-feedback-roadmap-weapon/) | [Agent](./.claude/agents/product-feedback-roadmap-guardian.md) · [Skill](./.claude/skills/product-feedback-roadmap-weapon/) | [Skill](./.cowork/skills/product-feedback-roadmap-weapon.skill) |
| **Product Tour Onboarding Ui** | In-app product tour and onboarding UI specialist. | [Agent](./.cursor/agents/product-tour-onboarding-ui-guardian.md) · [Skill](./.cursor/skills/product-tour-onboarding-ui-weapon/) | [Agent](./.claude/agents/product-tour-onboarding-ui-guardian.md) · [Skill](./.claude/skills/product-tour-onboarding-ui-weapon/) | [Skill](./.cowork/skills/product-tour-onboarding-ui-weapon.skill) |
| **Python** | Python architecture specialist for Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv codebases , enforces the canonical stack (Pydantic v2 at boun... | [Agent](./.cursor/agents/python-guardian.md) · [Skill](./.cursor/skills/python-weapon/) | [Agent](./.claude/agents/python-guardian.md) · [Skill](./.claude/skills/python-weapon/) | [Skill](./.cowork/skills/python-weapon.skill) |
| **Quality** | Quality-assurance reviewer that audits a completed implementation against its source plan document (a feature PRD at `library/requirements/features/feature-<###>-... | [Agent](./.cursor/agents/quality-guardian.md) · [Skill](./.cursor/skills/quality-weapon/) | [Agent](./.claude/agents/quality-guardian.md) · [Skill](./.claude/skills/quality-weapon/) | [Skill](./.cowork/skills/quality-weapon.skill) |
| **React** | React architecture specialist for React 18/19 codebases , bulletproof-react patterns, awesome-react ecosystem, React 19 idioms (Server Components, Suspense, Actio... | [Agent](./.cursor/agents/react-guardian.md) · [Skill](./.cursor/skills/react-weapon/) | [Agent](./.claude/agents/react-guardian.md) · [Skill](./.claude/skills/react-weapon/) | [Skill](./.cowork/skills/react-weapon.skill) |
| **Readme Writing** | Authors, audits, and restructures README files so they convert visitors into users. | [Agent](./.cursor/agents/readme-writing-guardian.md) · [Skill](./.cursor/skills/readme-writing-weapon/) | [Agent](./.claude/agents/readme-writing-guardian.md) · [Skill](./.claude/skills/readme-writing-weapon/) | [Skill](./.cowork/skills/readme-writing-weapon.skill) |
| **Retrospective** | Retrospective facilitator and follow-through enforcer for engineering teams. | [Agent](./.cursor/agents/retrospective-guardian.md) · [Skill](./.cursor/skills/retrospective-weapon/) | [Agent](./.claude/agents/retrospective-guardian.md) · [Skill](./.claude/skills/retrospective-weapon/) | [Skill](./.cowork/skills/retrospective-weapon.skill) |
| **Review Funnels G2** | Review collection and online-reputation specialist for SaaS products. | [Agent](./.cursor/agents/review-funnels-g2-guardian.md) · [Skill](./.cursor/skills/review-funnels-g2-weapon/) | [Agent](./.claude/agents/review-funnels-g2-guardian.md) · [Skill](./.claude/skills/review-funnels-g2-weapon/) | [Skill](./.cowork/skills/review-funnels-g2-weapon.skill) |
| **Runbook Writing** | Operational runbook authorship specialist , canonical templates (break-fix, scheduled operation, diagnostic), the no-implied-context audit protocol, exact-command... | [Agent](./.cursor/agents/runbook-writing-guardian.md) · [Skill](./.cursor/skills/runbook-writing-weapon/) | [Agent](./.claude/agents/runbook-writing-guardian.md) · [Skill](./.claude/skills/runbook-writing-weapon/) | [Skill](./.cowork/skills/runbook-writing-weapon.skill) |
| **Scripture Historian** | Phase 1.5 of the Legion AI Tools Factory pipeline. | [Agent](./.cursor/agents/scripture-historian.md) | [Agent](./.claude/agents/scripture-historian.md) | n/a |
| **Security** | Security audit and remediation specialist for React, Next.js, TypeScript, and Node.js codebases. | [Agent](./.cursor/agents/security-guardian.md) · [Skill](./.cursor/skills/security-weapon/) | [Agent](./.claude/agents/security-guardian.md) · [Skill](./.claude/skills/security-weapon/) | [Skill](./.cowork/skills/security-weapon.skill) |
| **Seo Aeo** | Next.js 14+ App Router SEO and Answer Engine Optimization specialist. | [Agent](./.cursor/agents/seo-aeo-guardian.md) · [Skill](./.cursor/skills/seo-aeo-weapon/) | [Agent](./.claude/agents/seo-aeo-guardian.md) · [Skill](./.claude/skills/seo-aeo-weapon/) | [Skill](./.cowork/skills/seo-aeo-weapon.skill) |
| **Slack App** | Slack app development specialist. | [Agent](./.cursor/agents/slack-app-guardian.md) · [Skill](./.cursor/skills/slack-app-weapon/) | [Agent](./.claude/agents/slack-app-guardian.md) · [Skill](./.claude/skills/slack-app-weapon/) | [Skill](./.cowork/skills/slack-app-weapon.skill) |
| **Social Media Marketing Organic** | Genuine organic social media strategy for solo developers, founders, and small product teams (up to ~10 people). | [Agent](./.cursor/agents/social-media-marketing-organic-guardian.md) · [Skill](./.cursor/skills/social-media-marketing-organic-weapon/) | [Agent](./.claude/agents/social-media-marketing-organic-guardian.md) · [Skill](./.claude/skills/social-media-marketing-organic-weapon/) | [Skill](./.cowork/skills/social-media-marketing-organic-weapon.skill) |
| **Status Page** | Public status page specialist , platform selection (Statuspage/Atlassian, Better Stack, Instatus, Cachet OSS), component tree architecture, incident communication... | [Agent](./.cursor/agents/status-page-guardian.md) · [Skill](./.cursor/skills/status-page-weapon/) | [Agent](./.claude/agents/status-page-guardian.md) · [Skill](./.claude/skills/status-page-weapon/) | [Skill](./.cowork/skills/status-page-weapon.skill) |
| **Technical Writing Craft** | Reviews and writes technical documentation using the Diataxis framework, inverted-pyramid prose structure, code-example discipline, voice and tone consistency, an... | [Agent](./.cursor/agents/technical-writing-craft-guardian.md) · [Skill](./.cursor/skills/technical-writing-craft-weapon/) | [Agent](./.claude/agents/technical-writing-craft-guardian.md) · [Skill](./.claude/skills/technical-writing-craft-weapon/) | [Skill](./.cowork/skills/technical-writing-craft-weapon.skill) |
| **Telegram Bot** | Telegram Bot specialist , Bot API (up to 10.0, May 2026 including guest mode and managed bots), grammY v1.x (TypeScript, recommended 2026 choice over abandoned Te... | [Agent](./.cursor/agents/telegram-bot-guardian.md) · [Skill](./.cursor/skills/telegram-bot-weapon/) | [Agent](./.claude/agents/telegram-bot-guardian.md) · [Skill](./.claude/skills/telegram-bot-weapon/) | [Skill](./.cowork/skills/telegram-bot-weapon.skill) |
| **Terminal Bash** | Terminal productivity specialist for Bash/Zsh/Fish configuration, modern CLI tools (ripgrep, fd, fzf, bat, eza, zoxide), shell scripting best practices, dotfile a... | [Agent](./.cursor/agents/terminal-bash-guardian.md) · [Skill](./.cursor/skills/terminal-bash-weapon/) | [Agent](./.claude/agents/terminal-bash-guardian.md) · [Skill](./.claude/skills/terminal-bash-weapon/) | [Skill](./.cowork/skills/terminal-bash-weapon.skill) |
| **Thanos Gauntlet Glove** | End-to-end PRD execution orchestrator. | [Skill](./.cursor/skills/thanos-gauntlet-glove/) | [Skill](./.claude/skills/thanos-gauntlet-glove/) | [Skill](./.cowork/skills/thanos-gauntlet-glove.skill) |
| **Typography Font** | Typography and font-loading specialist for web products , variable fonts, Google Fonts vs Fontsource vs self-host, the FOIT/FOUT/FOFT loading story, font-display... | [Agent](./.cursor/agents/typography-font-guardian.md) · [Skill](./.cursor/skills/typography-font-weapon/) | [Agent](./.claude/agents/typography-font-guardian.md) · [Skill](./.claude/skills/typography-font-weapon/) | [Skill](./.cowork/skills/typography-font-weapon.skill) |
| **Ux Ui** | Enforces a product's design system from its source-of-truth folder (tokens, utilities, components, screens) and governs integration with shadcn/ui, Mantine, Lucid... | [Agent](./.cursor/agents/ux-ui-guardian.md) · [Skill](./.cursor/skills/ux-ui-weapon/) | [Agent](./.claude/agents/ux-ui-guardian.md) · [Skill](./.claude/skills/ux-ui-weapon/) | [Skill](./.cowork/skills/ux-ui-weapon.skill) |
| **Weapon Forge** | Phase 2 of the Legion AI Tools Factory pipeline. | [Skill](./.cursor/skills/weapon-forge/) | [Skill](./.claude/skills/weapon-forge/) | [Skill](./.cowork/skills/weapon-forge.skill) |
| **Website** | Builds production-grade SvelteKit (Svelte 5) + Payload CMS + Supabase websites end-to-end from a brief, applying a 12-phase site-template playbook (monorepo archi... | [Agent](./.cursor/agents/website-guardian.md) · [Skill](./.cursor/skills/website-weapon/) | [Agent](./.claude/agents/website-guardian.md) · [Skill](./.claude/skills/website-weapon/) | [Skill](./.cowork/skills/website-weapon.skill) |
| **Wiki** | Extracts code entities (functions, classes, modules, services, endpoints, env vars, config keys, data models, React components, SQL tables, queues, cron jobs, fea... | [Agent](./.cursor/agents/wiki-guardian.md) · [Skill](./.cursor/skills/wiki-weapon/) | [Agent](./.claude/agents/wiki-guardian.md) · [Skill](./.claude/skills/wiki-weapon/) | [Skill](./.cowork/skills/wiki-weapon.skill) |

</details>

---

## Why this repo is built on documents, not vibes

Most projects rot because the knowledge that built them lives in someone's head, a closed Slack thread, or a commit message nobody will ever read again. The code ships, the context evaporates, and six months later you are reverse-engineering your own product to make one safe change.

This repo runs on the opposite bet. Every decision, every feature, and every fix gets written down before it ships, in a place a human or an AI agent can find it. The `library/` folder is that place. Here is what goes in it and why it matters.

### What is a knowledge base?

A knowledge base is the durable memory of your codebase. It is the set of documents that explain what your system is, how it works, why it works that way, and how to operate it, written in plain language instead of buried in implementation. Code tells you *what* the machine does right now. A knowledge base tells you *why* it does that, *what* it is supposed to do, and *what* breaks if you change it.

In this repo the knowledge base lives at `library/knowledge/` and splits by audience:

- `library/knowledge/public/` holds docs meant for end-users and customers: overviews, how-to guides, FAQs.
- `library/knowledge/private/` holds everything internal: architecture docs, engineering standards, domain-specific knowledge, ADRs, and strategy. When in doubt, a doc goes here and gets promoted to public later.

A knowledge base is not documentation for documentation's sake. It is the difference between a codebase one person can change safely and a codebase a whole team, plus a fleet of AI agents, can change safely.

### Why document your codebase in the knowledge folder with domain-specific knowledge

Generic docs are worthless. "This is a React app" helps no one. The value is in the domain-specific knowledge: the rules, edge cases, and hard-won decisions that are true for *your* system and nowhere else.

Why it is worth the effort:

- **Onboarding goes from weeks to days.** A new engineer, contractor, or AI agent reads the domain docs and is productive immediately instead of pestering whoever has been here longest.
- **You stop paying the same tax twice.** Every gotcha you solve once gets written down once. Nobody rediscovers the same landmine in six months.
- **AI agents become useful instead of dangerous.** An agent with no context guesses. An agent with your domain knowledge in `library/knowledge/private/` makes the call you would have made. The knowledge base is the brief you give the machine before you let it touch your code.
- **The truth has one home.** When the data model, the auth flow, or the deploy process is documented in one canonical place, arguments end and work starts.

Domain knowledge is the moat. Write it down or watch it walk out the door every time someone leaves.

### Why document design decisions in ADRs

An ADR is an Architecture Decision Record. It is a short, dated document that captures one significant decision: the context that forced it, the decision you made, the consequences you accepted, and the alternatives you rejected. In this repo ADRs always live at `library/knowledge/private/architecture/ADR-<n>-<slug>.md`, numbered in sequence, and every one of them contains four sections: **Context, Decision, Consequences, Alternatives Considered.**

The reason ADRs matter is simple: the most expensive question in software is "why did we do it this way?" Without a record, the answer is a shrug, and a shrug gets you one of two bad outcomes. Either someone rips out a load-bearing decision because they did not understand it, or nobody dares touch anything because nobody understands any of it.

An ADR kills that problem. It freezes the reasoning at the moment you had the full picture. Later, when someone questions the choice, they do not relitigate it from zero. They read the context, see what tradeoffs were on the table, and either respect the decision or supersede it with a new ADR that says what changed. Decisions become a traceable chain instead of a pile of mysteries. You get to disagree with the past on the merits, not in the dark.

### What is a Product Requirements Document (PRD)?

A PRD is the spec for a piece of work before it gets built. It states what you are building, why it exists, what counts as done, and what it explicitly will not do. In this repo a PRD is a folder, not a single file, and it carries real structure:

```
library/requirements/backlog/prd-<###>-<slug>/
  prd-<###>-<slug>-index.md          module overview, goals, non-goals, feature list
  prd-<###><letter>-<slug>-<feature>.md   one sub-PRD per discrete feature
  qa/
    prd-<###>-<slug>-qa.md           QA report, written by the quality guardian
```

The index sets the module-level picture: overview, goals, non-goals, a feature table, and top-level acceptance criteria. Each sub-PRD scopes one feature with its own goals, user stories, acceptance criteria, and implementation notes. The acceptance criteria are the contract. They are checkboxes, and the work is not done until every box is checked and verified.

### Why having a PRD for everything is critical

A PRD for everything sounds like bureaucracy. It is the opposite. It is the thing that lets you move fast without breaking the wrong stuff.

- **It forces clarity before code.** Most wasted engineering is building the wrong thing precisely. Writing the PRD is where you find the holes in the idea, while changes still cost a sentence instead of a sprint.
- **It defines done.** "Done" without acceptance criteria is an opinion. With acceptance criteria it is a fact you can verify. No more shipping something that "mostly works."
- **It is the only reliable brief for an AI agent.** This is the part that makes the whole system run. An AI agent cannot read your mind, but it can read a PRD. A tight PRD with explicit acceptance criteria turns an agent from a liability into a force multiplier, because the agent has an unambiguous target and a checklist it must satisfy. No PRD means the agent guesses, and a guessing agent ships confident garbage.
- **It creates a paper trail.** Every feature traces back to a written intent. When you ask "why does this exist," there is an answer with a date on it.
- **It scales past you.** One person can hold a small project in their head. The moment a second human or a single agent joins, the head stops scaling and the document starts.

PRDs for features and modules. IRDs for issues and fixes (an Issue Resolution Document, numbered to its GitHub issue, living under `library/issues/`). Knowledge docs for how it all fits together. ADRs for the decisions that shaped it. That is the full record, and the record is what lets both humans and agents work on this codebase without fear.

### What you can expect from running the system

Follow the knowledge base, ADR, and PRD discipline and here is what you get:

- A codebase any new teammate or agent can understand without a guided tour.
- Decisions you can defend, revisit, and supersede on purpose instead of by accident.
- Features that ship against a verifiable definition of done, not a vibe.
- AI agents that build the right thing because they were handed the right brief.
- A system where the work outlives the person who did it.

The cost is writing things down. The return is a codebase that does not punish you for coming back to it.

---

## The exact processes

These are the start-to-finish workflows. Each one runs through the bundled agents and skills. You drive them with plain-language commands. The agent does the filing, naming, and numbering by the rules baked into the skills.

### Create the knowledge base from scratch

1. **Scaffold the structure.** Command the library-guardian agent: `initialize library` (or "set up docs"). It runs the standardizer, which builds the full schema v2 tree and seeds every folder with a `README.md` that documents that folder's rules. Do not hand-create folders. Let the script own the structure.
2. **Confirm the scaffold is clean.** The agent verifies the standardizer reports "Already up to date" on a dry run and that the docs sync status is current. You now have `library/knowledge/{public,private}`, `library/requirements/{backlog,in-work,completed,reports}`, `library/issues/{backlog,in-work,completed}`, and `library/notes/`.
3. **Decide audience for your first doc.** Public for customers, private for the team and agents. Unsure means private. You can promote later.
4. **Pick or create a domain folder.** Inside `public/` or `private/`, choose the subdomain (`overview/`, `guides/`, `faqs/` for public; `architecture/`, `standards/`, or a domain like `ai/`, `auth/`, `data/`, `frontend/`, `security/` for private). Create the folder if it does not exist.
5. **Write the doc.** Name it lowercase kebab-case, 60 characters or fewer, `.md`. Open with the standard header (title, category, version, date, status, one-sentence description, related links). Write the domain-specific truth, not generic filler.
6. **Cross-link it.** Link the new doc from any related PRD, IRD, or knowledge doc so it is discoverable.
7. **Record decisions as ADRs.** For any significant architectural choice, command the agent to write an ADR. It lands at `library/knowledge/private/architecture/ADR-<n>-<slug>.md`, numbered max-plus-one, with Context, Decision, Consequences, and Alternatives Considered.

### Reverse-PRD your existing codebase

Use this when code already exists but no PRD was ever written for it. You are documenting what was built so the requirements record stops lying by omission.

1. **Point the agent at the code.** Command: `backwards-PRD this module` (or "retroactively document this feature"). Name the module or path.
2. **The agent scans the source.** It reads the actual implementation with Grep and Read and cites real files and line numbers. It documents what the code *does*, not what someone once hoped it would do.
3. **It assigns the next PRD number.** Same rule as a forward PRD: list every `prd-*` folder across `backlog/`, `in-work/`, and `completed/`, take the max and add one.
4. **It writes the index, marked retroactive.** The header status is "Shipped" with a "Retroactive: Yes" note. The body captures the real APIs, data models, and the key decisions that would otherwise be lost.
5. **It cross-links.** Related knowledge docs, ADRs, and any issues the scan surfaced get linked in.
6. **It files by lifecycle.** A backwards-PRD is created in `backlog/`. If the code is fully shipped and verified, the agent moves the whole folder straight to `completed/`.

Repeat module by module until your shipped code has a paper trail that matches reality.

### Generate new PRDs for features, modules, and fixes

**For a feature or module (PRD):**

1. **Command the agent:** `write a PRD for <X>` (or "plan feature X", "spec out X").
2. **The agent copies the PRD template** into `library/requirements/backlog/prd-<###>-<slug>/` and assigns `<###>` as max-plus-one across all lifecycle folders.
3. **It writes the index:** overview, goals, non-goals, the feature table, and module-level acceptance criteria.
4. **It writes one sub-PRD per discrete feature** at `prd-<###><letter>-<slug>-<feature>.md`, each scoped tight with its own acceptance criteria.
5. **It creates an empty `qa/` folder** inside the PRD folder. The quality guardian fills it later. The library agent owns the structure and never writes QA content itself.
6. **Lifecycle by moving folders:** backlog when planned, move the whole folder to `in-work/` when started, move it to `completed/` when shipped. Status is the folder it lives in, never just a line in the frontmatter.

**For a bug or incident (IRD):**

1. **Make sure a GitHub issue exists first.** IRD numbers equal GitHub issue numbers. Never invent one.
2. **Command the agent:** `write an IRD for issue #<N>` (or "track this bug", "document this incident").
3. **The agent creates** `library/issues/backlog/ird-<###>-<slug>/` with an index (Problem, Root Cause, Fix Plan, Acceptance Criteria, Related) and an empty `qa/` folder. One issue equals one IRD. No sub-IRDs. Keep scope tight.
4. **Lifecycle by moving folders:** backlog, then `in-work/`, then `completed/` when the fix is verified.

---

## Wielding the Thanos Gauntlet Glove

Once your PRDs and IRDs are written, the Thanos Gauntlet Glove is how you execute them. It is the orchestrator skill at [`.cursor/skills/thanos-gauntlet-glove/`](./.cursor/skills/thanos-gauntlet-glove/). You point it at a set of PRDs and it drives them to 100 percent completion: spec to merged, CI-green PR, with no partial credit allowed. You do not micromanage it. You command it and hold it to the standard.

**Invoke it** with phrases like "execute the PRDs", "run the gauntlet", "snap it", or "ship these PRDs." The agent then runs four phases:

- **Phase 0, Recon and Planning.** It reads every PRD end to end and extracts every acceptance criterion into a master checklist, the AC Ledger, saved at the repo root so it survives context loss and you can audit it. It maps dependencies, produces a wave plan that maximizes parallel work, and picks the right model for each task. It shows you the wave plan and ledger, then executes without waiting for further approval.
- **Phase 1, Execution.** It orchestrates. Sub-agents do the building, each with a tightly scoped brief: the exact criteria it owns, the files it may touch, and how its work gets verified. No partial credit. A criterion is done only when it is fully implemented, proven by passing tests, and nothing else broke. Verification is a separate pass from implementation, because implementers do not grade their own homework. A watchdog kills any stalled sub-agent and re-dispatches the work at a smaller scope.
- **Phase 2, Guardian Gauntlet.** Once the ledger reads fully verified, it runs the quality and security guardians, fixes anything medium severity or higher through sub-agents, and loops until both guardians come back clean with the test suite still green.
- **Phase 3, Ship.** It commits, pushes, opens a PR whose description carries the full AC Ledger and wave plan, and then watches CI. If CI fails, it diagnoses, dispatches a fix, and watches the next run until the pipeline is fully green.

**How you command it well:**

- **Feed it tight PRDs.** The gauntlet is only as good as the acceptance criteria you wrote. Vague criteria produce vague results. This is why the PRD discipline above is not optional.
- **Define the scope, then get out of the way.** Tell it which PRDs are in play. Let it plan the waves and pick the models. That is its job.
- **Hold the line on done.** The skill is built to refuse partial completion. Do not talk it out of that. "Mostly works" is open, not done.
- **Read the ledger, not the chatter.** The AC Ledger at the repo root is the source of truth for the run. If a criterion is parked as blocked, it will come with a specific ask. Answer the ask and let it keep going.

The standard is the whole point. Every PRD, every acceptance criterion, verified, shipped, and green. Anything less is a failed run.

---

## License

Source-available. Use the skills and agents anywhere, including commercially. Do not sell them or pass them off as your own, and credit Legion Code Inc. See [`LICENSE.md`](LICENSE.md) for the full terms.

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-light.svg">
  <img alt="Legion symbol" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-light.svg" width="32">
</picture>

<sub>We are Legion. Vibe with Legion.</sub>

</div>
