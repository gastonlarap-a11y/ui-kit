import { readFileSync, writeFileSync } from "node:fs";

/**
 * Copies the version from package.json into package-lock.json after
 * `changeset version` has bumped it.
 *
 * This replaces `npm install --package-lock-only`, which re-resolves the whole
 * dependency graph and fails on CI with EALLOWREMOTE: resolving Tailwind's
 * platform-optional `@tailwindcss/oxide-wasm32-wasi` reaches a dependency npm 11
 * classifies as a "remote" spec and refuses to fetch. Nothing about a version bump
 * needs the network, so this does the edit directly and stays deterministic.
 */
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lockPath = "package-lock.json";
const lock = JSON.parse(readFileSync(lockPath, "utf8"));

if (lock.version === pkg.version && lock.packages[""].version === pkg.version) {
  console.log(`package-lock.json already at ${pkg.version}`);
} else {
  lock.version = pkg.version;
  lock.packages[""].version = pkg.version;
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  console.log(`package-lock.json synced to ${pkg.version}`);
}
