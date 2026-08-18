---
name: verify
description: Prove a change to the kit actually works — full browser test suite, architecture invariants and the real publish artifact. Use before declaring work done.
---

# Verify

This is a library, so there is no app to launch. What stands in for it: the stories run in a
real Chromium, and the tarball is packed exactly as npm would.

## 1. Fast checks

```bash
npm run lint && npm run typecheck && npm run format:check
```

Roughly 3 s together. The `Stop` hook already runs these at the end of every turn, so a
failure here means something changed since.

`typecheck` runs TypeScript 7 (`tsc`), `lint` runs TypeScript 6 through
`typescript-eslint` — see the note in AGENTS.md for why both are installed. If the two ever
disagree, `typecheck` is the authority and `npx tsc6 --noEmit` is how you get the old
compiler's opinion on the same files.

## 2. The suite

```bash
npm run test
```

45 story files, 236 tests, ~7 s. Each story is an interaction test and an axe audit at
once; `a11y: { test: "error" }` makes any violation a failing test, and the run is pinned
to WCAG 2.2 AA plus `best-practice` in `.storybook/preview.tsx`.

To iterate on one component, pass its directory — a single file runs in about 1.5 s
instead of 7:

```bash
npx vitest run --project storybook src/components/<name>
```

Both commands bind a local port, so they are in `sandbox.excludedCommands` — they run
outside the sandbox by design, not by accident.

When a new check passes on the first try, prove it can fail before believing it. Both
guards added in this area were vacuous until tested with a deliberate violation: pinning
the axe tags does _not_ enable `target-size`, and a contrast assertion measures nothing if
the colour never parsed. Add a failing case, watch it fail, remove it.

## 3. Architecture invariants

Cheap greps that replace an import-graph tool. All three must print nothing.

Each carries the exemptions the architecture actually allows, so a clean run means clean.
Without them the composites (`confirm`, `data-table`, `pagination`) trip every check on
every run, and a guard that always cries wolf stops being read. **Adding a name to
`COMPOSITES` is a deliberate architecture decision, not a way to silence a failure** — see
the composite rule in AGENTS.md.

```bash
COMPOSITES='confirm|data-table|pagination'

# Only a composite imports another component; an atom shares nothing but src/lib/
grep -rn 'from "\.\./' src/components/*/[a-z]*.tsx | grep -v stories | grep -v '/lib/' \
  | grep -vE "src/components/($COMPOSITES)/"

# "use client" exactly where @base-ui/react is imported — plus the composites, which
# earn it by holding state rather than by wrapping Base UI
for f in src/components/*/[a-z]*.tsx; do case "$f" in *stories*) continue;; esac
  echo "$f" | grep -qE "/($COMPOSITES)/" && continue
  grep -q '"use client"' "$f"; uc=$?
  grep -q '@base-ui/react' "$f"; bu=$?
  [ "$uc" = "$bu" ] || echo "MISMATCH: $f"
done

# Every component carries at least one data-slot. `confirm` is exempt: it is a provider
# that renders AlertDialog's parts and has no element of its own to tag.
for f in src/components/*/[a-z]*.tsx; do case "$f" in *stories*|*/confirm/*) continue;; esac
  grep -q 'data-slot' "$f" || echo "NO data-slot: $f"
done
```

## 4. The real artifact

```bash
npm run pack-check && npm run check:tarball
```

`pack-check` builds, then runs publint and attw against the packed tarball rather than the
source — it is what catches a broken `exports` map or a type that does not resolve.
`check:tarball` asserts nothing but `LICENSE`, `README.md`, `dist` and `package.json` ever
ship (187 files today).

Worth reading `dist/` directly when the change touched the build: the `"use client"` banners
must survive, since `tsup` runs with `bundle: false` precisely to keep them.

`attw` prints the build tools it found and will name `typescript@npm:@typescript/typescript6`
there. That is the alias in `package.json`, not what emitted the declarations — `build:types`
runs `tsc`, which is TypeScript 7. If a change ever makes you doubt the emit, compare the two
compilers directly rather than trusting either:

```bash
npx tsc6 -p tsconfig.build.json --outDir /tmp/dts-6
npx tsc  -p tsconfig.build.json --outDir /tmp/dts-7
diff -r /tmp/dts-6 /tmp/dts-7
```

All 91 files were identical when TypeScript 7 was adopted; that is the check that let
`build:types` move off `tsc6`.

## 5. The docs site

```bash
npm run build-storybook
```

Catches a broken MDX or story before it reaches `main` and takes the Pages deployment down.
For a visual check instead, `npm run storybook` serves it on port 6006.

Report what actually ran and what it actually said.
