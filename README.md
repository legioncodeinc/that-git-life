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
| [`.cursor/`](.cursor/) | Cursor agent definitions, skills, and project rules. |
| `README.md` | This file. |
| `LICENSE.md` | License. |

The work lives in `library/`. The agents read the PRDs there and build the product against them.

---

## Cursor agent and skill infrastructure

The `.cursor/` directory wires up the agents, skills, and project rules active in this repo:

| Path | What it does |
|---|---|
| `.cursor/agents/library-guardian.md` | Owns the full documentation lifecycle: scaffolding, PRD/IRD authoring, knowledge-base docs, sync audits, lifecycle moves. |
| `.cursor/agents/knowledge-guardian.md` | Authors narrative knowledge docs (system overviews, auth architecture, Mermaid diagrams, SQL schemas) under `library/knowledge/`. |
| `.cursor/skills/library-weapon/` | Skill package for the library-guardian agent. Guides, templates, and examples for every documentation workflow. |
| `.cursor/skills/knowledge-weapon/` | Skill package for the knowledge-guardian agent. Domain taxonomy, document format guide, analysis workflow, and templates. |
| `.cursor/skills/thanos-gauntlet-glove/` | End-to-end PRD execution orchestrator. Takes a set of PRDs from spec to merged, CI-green PR with no partial completion allowed. |
| `.cursor/rules/no-em-dashes.mdc` | Project rule: no em dashes or en dashes in any authored prose. |
| `.cursor/rules/respect-agent-work-boundaries.mdc` | Project rule: agents never modify files owned by another active agent or parallel session. |

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

These are the start-to-finish workflows. Each one runs through the bundled Cursor agents and skills. You drive them with plain-language commands. The agent does the filing, naming, and numbering by the rules baked into the skills.

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

Once your PRDs and IRDs are written, the Thanos Gauntlet Glove is how you execute them. It is the orchestrator skill at `.cursor/skills/thanos-gauntlet-glove/`. You point it at a set of PRDs and it drives them to 100 percent completion: spec to merged, CI-green PR, with no partial credit allowed. You do not micromanage it. You command it and hold it to the standard.

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

See [`LICENSE.md`](LICENSE.md).

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-light.svg">
  <img alt="Legion symbol" src="https://raw.githubusercontent.com/legioncodeinc/brands/main/legion-code-inc/logos/legion-symbol-light.svg" width="32">
</picture>

<sub>We are Legion. Vibe with Legion.</sub>

</div>
