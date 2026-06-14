---
name: big-bang-earth
description: Equips the big-bang-space subagent with the canonical rubric, format, and routing logic for proposing brand new Angels (Cursor IDE subagents) into the Legion AI Tools Factory. Use whenever a new guardian needs to be added to `ai-tools/proposed-angels-backlog.md` plus `ai-tools/proposed-angels-queue.md`. Encodes the four-tier research depth rubric, the three-role model routing (Research / Analyst / Builder), the category overrides (math_science, cli_devops, self_hosted_open), the exact backlog entry shape, the exact queue row shape, the search-query authoring discipline, and the position-numbering invariants. Not for editing existing entries, claiming queue rows, or running downstream pipeline steps (command-brief, weapon-forge, create-angel, god-register); those are owned by other skills and agents.
---

# big-bang-earth

Authoring rubric for new Angel proposals. The matching agent is [`big-bang-space`](../../agents/big-bang-space.md).

The Big Bang pair sits at the front of the Legion AI Tools Factory pipeline:

```text
big-bang-space (this Angel's caller)
  -> proposes a guardian
  -> appends entry to proposed-angels-backlog.md  (full shape)
  -> appends row   to proposed-angels-queue.md     (NNN|name)
  -> downstream pipeline picks the queue row
     -> command-brief -> weapon-forge -> create-angel -> god-register
```

The output of this skill is two appends only. It never reorders, edits, or deletes existing entries.

## Files this skill writes

| File | What goes there |
|---|---|
| `ai-tools/proposed-angels-backlog.md` | New entry block under the appropriate Tier heading (or under the trailing Tier 17 Extended Coverage section if no clean tier fit). |
| `ai-tools/proposed-angels-queue.md` | New `NNN\|guardian-name` row appended to the bottom of the body (after the YAML frontmatter and after the last existing row). |

It never touches `ai-tools/proposed-angels-completed.md` (that file is owned by the downstream pipeline when a row is claimed) and it never touches `ai-tools/model-comparison-matrix.md` (that file is the source of truth for model selection and is read-only from this skill's perspective).

## Step 1: Capture the proposal

Collect these inputs from the caller before writing anything:

1. **Topic / domain** in one sentence. Examples: "Stripe Connect marketplace integration," "TimescaleDB hypertables and continuous aggregates," "Datadog APM instrumentation."
2. **Scope boundary** in one sentence. What this Angel owns, and what it explicitly does NOT own (route-to clauses). The Legion convention is to hand off neighbouring concerns to peer Angels rather than absorb them.
3. **Failure mode** in one sentence. What happens if this Angel does its job badly. This signals the right depth tier.
4. **Stack context** if any. Named platforms, libraries, services. If the caller cannot name at least one platform or library, push back: vague Angels do not survive the pipeline.

If the caller gives you a clean spec with all four, skip the interview. If they don't, ask once for the missing pieces, then proceed.

## Step 2: Decide the guardian name

Conventions, in order:

1. Lowercase, kebab-case, ASCII only. No spaces. No underscores.
2. Always ends in `-guardian`.
3. Singular noun phrase. `react-guardian`, not `reacts-guardian`.
4. If the domain is a multi-product comparator, include the comparison axis. `orm-comparison-guardian`, not just `orm-guardian`.
5. If the domain is a specific named platform plus the surrounding surface, prefer the platform name first. `supabase-guardian`, `firebase-guardian`, `cloudflare-guardian`.
6. If the domain is a generic concern with no canonical platform, name the concern. `multi-tenancy-saas-guardian`, `data-modeling-guardian`, `caching-strategy-guardian`.
7. Never reuse a name that already exists in the backlog, the queue, the completed list, or `ai-tools/skills/god/SKILL.md`. Check all four before committing.

## Step 3: Pick the Research Depth

Four tiers, in increasing severity:

### shallow

5 to 10 pages of research, glossary-style. Low cognitive load. The Angel's failure mode is "a curated bookmark list might have been better." Use for productivity glossaries, naming conventions, simple template emitters, README style guides, changelog style guides.

### normal

Roughly 100 pages of research. Daily-driver enforcement, audit, or template work. Bounded decisions: known rule sets, known templates, known tool comparisons. No architecture. Examples: git workflow enforcement, dependency audit, conventional commits, simple onboarding tour libraries, agile process Angels.

### deep

Thousands of pages of research. Integral architectural role with many variances. The Angel's wrong decisions create real technical debt or relational damage. Requires canonical platform docs, primary GitHub sources, and 2026-current white papers. Most Tier 1 through Tier 16 platform Angels live here.

### extreme

The hardest tier. Catastrophic if mishandled: irrecoverable schema, fundamentally wrong architecture, broken cryptography, broken distributed-systems invariants, broken statistical or financial correctness, legal exposure (HIPAA, PCI-DSS, GDPR). Requires published papers, large-scale GitHub source repos, exhaustive StackOverflow and Reddit thread mining. Domains that need advanced mathematics, statistics, or peer-reviewed theory. Examples already in the roster: data-modeling, multi-tenancy, K8s, Terraform, DynamoDB single-table design, zero-downtime data migrations, ETL, LLM eval, fine-tuning, threat modeling, HIPAA, PCI-DSS, GDPR, KMS, web3 smart contracts, timezone, currency, CRDTs, KYC, usage-metering billing, tax jurisdictions.

### Calibration anchors (existing roster, do not change)

Use these to anchor your scale on every new proposal.

| Anchor guardian | Depth |
|---|---|
| react-guardian | deep |
| db-guardian | deep |
| devops-guardian | deep |
| security-guardian | deep |
| payments-guardian | deep |
| mind-guardian | deep |
| ux-ui-guardian | deep |
| auth-guardian | deep |
| seo-aeo-guardian | deep |
| design-system-guardian | deep |
| python-guardian | deep |
| website-guardian | deep |
| quality-guardian | normal |
| library-guardian | normal |
| wiki-guardian | normal |
| asset-guardian | normal |
| terminal-bash-guardian | shallow |
| data-modeling-guardian | extreme |
| multi-tenancy-saas-guardian | extreme |
| kubernetes-helm-guardian | extreme |
| realtime-collab-crdt-guardian | extreme |

If the proposed Angel feels heavier than `react-guardian`, it is probably `extreme`. If it feels like a curated reference rather than a synthesized framework, it is probably `shallow`.

## Step 4: Detect category overrides

Three overrides exist. Apply them only when the override criterion is the dominant signal, not a side note.

### math_science (overrides Analyst Model to `gemini-3.1-pro`)

The dominant work is mathematical, statistical, formal, or abstract reasoning. The Angel's analyst must reason about formulas, distributions, complexity classes, formal grammars, cryptographic primitives, or proofs of correctness.

Existing roster examples in this category: data-modeling, vector-db, RAG, embeddings, AI eval, fine-tuning, three.js / R3F, threat modeling, encryption key management, churn / cohort statistics, A/B testing for CRO, load-test statistical interpretation, query plan optimization, timezone formal correctness, money / currency precision, marketing attribution modeling, CRDTs, usage metering, tax jurisdiction math.

### cli_devops (overrides Builder Model to `gpt-5.3-codex-xhigh`)

The dominant deliverable from the weapon is shell scripts, CLI command sequences, config files, IaC, or Dockerfiles. NOT documentation about a topic that involves a CLI somewhere. The weapon must materially output runnable terminal artifacts.

Existing roster examples: terminal-bash, web-server, docker-fundamentals, hetzner-ovh-vps.

Reject this override when:

- The weapon is architecturally complex enough that opus's reasoning matters more than codex's CLI specialization (Terraform, Kubernetes, AWS architecture).
- The CLI is incidental (e.g., a platform Angel where users will mostly hit the dashboard or SDK, not the CLI).

### self_hosted_open (overrides Builder Model to `kimi-k2.5`)

The weapon will be consumed primarily inside air-gapped, self-hosted, on-prem, or open-weight environments. The builder benefits from kimi-k2.5's own self-hostable, open-weight context.

Existing roster examples: local-llm.

This is rare. Default to NOT applying this override.

## Step 5: Compute the model triplet

Apply the table below. Overrides win over the depth default.

### Research Model

| Depth | Model |
|---|---|
| shallow | `gemini-3.5-flash` |
| normal | `grok-4.3` |
| deep | `grok-4.3` |
| extreme | `kimi-k2.5` |

Rationale:

- `gemini-3.5-flash` for shallow: cheap, fast, 1M context, MCP Atlas leader. 5 to 10 pages is small output; speed dominates.
- `grok-4.3` for normal and deep: live X / web search grounding, 2M context, 16-agent Heavy mode for parallel research, lowest output cost for the capability tier, native document handling. The research-apostle's day job (download many pages, evaluate "good info or unhelpful") fits Grok's strengths.
- `kimi-k2.5` for extreme: Agent Swarm of up to 100 parallel sub-agents with 4.5x speedup for exhaustive thread mining across GitHub, StackOverflow, Reddit, and academic sources.

### Analyst Model

| Depth | Default | math_science override |
|---|---|---|
| shallow | `claude-4.6-sonnet-medium-thinking` | `gemini-3.1-pro` |
| normal | `claude-4.6-sonnet-medium-thinking` | `gemini-3.1-pro` |
| deep | `claude-opus-4-7-thinking-max` | `gemini-3.1-pro` |
| extreme | `claude-opus-4-7-thinking-max` | `gemini-3.1-pro` |

Rationale:

- Sonnet 4.6 is the GDPval-AA #1 knowledge-work workhorse. Default for shallow and normal where balance of cost and capability wins.
- Opus 4.7 thinking-max is the deepest reasoner with 1M context and adaptive thinking. Default for deep and extreme.
- Gemini 3.1 Pro tops GPQA Diamond and ARC-AGI-2. Apply the override only when the Angel's analyst will be doing actual mathematical or statistical reasoning, not just touching a numeric domain.

### Builder Model

| Depth | Default | cli_devops override | self_hosted_open override |
|---|---|---|---|
| shallow | `composer-2.5` | `gpt-5.3-codex-xhigh` | `kimi-k2.5` |
| normal | `claude-4.6-sonnet-medium-thinking` | `gpt-5.3-codex-xhigh` | `kimi-k2.5` |
| deep | `claude-opus-4-7-thinking-max` | `gpt-5.3-codex-xhigh` | `kimi-k2.5` |
| extreme | `claude-opus-4-7-thinking-max` | `gpt-5.3-codex-xhigh` | `kimi-k2.5` |

Rationale:

- `composer-2.5` for shallow is Cursor-native, 10x cheaper than Opus, purpose-built for IDE file edits. Cheap weapons get the cheap builder.
- Sonnet for normal is the daily-driver. Instruction following + GDPval-AA #1 is exactly what authoring a clean weapon needs.
- Opus for deep and extreme. 10/10 on code, reasoning, and instruction following. Worth the cost when the weapon's blast radius is large.
- `gpt-5.3-codex-xhigh` for cli_devops. Industry-leading Terminal-Bench 2.0 (77.3%). Best at writing shell scripts and config files.
- `kimi-k2.5` for self_hosted_open. Open-weight, deployable in air-gapped and self-hosted environments.

## Step 6: Author the search queries

5 to 7 queries per entry. Each query is a quoted string on its own bullet line.

Rules:

1. End every query with the current year (`2026`) so the research-apostle filters for current sources.
2. Name at least one platform, library, or canonical concept per query. "Best practices" alone is too vague.
3. Cover the Angel's full scope across the queries. Do not concentrate three queries on one sub-topic and leave the rest unaddressed.
4. Bias the first query toward the canonical authority (the platform's own 2026 docs / GitHub).
5. Include at least one comparison or decision query when the domain has competing tools ("X vs Y vs Z 2026").
6. Include at least one "production patterns" or "gotchas" query when the domain has known footguns.

Examples from the existing roster, calibrated to the right shape:

```markdown
- "Next.js 15 App Router Server Components production patterns 2026"
- "Next.js 15 Partial Prerendering PPR stable rollout 2026"
- "Next.js 15 caching directives use cache use server unstable_cache 2026"
- "Next.js 15 self-host Docker standalone output Bun runtime 2026"
- "Next.js Server Actions vs Route Handlers decision tree 2026"
```

## Step 7: Pick the position number

Position numbers are monotonic and never reused.

1. Read the last `NNN|name` row in `proposed-angels-queue.md` (the bottom of the file body).
2. Read the highest `### [ ] N. name` heading in `proposed-angels-backlog.md`.
3. Take the maximum of those two, add 1.
4. Zero-pad to 3 digits.

Example: if the bottom row is `231|rfc-protocol-literacy-guardian` and the highest backlog heading is `### [ ] 231. rfc-protocol-literacy-guardian`, the next proposal becomes `### [ ] 232. <new-name>` in the backlog and `232|<new-name>` in the queue.

If the queue and backlog disagree (highest numbers do not match), STOP and report the discrepancy back to the caller. Never invent a position number that papers over a desync.

## Step 8: Write the backlog entry

Append the entry under the most fitting tier heading. If there is no clean fit, append under the trailing Tier 17 Extended Coverage section.

Exact shape:

```markdown
### [ ] {position}. {guardian-name}
**Research Depth:** {shallow|normal|deep|extreme}
**Research Model:** {research model id}
**Analyst Model:** {analyst model id}
**Builder Model:** {builder model id}
**Purpose:** {single sentence, ends with a period, describes domain + scope + out-of-scope handoffs}
- "{search query 1, ends with 2026}"
- "{search query 2, ends with 2026}"
- "{search query 3, ends with 2026}"
- "{search query 4, ends with 2026}"
- "{search query 5, ends with 2026}"
```

Notes:

- `{position}` is the un-padded integer in the heading (matches existing roster style: `### [ ] 1. nextjs-guardian`, not `### [ ] 001. nextjs-guardian`).
- The four metadata lines go IMMEDIATELY under the heading. No blank line between heading and metadata.
- The Purpose line goes IMMEDIATELY under the four metadata lines. No blank line.
- Search queries are an unordered list (`-` prefix) directly under the Purpose line. No blank line between Purpose and the first query.
- Leave exactly one blank line after the last query and before the next `### [ ]` heading or `## Tier` heading.

## Step 9: Write the queue row

Append a single line to `ai-tools/proposed-angels-queue.md`, at the very bottom of the body (after the last existing row).

Exact shape:

```text
{NNN}|{guardian-name}
```

Where `{NNN}` is the zero-padded 3-digit position (`232`, `233`, ...).

No checkbox. No metadata. No leading or trailing whitespace.

Update the `totals.rows` field inside the queue's YAML frontmatter to match the new count. Update `date_updated:` to the current ISO date. Update `last_updated_by:` to the id of the agent that ran this skill.

## Step 10: Self-check before declaring done

- The position number is unique across backlog, queue, completed, and god.
- The guardian name is unique across the same four files.
- The metadata block has exactly four lines in the order Research Depth, Research Model, Analyst Model, Builder Model.
- The Purpose line uses regular hyphens only (workspace rule: no em or en dashes).
- The search queries are between 5 and 7 in count, each ends with the current year, each names at least one specific platform / library / concept.
- The queue body row count matches the YAML `totals.rows` field.
- The new entry is appended, not inserted in the middle. Older positions are untouched.

## Anti-patterns to refuse

1. Renumbering existing entries. NEVER do this. Position numbers are permanent claims.
2. Inserting in the middle of either file. Always append.
3. Mixing model IDs from the matrix with arbitrary new model names. Only the IDs in `ai-tools/model-comparison-matrix.md` are valid.
4. Search queries without a year. Old training data leaks in immediately.
5. Vague domains. "Helpful AI assistant for backend stuff" is not an Angel. The caller must name a platform, a concern, or a discipline.
6. Guardian names without the `-guardian` suffix.
7. Editing `ai-tools/skills/god/SKILL.md` from here. Registration is the final pipeline step, owned by `god-register`, not by this skill.
