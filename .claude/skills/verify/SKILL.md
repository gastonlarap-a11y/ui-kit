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

Roughly 4 s together. The `Stop` hook already runs these at the end of every turn, so a
failure here means something changed since.

## 2. The suite

```bash
npm run test
```

24 story files, 80 tests, ~6 s. Each story is an interaction test and an axe audit at once;
`a11y: { test: "error" }` makes any violation a failing test.

This command binds a local port, so it is in `sandbox.excludedCommands` — it runs outside
the sandbox by design, not by accident.

## 3. Architecture invariants

Cheap greps that replace an import-graph tool. All three must print nothing:

```bash
# No component imports another component (only src/lib/ is shared)
grep -rn 'from "\.\./' src/components/*/[a-z]*.tsx | grep -v stories | grep -v '/lib/'

# "use client" exactly where @base-ui/react is imported, nowhere else
for f in src/components/*/[a-z]*.tsx; do case "$f" in *stories*) continue;; esac
  grep -q '"use client"' "$f"; uc=$?
  grep -q '@base-ui/react' "$f"; bu=$?
  [ "$uc" = "$bu" ] || echo "MISMATCH: $f"
done

# Every component carries at least one data-slot
for f in src/components/*/[a-z]*.tsx; do case "$f" in *stories*) continue;; esac
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
ship (107 files today).

Worth reading `dist/` directly when the change touched the build: the `"use client"` banners
must survive, since `tsup` runs with `bundle: false` precisely to keep them.

## 5. The docs site

```bash
npm run build-storybook
```

Catches a broken MDX or story before it reaches `main` and takes the Pages deployment down.
For a visual check instead, `npm run storybook` serves it on port 6006.

Report what actually ran and what it actually said.
