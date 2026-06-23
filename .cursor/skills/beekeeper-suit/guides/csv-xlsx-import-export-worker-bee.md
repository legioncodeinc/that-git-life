# csv-xlsx-import-export Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `csv-xlsx-import-export-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/csv-xlsx-import-export-worker-bee.md`](../../agents/csv-xlsx-import-export-worker-bee.md)
**Stinger:** [`.cursor/skills/csv-xlsx-import-export-stinger/`](../../skills/csv-xlsx-import-export-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`csv-xlsx-import-export-worker-bee` owns the full data-exchange surface between a user's spreadsheet file and an application's data model. On the import side it covers format detection, streaming parse (papaparse, SheetJS, ExcelJS), column-mapping UX design (5-stage wizard, managed importers vs. self-hosted react-spreadsheet-import), per-row Zod validation, and structured row-level error reporting. On the export side it owns ExcelJS workbook construction with styled headers, streaming CSV generation, and CSV injection prevention (CWE-1236). It is opinionated on library choice — papaparse for browser-side CSV, SheetJS CE in a Web Worker for browser-side XLSX, ExcelJS for server-side XLSX — and encodes known production gotchas such as the SheetJS streaming limitation and the ExcelJS WorkbookWriter memory leak.

## Trigger phrases

Route to `csv-xlsx-import-export-worker-bee` when the user says any of:

- "build a CSV import"
- "add XLSX upload"
- "column-mapping wizard"
- "export to Excel"
- "streaming parse large file"
- "CSV injection safe?"
- "compare OneSchema vs Flatfile vs dromo vs hand-rolled"
- "why is SheetJS not streaming my XLSX?"

Or when the request implicitly involves parsing, validating, mapping, or exporting spreadsheet data (CSV or XLSX) in a React/Next.js product.

## Do NOT route when

- The request is about the **file drop-zone UI** (drag-and-drop area, progress indicator, react-dropzone component) — that belongs to `ux-ui-worker-bee`.
- The request is about **database bulk-insert performance** after the rows are already parsed — that belongs to `db-worker-bee`.
- The request is about **upload endpoint security hardening** (rate limiting, virus scanning, zip-bomb protection, path traversal) — that belongs to `security-worker-bee`; this Bee hands off to it before any endpoint reaches production.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **File format(s)** — CSV, XLSX, or both (required to pick the correct library stack).
- **Max file size / expected file size** — required to prescribe the correct streaming or Web Worker strategy; files over 5 MB need special handling.
- **Whether column mapping is needed** — determines if the 5-stage wizard and managed-importer evaluation apply.
- **Validation rules** — field types, required columns, business constraints; if absent, the Bee will propose a Zod schema and ask for confirmation.
- **Output target** — React state, API call, or direct DB insert (optional; defaults to React state with API handoff).
- **Export requirements** — whether styled headers, freeze panes, or CSV download are needed (optional; defaults to unstyled CSV if unspecified).

## Outputs the Bee produces

- **Implementation code** — React components and/or Next.js Route Handlers covering parse, column-mapping wizard, Zod validation, and export, placed in the appropriate `app/` or `components/` paths.
- **Import findings report** — a populated `templates/import-report.md` documenting library decisions, architecture notes, sanitization checklist, and the handoff checklist for `security-worker-bee`.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (upload endpoint audit) then `quality-worker-bee` (code review and test coverage).

## Critical directives the orchestrator should respect

- **Never skip CSV injection sanitization even if the import target is a database.** Exported data may later be downloaded as CSV and opened in Excel, creating a deferred injection surface (CWE-1236).
- **Always prescribe a streaming or Web Worker strategy for files over 5 MB** before writing any parse code. Synchronous `readAsArrayBuffer` on a 100 MB XLSX freezes the browser main thread and crashes low-RAM devices.
- **Do not recommend managed importers (OneSchema, Flatfile, Dromo) without stating pricing and GDPR data-routing implications.** OneSchema has no free tier (~$38K/year median contract); Dromo starts at $499/month but is the only option that processes data client-side for GDPR/HIPAA.
- **Always report errors at the row level** (row number, column, message, severity) — not just file level — so users can fix their spreadsheet rather than re-uploading from scratch.
- **Call `row.commit()` immediately after every row in ExcelJS WorkbookWriter** to avoid the active memory leak (Issue #2916) that causes OOM on long export jobs.
- **Hand off to `security-worker-bee` before any upload endpoint reaches production.** File parsing is a classic attack surface (zip bombs, billion-laughs XLSX, path traversal).

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
