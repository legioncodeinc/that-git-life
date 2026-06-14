---
title: Wiki-weapon research synthesis
date: 2026-04-29
sources:
  - 2026-04-29-ts-morph-extraction.md
  - 2026-04-29-react-docgen-typescript.md
  - 2026-04-29-adr-format.md
  - 2026-04-29-conventional-commits-decisions.md
  - 2026-04-29-frontmatter-validation.md
  - 2026-04-29-wikilink-resolution.md
  - 2026-04-29-bullmq-queue-extraction.md
  - 2026-04-29-inngest-extraction.md
  - 2026-04-29-sql-ddl-parsing.md
  - 2026-04-29-cron-parser-ts.md
  - 2026-04-29-openfeature-flags.md
  - 2026-04-29-launchdarkly-extraction.md
  - 2026-04-29-git-blame-heuristics.md
---

# Wiki-weapon research synthesis

## Mapping: research → downstream guides

### `guides/04-entity-extraction-by-type.md`

| Sub-type | Primary research note | Secondary |
|---|---|---|
| `function` | `2026-04-29-ts-morph-extraction.md` | — |
| `class` | `2026-04-29-ts-morph-extraction.md` | — |
| `module` | `2026-04-29-ts-morph-extraction.md` (`ImportDeclaration`/`ExportedDeclarations`) | — |
| `service` | `2026-04-29-ts-morph-extraction.md` | (heuristic: file in `services/` or class with `@Injectable()` decorator) |
| `endpoint` | `2026-04-29-ts-morph-extraction.md` | (framework-specific decorators: `@Get()`, `app.get(...)`, `router.post(...)`) |
| `env-var` | (no dedicated research; AST scan for `process.env.X`, `import.meta.env.X`) | — |
| `config-key` | (no dedicated research; AST scan for known config-loader call sites) | — |
| `data-model` | `2026-04-29-ts-morph-extraction.md` (interfaces/type aliases/zod schemas) | `2026-04-29-sql-ddl-parsing.md` cross-link |
| `react-component` | `2026-04-29-react-docgen-typescript.md` | `2026-04-29-ts-morph-extraction.md` (arrow-function gotcha) |
| `sql-table` | `2026-04-29-sql-ddl-parsing.md` | — |
| `queue` | `2026-04-29-bullmq-queue-extraction.md` + `2026-04-29-inngest-extraction.md` | — |
| `cron-job` | `2026-04-29-cron-parser-ts.md` | `2026-04-29-bullmq-queue-extraction.md` (repeat: cron) + `2026-04-29-inngest-extraction.md` (cron triggers) |
| `feature-flag` | `2026-04-29-openfeature-flags.md` + `2026-04-29-launchdarkly-extraction.md` | — |

History sections in every entity body informed by `2026-04-29-git-blame-heuristics.md`.

### `guides/07-adr-detection.md`

- Pattern catalog & confidence threshold: `2026-04-29-conventional-commits-decisions.md` (Tier 1 / Tier 2 regex set).
- ADR document shape: `2026-04-29-adr-format.md` (Nygard 5-section template).
- ADR status transitions (proposed → accepted → superseded by NNNN): `2026-04-29-adr-format.md`.

### `guides/09-lint-mode.md`

- Wikilink resolution algorithm for dead-link detection: `2026-04-29-wikilink-resolution.md`.
- Frontmatter validation rules: `2026-04-29-frontmatter-validation.md`.
- ADR-specific lint (superseded_by chain integrity): `2026-04-29-adr-format.md` + `2026-04-29-conventional-commits-decisions.md` (revert-pattern detection).

### `references/frontmatter-schema.md`

- Schema definitions, Zod patterns, YAML gotchas: `2026-04-29-frontmatter-validation.md`.
- Wikilinks-in-arrays convention: `2026-04-29-wikilink-resolution.md` + `2026-04-29-frontmatter-validation.md`.
- `last_commit_hash` field semantics: `2026-04-29-git-blame-heuristics.md`.
- Per-type frontmatter fields (entity_type enum, decision-specific fields, queue-specific `triggers`, feature-flag `read_at`): drawn from each entity-type research note.

## Recommended implementation per entity type

| Entity type | Detection heuristic | Extraction library/API | Notes |
|---|---|---|---|
| `function` | ts-morph `sourceFile.getFunctions()` + `getVariableDeclarations().filter(isArrowFunctionInit)` | `ts-morph` `FunctionDeclaration` + `ArrowFunction` | Arrow-function gotcha: `getFunctions()` does NOT see `const f = () => {}`. Combine both walks. |
| `class` | ts-morph `sourceFile.getClasses()` | `ts-morph` `ClassDeclaration` (members via `getMethods()`, `getProperties()`, `getDecorators()`) | Decorators (e.g., `@Injectable`) hint at sub-type promotion to `service`. |
| `module` | One per source file with exported declarations | ts-morph `getExportedDeclarations()` + `getImportDeclarations()` | The narrative module page is library-guardian's job; wiki-guardian files an entity stub for the module-as-thing. |
| `service` | Class with `@Injectable()` / `@Service()` / file in `services/` directory | ts-morph + decorator inspection | If the framework is NestJS, also walk `@Module({ providers: [...] })`. |
| `endpoint` | Method decorator (`@Get`, `@Post`) OR call to `app.get(path, handler)` / `router.METHOD` | ts-morph `CallExpression` + framework-specific recognizers | Frameworks: Express, Fastify, Hono, NestJS, tRPC. v1 covers Express + NestJS. |
| `env-var` | AST scan for `MemberExpression` `process.env.X` / `import.meta.env.X` | ts-morph descendants of kind `PropertyAccessExpression` | Aggregate by name. List `read_at` per call site. |
| `config-key` | AST scan for known config-loader patterns (`config.get('key')`, `nconf.get(...)`) | ts-morph + per-loader recognizers | v1: support `config`, `nconf`, `convict`, plain `import config from './config.json'`. |
| `data-model` | TypeScript `interface`/`type`/Zod schema declarations | ts-morph `getInterfaces()`, `getTypeAliases()`, `CallExpression` for `z.object({...})` | Cross-link to `sql-table` if name-matched. |
| `react-component` | PascalCase function/arrow returning JSX in `.tsx`/`.jsx` files | `react-docgen-typescript` (`withCustomConfig(tsconfigPath, opts).parse(file)`) — falls back to ts-morph if parser yields `[]` | Render props as one body subsection (markdown table), NOT per-prop entity pages. Use `componentNameResolver` for `forwardRef`/`memo`/`styled` wrappers. |
| `sql-table` | `.sql` file containing `CREATE TABLE` statements | `node-sql-parser` `Parser.astify(sql, { database: dialect })`, filter `type === 'create' && keyword === 'table'` | Wrap in try/catch — typed AST is loose (issue #1701). For ORM-defined tables, prefer parsing the schema source file (Prisma/Drizzle) and file as `data-model`. |
| `queue` (BullMQ) | grep `from 'bullmq'`, then ts-morph `NewExpression` with `Queue`/`Worker` constructor | ts-morph + first-arg string-literal extraction | Pair Queue + Worker by name. Detect `repeat: { cron }` to file additional `cron-job`. |
| `queue` (Inngest) | grep `'inngest'` import, then ts-morph `CallExpression` with `.createFunction` callee | ts-morph + config-arg `id` field + `triggers` array walk | Each cron trigger spawns a paired `cron-job` entity. |
| `cron-job` | String literal at known framework call sites: `cron.schedule`, `schedule.scheduleJob`, `new Cron(...)`, BullMQ `repeat.cron`, Inngest `triggers.cron` | `cron-parser` `CronExpressionParser.parse(expr)` for validation + next-fire calc | Render top-3 next fire times in body. Default tz UTC unless framework specifies otherwise. |
| `feature-flag` (OpenFeature) | grep `@openfeature/`, then ts-morph `CallExpression` with `getBooleanValue`/`getStringValue`/etc. | ts-morph + first-string-arg extraction + `LAST positional arg` heuristic for default | Aggregate by flag key. Fields: `read_at: [{file, line}]`. |
| `feature-flag` (LaunchDarkly) | grep `launchdarkly-*` imports, then ts-morph `CallExpression` with `variation`/`boolVariation`/etc. | ts-morph + first-string-arg extraction + LAST-positional-arg default | Same aggregation. `provider: launchdarkly`. React `useFlags()` is a known gap — file under a concept. |

For ADR detection (separate from entity extraction):

| Tier | Trigger pattern | File destination |
|---|---|---|
| 1 (high confidence) | `BREAKING CHANGE:` footer; `feat!:`/`refactor!:` subject; body matches `Decision:` / `Rationale:` / `RFC` / `ADR`; subject matches switch-verb regexes (`switch from X to Y`, `replace X with Y`, `migrate from X to Y`, `deprecate X`, `adopt X`) | `decisions/<NNNN>-<slug>.md` (full Nygard template) |
| 2 (low confidence) | `refactor:`/`chore:` with multi-paragraph body; "rewrite/redesign/rearchitect" without Tier-1 verb; "instead of/rather than/we considered" tradeoff phrasing | `questions/<question>.md` (asks human to confirm) |
| Filter (ignore) | `docs:`/`style:`/`test:`/`chore: bump deps`/dependabot; single-line commits with no body; `Revert "..."` (these update a prior ADR's `superseded_by`, do NOT file new) | — |

## Contradictions and open questions across notes

1. **Wikilinks in YAML frontmatter — quoted strings or unquoted?** YAML doesn't accept `[[entities/foo]]` unquoted. Resolution: always quoted (`["[[entities/foo]]"]`). Document in `references/frontmatter-schema.md`. No contradictions, but easy to get wrong.
2. **Date strings — quoted to avoid YAML Date coercion?** Yes — always `created: "2026-04-29"`. Document.
3. **Filename casing — kebab-case for filenames vs camelCase preserved in body?** Recommend kebab-case for files, original casing in body. No contradiction; just a choice that needs locking in `guides/03-page-templates.md`.
4. **`adr_number` allocation — agent or driver?** Driver, because parallel ingestion can collide. Agent writes placeholder (`adr_number: <pending>`); driver fills in. Confirm with user before locking.
5. **Inngest functions — `entity_type: queue` or new `entity_type: workflow`?** Brief specifies 13 sub-types; Inngest doesn't fit cleanly into any. Pragma: file as `queue` because it's the closest semantically (background job). If user wants a 14th sub-type `workflow`, raise to user. **OPEN — user input needed.**
6. **React `useFlags()` — how to record `read_at` for hooks that read all flags?** Compromise: file `useFlags()` call sites under `concepts/launchdarkly-react-flag-set.md` and link individual flag entities via `read_at_via:`. Better than nothing but imperfect. **OPEN — user may want a different shape.**
7. **Lint mode authority — does it run dead-link detection in the agent or in the TS driver?** The agent's `lint` mode (per the Command Brief) is audit-only; the deep cross-page lint (orphans, dead-link sweep) needs the global file index, which only the driver has. Recommend: agent's `lint` mode reports per-chunk findings (frontmatter validation, in-chunk wikilink validation against the prior_state map); the driver runs the global pass. Confirm with user.
8. **Stub pages for non-JS files — what filename pattern?** Brief says `entities/<filename>.md` with `language: <detected>`. But `<filename>` can include extensions (`auth.go.md`?). Recommend dropping extension for the wiki filename and recording it in frontmatter (`source_extension: .go`). Confirm.

## Top-3 things the parent agent should know

1. **Atomicity is the architectural rule, but the pairing rule is louder.** Queues pair with their handler; cron jobs pair with their queue; flag pages aggregate from many call sites; ADRs pair `supersedes`/`superseded_by` chains. The Angel guides must pound this in: every entity page lists its sibling pairs in frontmatter, and the lint mode catches missing-pair situations as a first-class finding.

2. **The TS driver does the heavy lifting; the Angel obeys a contract.** Wiki-guardian doesn't run git, doesn't run `node-sql-parser` on the whole repo, doesn't allocate ADR numbers, doesn't reconcile the index. It receives a `chunk` + `git_context` + `prior_state` and writes per-page content + a structured response payload. This split shows up in EVERY entity-type research note — the agent's job is shape-correct AST extraction and entity-page authoring; the driver's job is anything that needs a global view.

3. **Two providers per cross-cutting type — bake in dual-provider gotchas.** Queues = BullMQ + Inngest. Feature flags = OpenFeature + LaunchDarkly. Cron jobs = `node-cron`/`node-schedule`/`croner` + the queue-system embedded crons. The Angel guides must explicitly enumerate these for `04-entity-extraction-by-type.md` so users in mixed-provider projects don't see half their queues missing. Future-proofing: when a third provider lands (e.g., Trigger.dev for queues), the same `entity_type: queue` accommodates it; only the recognizer changes.

## Queries that returned weak/contested results — flag for follow-up

- **Q1 (ts-morph) and Q3 (ADR) and Q4 (Conventional Commits)** — strong, canonical results, no follow-up needed.
- **Q5 (frontmatter validation)** — mostly strong; one gap is the Zod-schema-vs-JSON-Schema choice. Recommend Zod for v1 (zod-matter is the cleanest) and offer JSON Schema export later if editor integration matters.
- **Q6 (wikilink resolution)** — strong on Obsidian semantics but Cursor's preview behavior is undocumented. Tested briefly; Cursor renders wikilinks as plain text. Confirm with user whether to ship a Cursor-specific wikilink renderer or treat them as machine-greppable only. **FOLLOW-UP**.
- **Q13 (git blame heuristics)** — academic literature is rich but the Bird et al. defect-correlation finding is contested. The cheap surface heuristics (top-3 contributors, churn rate, last touched) are uncontroversial. v1 ships those; the deeper `minors`-as-defect-predictor stays out.
- **Inngest (Q8)** — strong on TypeScript SDK v4. Did not deeply explore the `serve()` registration pattern. May need a small follow-up if real-world Inngest projects use unusual export shapes.
- **`config-key` and `env-var` sub-types** — NOT searched (not in the 13 queries). These are obvious AST patterns (`process.env.X`, `config.get('x')`) but the per-loader recognizers (convict, nconf, dotenv) need a small follow-up. **FLAG: parent agent should consider one more search: "Node.js config loader patterns env-var extraction".**

---

**Files written:**
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-ts-morph-extraction.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-react-docgen-typescript.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-adr-format.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-conventional-commits-decisions.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-frontmatter-validation.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-wikilink-resolution.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-bullmq-queue-extraction.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-inngest-extraction.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-sql-ddl-parsing.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-cron-parser-ts.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-openfeature-flags.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-launchdarkly-extraction.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-git-blame-heuristics.md`
- `C:\Users\mario\GitHub\God\legion\.cursor\skills\wiki-weapon\research\2026-04-29-synthesis.md` (this file)
