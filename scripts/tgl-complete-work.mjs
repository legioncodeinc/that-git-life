#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { jsonOut, moveDir, parseArgs, rel, replaceStatusLine } from "./tgl-utils.mjs";

function usage() {
  console.log("Usage: node scripts/tgl-complete-work.mjs --root <repo> --artifact <library/.../prd-or-ird-folder>");
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}
if (!args.artifact) throw new Error("Missing --artifact");

const from = join(args.root, args.artifact);
if (!existsSync(from)) throw new Error(`Artifact not found: ${args.artifact}`);
if (!args.artifact.includes("/in-work/") && !args.artifact.includes("/backlog/")) {
  throw new Error("Artifact must be in backlog or in-work to complete");
}

const toRel = args.artifact.replace("/in-work/", "/completed/").replace("/backlog/", "/completed/");
const to = join(args.root, toRel);
moveDir(from, to);

const index = join(to, `${basename(to)}-index.md`);
if (existsSync(index)) {
  writeFileSync(index, replaceStatusLine(readFileSync(index, "utf8"), "Shipped"));
}

jsonOut({ ok: true, from: args.artifact, to: toRel, index: rel(args.root, index) });
