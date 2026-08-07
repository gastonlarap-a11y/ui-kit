import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";

/**
 * Packs the tarball exactly as npm would and asserts nothing beyond the intended
 * files ever ships. A missing/incorrect `files` field is how whole source trees end
 * up published by accident, and npm releases cannot be replaced after the fact.
 */
const ALLOWED_ROOTS = new Set(["LICENSE", "README.md", "dist", "package.json"]);

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();

const tarball = run("npm", ["pack", "--silent"]).split("\n").pop();

try {
  const entries = run("tar", ["-tzf", tarball])
    .split("\n")
    .map((line) => line.replace(/^package\//, ""))
    .filter(Boolean);

  const roots = new Set(entries.map((entry) => entry.split("/")[0]));
  const unexpected = [...roots].filter((root) => !ALLOWED_ROOTS.has(root));

  if (unexpected.length > 0) {
    console.error(
      `✗ Tarball contains unexpected entries: ${unexpected.join(", ")}`,
    );
    console.error(`  Allowed roots: ${[...ALLOWED_ROOTS].join(", ")}`);
    process.exit(1);
  }

  if (!roots.has("dist")) {
    console.error("✗ Tarball has no dist/ directory — the build did not run.");
    process.exit(1);
  }

  console.log(
    `✓ Tarball clean: ${entries.length} files, roots = ${[...roots].sort().join(", ")}`,
  );
} finally {
  rmSync(tarball, { force: true });
}
