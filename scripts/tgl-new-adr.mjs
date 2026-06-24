#!/usr/bin/env node
import { join } from "node:path";
import { jsonOut, nextAdrNumber, parseArgs, readTemplate, rel, titleCaseFromSlug, toSlug, writeIfMissing } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-new-adr.mjs --root <repo> --title <title>");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}
if (!args.title) throw new Error("Missing --title");

const number = nextAdrNumber(args.root);
const slug = toSlug(args.title);
const title = titleCaseFromSlug(slug);
const file = join(args.root, "library", "knowledge", "private", "architecture", `ADR-${number}-${slug}.md`);
const today = new Date().toISOString().slice(0, 10);

let template = readTemplate(args.root, "nygard.md", "# NNNN. <Title>\n\nDate: YYYY-MM-DD\n\n## Status\n\nProposed\n\n## Context\n\n## Decision\n\n## Consequences\n\n## Alternatives Considered\n");
template = template.replace("NNNN", number).replace("<Title>", title).replace("YYYY-MM-DD", today);

writeIfMissing(file, template);

jsonOut({
  ok: true,
  type: "adr",
  number,
  slug,
  file: rel(args.root, file),
});
