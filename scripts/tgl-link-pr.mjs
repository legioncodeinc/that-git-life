#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { jsonOut, parseArgs, rel } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-link-pr.mjs --root <repo> --artifact <prd-or-ird-folder> --pr-url <url> [--merge-sha <sha>]");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}
if (!args.artifact) throw new Error("Missing --artifact");
if (!args["pr-url"]) throw new Error("Missing --pr-url");

const dir = join(args.root, args.artifact);
const index = join(dir, `${basename(dir)}-index.md`);
if (!existsSync(index)) throw new Error(`Artifact index not found: ${rel(args.root, index)}`);

let text = readFileSync(index, "utf8");
const block = [
  "## Ship Links",
  "",
  `- PR: ${args["pr-url"]}`,
  args["merge-sha"] ? `- Merge SHA: \`${args["merge-sha"]}\`` : "",
  `- Linked: ${new Date().toISOString()}`,
  "",
].filter(Boolean).join("\n");

if (/## Ship Links/.test(text)) {
  text = text.replace(/## Ship Links[\s\S]*?(?=\n---|\n## |\n?$)/, block);
} else {
  text = `${text.trim()}\n\n---\n\n${block}\n`;
}
writeFileSync(index, text);

const ledger = join(args.root, "EXECUTION_LEDGER.md");
if (existsSync(ledger)) {
  const note = `\n- PR linked: ${args["pr-url"]}${args["merge-sha"] ? ` (${args["merge-sha"]})` : ""}\n`;
  writeFileSync(ledger, `${readFileSync(ledger, "utf8").trimEnd()}\n${note}`);
}

jsonOut({ ok: true, artifact: args.artifact, index: rel(args.root, index), prUrl: args["pr-url"], mergeSha: args["merge-sha"] || "" });
