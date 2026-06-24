#!/usr/bin/env node
import { join } from "node:path";
import { ensureDir, jsonOut, parseArgs, readTemplate, rel, titleCaseFromSlug, toSlug, writeIfMissing } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-new-ird.mjs --root <repo> --issue <github-issue-number> --title <title>");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}
if (!args.issue || !/^\d+$/.test(args.issue)) throw new Error("Missing numeric --issue. IRD numbers must match GitHub issue numbers.");
if (!args.title) throw new Error("Missing --title");

const number = String(Number(args.issue)).padStart(3, "0");
const slug = toSlug(args.title);
const title = titleCaseFromSlug(slug);
const dir = join(args.root, "library", "issues", "backlog", `ird-${number}-${slug}`);
const index = join(dir, `ird-${number}-${slug}-index.md`);
ensureDir(join(dir, "qa"));

let template = readTemplate(
  args.root,
  "ird-template.md",
  "# IRD-<###>: <Issue Title>\n\n## Problem\n\n## Root cause\n\n## Fix plan\n\n## Acceptance criteria\n\n| ID | Criterion |\n|---|---|\n| AC-1 | Given <context>, when <action>, then <outcome>. |\n",
);
const marker = "COPY EVERYTHING BELOW THIS LINE INTO YOUR IRD FILE";
if (template.includes(marker)) {
  template = template.split("-->").slice(1).join("-->").trimStart();
}
template = template.replaceAll("<###>", number).replaceAll("<Issue Title>", title);

writeIfMissing(index, template);
writeIfMissing(join(dir, "qa", "README.md"), readTemplate(args.root, "qa-README.md", "# QA\n\nQuality reports for this IRD live here.\n"));

jsonOut({
  ok: true,
  type: "ird",
  number,
  slug,
  dir: rel(args.root, dir),
  index: rel(args.root, index),
});
