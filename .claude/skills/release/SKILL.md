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

4. **Merge the "Version Packages" PR.** The same workflow runs again, finds no changesets
   left, and publishes whatever `package.json` says is not on npm yet. Its own log is the
   clearest description of the mechanism:

   ```
   No changesets found. Attempting to publish any unpublished packages to npm
   No NPM_TOKEN found, but OIDC is available - using npm trusted publishing
   @galarap/ui is being published because our local version (0.4.0) has not
     been published on npm
   packages published successfully: @galarap/ui@0.4.0
   Creating git tag...  New tag: v0.4.0
   ```

5. **Confirm.** `gh run watch` on the Release workflow, then
   `npm view @galarap/ui dist-tags`. The `v<version>` tag is pushed by the action, not by
   you.

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
- **`changesets/action` is pinned to an exact tag**, unlike `actions/checkout@v7` and
  `actions/setup-node@v6` beside it. It ships no moving major ref: `v1` was a _branch_ and
  no `v2` exists as either tag or branch, so `changesets/action@v2` simply fails to
  resolve. Bump it by hand.

## Two things about the "Version Packages" PR that look like faults and are not

- **It arrives with no checks.** Its CI run sits at `action_required` because GitHub makes
  workflows triggered by `github-actions[bot]` wait for manual approval. `mergeStateStatus`
  is `UNSTABLE`, not `BLOCKED`, so it still merges — and the tree is the one that already
  passed CI on the feature PR. Approve the run if you want the confirmation; nothing else
  is wrong.
- **`npx changeset status` exits 1 on a toolchain-only branch.** Changesets sees a changed
  package and asks for a changeset; it has no idea the change was a devDependency that
  cannot reach a consumer. The repo's rule is narrower than the tool's — a changeset is
  owed for `src/**`, not for the toolchain — so read that exit code, do not obey it.

## Since Changesets 3

- `changeset version` now **exits 1 when there is nothing to release**. CI never hits this:
  the action only runs `version-script` when changesets are pending. Running
  `npm run changeset:version` by hand on an empty queue now fails where it used to no-op.
- Changesets stopped bundling Prettier. `format` defaults to `"auto"` and picks up the
  project's own, which is why `CHANGELOG.md` still passes `npm run format:check` — a
  coupling that is invisible in `config.json` because JSON takes no comments.
- `changeset tag` is now `changeset git-tag`, and `--sinceMaster` is `--since=main`.
