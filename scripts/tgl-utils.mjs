import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

export function parseArgs(argv, spec = {}) {
  const args = { root: process.cwd() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    const type = spec[key] || "value";
    if (type === "boolean") {
      args[key] = true;
    } else {
      const value = argv[i + 1];
      if (value == null || value.startsWith("--")) {
        throw new Error(`Missing value for --${key}`);
      }
      args[key] = value;
      i += 1;
    }
  }
  args.root = resolve(args.root);
  return args;
}

export function resolveInsideRoot(root, input, label) {
  const target = resolve(root, input || ".");
  const relativePath = relative(resolve(root), target);
  if (relativePath && (relativePath.startsWith("..") || isAbsolute(relativePath))) {
    throw new Error(`${label} must stay within --root: ${input}`);
  }
  return target;
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function writeIfMissing(path, content) {
  if (existsSync(path)) return false;
  ensureDir(dirname(path));
  writeFileSync(path, content);
  return true;
}

export function toSlug(input) {
  return String(input || "untitled")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "") || "untitled";
}

export function titleCaseFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function findTemplate(root, name) {
  const candidates = [
    join(root, ".agents", "skills", "library-stinger", "templates", name),
    join(root, ".cursor", "skills", "library-stinger", "templates", name),
    join(root, ".agents", "skills", "adr-writing-stinger", "templates", name),
    join(root, ".cursor", "skills", "adr-writing-stinger", "templates", name),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return "";
}

export function readTemplate(root, name, fallback) {
  const path = findTemplate(root, name);
  return path ? readFileSync(path, "utf8") : fallback;
}

export function listDirs(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .map((entry) => join(path, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .sort();
}

export function listFilesRecursive(root) {
  const out = [];
  function walk(path) {
    if (!existsSync(path)) return;
    for (const entry of readdirSync(path)) {
      const full = join(path, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      if (stat.isFile()) out.push(full);
    }
  }
  walk(root);
  return out.sort();
}

export function nextPrdNumber(root) {
  const bases = [
    join(root, "library", "requirements", "backlog"),
    join(root, "library", "requirements", "in-work"),
    join(root, "library", "requirements", "completed"),
  ];
  let max = 0;
  for (const base of bases) {
    for (const dir of listDirs(base)) {
      const match = basename(dir).match(/^prd-(\d+)-/);
      if (match) max = Math.max(max, Number(match[1]));
    }
  }
  return String(max + 1).padStart(3, "0");
}

export function nextAdrNumber(root) {
  const arch = join(root, "library", "knowledge", "private", "architecture");
  let max = 0;
  for (const file of listFilesRecursive(arch)) {
    const match = basename(file).match(/^ADR-(\d+)/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return String(max + 1).padStart(4, "0");
}

export function git(root, args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

export function run(root, command, args) {
  try {
    return {
      ok: true,
      stdout: execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(),
      stderr: "",
    };
  } catch (error) {
    return {
      ok: false,
      stdout: error?.stdout?.toString?.().trim?.() || "",
      stderr: error?.stderr?.toString?.().trim?.() || error?.message || "",
    };
  }
}

export function moveDir(from, to) {
  ensureDir(dirname(to));
  renameSync(from, to);
}

export function replaceStatusLine(markdown, status) {
  if (/>\s+\*\*Status:\*\*.*/.test(markdown)) {
    return markdown.replace(/>\s+\*\*Status:\*\*.*/, `> **Status:** ${status}`);
  }
  return markdown;
}

export function rel(root, path) {
  return (relative(root, path) || ".").replace(/\\/g, "/");
}

export function jsonOut(value) {
  console.log(JSON.stringify(value, null, 2));
}
