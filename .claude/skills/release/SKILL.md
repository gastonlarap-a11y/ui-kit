---
name: release
description: Ship a new version of @galarap/ui to npm. User-invoked only.
disable-model-invocation: true
---

# Release

Publishing is **CI-only**. There is no npm token anywhere: `release.yml` exchanges a GitHub
OIDC token for a short-lived credential and attaches provenance. Running `npm publish`
locally cannot work and must not be attempted.

## The flow

1. **Changeset.** Every PR touching `src/**` carries a `.changeset/<slug>.md`. Write it by
   hand, in the prose style of the existing ones — what changed and why it matters to a
   consumer. `patch` / `minor` / `major`; pre-1.0, a breaking change is still `minor`.

2. **Merge the PR into `main`.** `main` is protected, so CI has already passed.

3. **`release.yml` opens a "Version Packages" PR.** It runs `npm run changeset:version`,
   which bumps `package.json`, folds the changesets into `CHANGELOG.md` and syncs the
   lockfile version via `scripts/sync-lock-version.mjs` without re-resolving dependencies.
   Review that PR like any other — it is the last point where the version number is yours.

4. **Merge the "Version Packages" PR.** The same workflow now runs `npm run release`
   (`changeset publish`) and the package goes out with provenance.

5. **Confirm.** `gh run watch` on the Release workflow, then check the version on npm.

## Pre-flight, before merging anything into `main`

```bash
npm run lint && npm run typecheck && npm run format:check
npm run test
npm run pack-check && npm run check:tarball
```

`pack-check` is the one that matters here: it validates module and type resolution against
the real tarball, and an npm release cannot be replaced after the fact.

## Traps already paid for — do not undo them

- **No `registry-url` in `setup-node`.** It writes an `_authToken` line into a temp `.npmrc`
  that expands to a literal placeholder with no token secret; npm then authenticates with a
  bogus credential and the registry answers **404**, which reads like "the package does not
  exist". Trusted publishing needs no `.npmrc` entry at all.
- **npm is pinned to latest** in the workflow: trusted publishing requires npm ≥ 11.5.1.
- `release.yml` only triggers on changes to `src/**`, `.changeset/**`, `package.json` and
  `package-lock.json` — a docs-only commit produces no release.

## Pending validation

Steps 3–5 are reconstructed from `.github/workflows/release.yml` and the repository history
(`chore(release): version packages` PRs #4 and #7 landed this way). They have not been
re-executed while writing this skill, because doing so publishes. Verify against the actual
workflow run the first time you use this.
