# csv-xlsx-import-export Guardian -- God's Guide

The God routing skill's record of when to invoke `csv-xlsx-import-export-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/csv-xlsx-import-export-guardian.md`](../../agents/csv-xlsx-import-export-guardian.md)
**Weapon:** [`ai-tools/skills/csv-xlsx-import-export-weapon/`](../../skills/csv-xlsx-import-export-weapon/)
**Command Brief:** [`ai-tools/command-briefs/csv-xlsx-import-export-guardian-command-brief.md`](../../../ai-tools/command-briefs/csv-xlsx-import-export-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`csv-xlsx-import-export-guardian` owns the full data-exchange surface between a user's spreadsheet file and an application's data model. This includes: browser-side and server-side CSV/XLSX parsing (papaparse, SheetJS CE, ExcelJS), streaming strategies for large files (Web Worker isolation, ExcelJS ReadStream), column-mapping UX design (5-stage wizard, managed importer selection, self-hosted react-spreadsheet-import), per-row Zod validation with row-level error objects, CSV injection prevention (CWE-1236), encoding handling (UTF-8 BOM, CP1252), styled XLSX export (ExcelJS WorkbookWriter with memory-leak workaround), and streaming CSV export with correct security headers.

## Trigger phrases

Route to `csv-xlsx-import-export-guardian` when the user says any of:

- "Build a CSV import feature"
- "Add XLSX / Excel file upload"
- "Column-mapping wizard for my importer"
- "How do I parse a 100 MB spreadsheet without freezing the browser?"
- "Export to Excel with styled headers"
- "Is my CSV export safe from formula injection?"
- "Compare OneSchema vs Flatfile vs dromo vs hand-rolled"
- "Why is SheetJS not streaming my XLSX?"
- "papaparse chunk callback pattern"
- "ExcelJS memory leak issue"
- "CSV injection =SUM attack"
- "UTF-8 BOM for Excel"

Or when the request implicitly involves user-uploaded spreadsheet files or downloadable data exports.

## Do NOT route when

- The user needs a file drop-zone component, drag-and-drop upload UI, or progress indicator -- route to `ux-ui-guardian`.
- The user needs to optimize the database bulk-insert performance after the import -- route to `db-guardian`.
- The user needs a security audit of the upload endpoint (MIME type validation, zip-bomb protection, path traversal) -- route to `security-guardian`. Note: `csv-xlsx-import-export-guardian` covers cell-level sanitization but NOT endpoint hardening.
- The user is setting up a scheduled ETL pipeline from an object storage source -- this Angel handles interactive imports, not scheduled batch jobs.

If a request straddles import UX and security, handle the import layer first and then explicitly escalate to `security-guardian` for the endpoint audit.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The framework and stack (Next.js App Router, React + API, plain Node.js).
- The target file format(s) -- CSV, XLSX, or both.
- The approximate maximum file size (small < 5 MB, medium 5-50 MB, large 50-500 MB).
- Whether column mapping is required (fixed known schema vs user-uploaded files with varying headers).
- The output target (React state, API call, database via ORM).
- Any export requirements (which data, format, styling preferences).

Optional: existing parse/export code to review; a PRD or feature spec.

## Outputs the Angel produces

- Markdown findings/implementation report (from `templates/import-report.md`).
- Ready-to-paste TypeScript code for parse, validation, mapping, and export layers.
- Library selection rationale with trade-off notes.
- CSV injection sanitization function (`sanitizeCsvCell()`).
- Explicit handoff instructions to `security-guardian` for upload endpoint review.

## Multi-Angel sequences this Angel participates in

- **CSV/XLSX feature implementation plan** -- csv-xlsx-import-export-guardian implements the parse + validation + export layer; `ux-ui-guardian` handles the drop-zone UI; `db-guardian` handles the bulk-insert schema; `security-guardian` audits the upload endpoint.

## Critical directives the orchestrator should respect

- Always invoke `security-guardian` after this Angel finishes and before the upload endpoint ships to production.
- Never route large-file streaming architecture questions to this Angel without confirming the file size -- files > 500 MB require a background-job pipeline outside this Angel's scope.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
