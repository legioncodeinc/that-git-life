#!/usr/bin/env node
import { join } from "node:path";
import { ensureDir, jsonOut, nextPrdNumber, parseArgs, readTemplate, rel, titleCaseFromSlug, toSlug, writeIfMissing } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-new-prd.mjs --root <repo> --title <title> [--summary <summary>]");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}
if (!args.title) throw new Error("Missing --title");

const number = nextPrdNumber(args.root);
const slug = toSlug(args.title);
const title = titleCaseFromSlug(slug);
const dir = join(args.root, "library", "requirements", "backlog", `prd-${number}-${slug}`);
const index = join(dir, `prd-${number}-${slug}-index.md`);
ensureDir(join(dir, "qa"));

let template = readTemplate(
  args.root,
  "prd-template.md",
  "# PRD-<###>: <Module Title>\n\n## Overview\n\n## Goals\n\n## Non-Goals\n\n## Acceptance criteria\n\n| ID | Criterion |\n|---|---|\n| AC-1 | Given <context>, when <action>, then <outcome>. |\n",
);
const marker = "COPY EVERYTHING BELOW THIS LINE INTO YOUR PRD FILE";
if (template.includes(marker)) {
  template = template.split("-->").slice(1).join("-->").trimStart();
}
template = template
  .replaceAll("<###>", number)
  .replaceAll("<Module Title>", title)
  .replaceAll("<slug>", slug)
  .replace("<!-- One paragraph: what this module does and why it exists. -->", () => args.summary || "<!-- One paragraph: what this module does and why it exists. -->");

writeIfMissing(index, template);
writeIfMissing(join(dir, "qa", "README.md"), readTemplate(args.root, "qa-README.md", "# QA\n\nQuality reports for this PRD live here.\n"));

jsonOut({
  ok: true,
  type: "prd",
  number,
  slug,
  dir: rel(args.root, dir),
  index: rel(args.root, index),
});
