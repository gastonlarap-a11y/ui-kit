# @galarap/ui

Accessible React component library on Base UI + Tailwind CSS v4. ESM-only, published to
npm as `@galarap/ui`, documented as a Storybook site on GitHub Pages.

## Layout

- `src/components/<name>/` — `<name>.tsx` + `<name>.stories.tsx` + `index.ts`, re-exported from `src/index.ts`
- `src/lib/` — helpers; `cn`, `useDataTable` and `useConfirm` are public, `icons.tsx` and
  `popup-classes.ts` never ship in the barrel
- `src/styles/tokens.css` — the public token entrypoint, shipped uncompiled on purpose
- `.storybook/` — docs-only helpers; they live outside `src/` because tsup builds every `src/**` module
- `scripts/` — build and publish guards, run from npm scripts

## Commands

- Test: `npm run test` (stories as interaction tests + axe, real Chromium) · Watch: `npm run test:watch`
- Lint: `npm run lint` · Typecheck: `npm run typecheck` · Format: `npm run format` / `npm run format:check`
- Build: `npm run build` · Docs: `npm run storybook` / `npm run build-storybook`
- Publish gates: `npm run pack-check` (publint + attw against the real tarball) · `npm run check:tarball`

## Rules

- The stories ARE the tests. There is no `*.test.tsx` in this repo and there should not be.
- Any change under `src/**` ships a changeset (`npm run changeset`). Publishing is CI-only
  through npm trusted publishing (OIDC) — never run `npm publish` locally.
- Relative imports carry an explicit `.js` extension; `nodenext` is what keeps the
  `tsup --no-bundle` output valid ESM instead of bundler-only output.
- Colors come from the semantic tokens (`bg-surface`, `text-fg-muted`, …), never from a raw
  Tailwind palette color.
- Never impose a font family and never add an icon dependency: the kit inherits the host
  application's typography and draws its few glyphs inline.

## Architecture

- `src/index.ts` is the only entry point; `src/lib/` is internal except for what the
  barrel re-exports.
- **Atoms never import another component** — only `src/lib/`. That is 39 of the 42
  components and the invariant still holds for all of them.
- **A composite may compose atoms**, and must keep its behaviour in a `src/lib/` hook with
  no JSX, exported on its own so a consumer can rebuild the markup and keep the logic.
  There are exactly three: `DataTable`, `Pagination` and `ConfirmProvider`. Adding one is
  a deliberate decision, not the default: reach for it only when the behaviour is worth
  more than the coupling.
- **A wrapper that can be composed through `render` must not impose color.** Base UI
  merges both class strings and `tailwind-merge` never sees the composed component's, so
  the wrapper wins and silently overrides it — this produced a real contrast failure in
  `Toolbar`. `DialogTrigger` is the pattern to copy: behaviour only, no styling.
- Nothing runs on import: `bundle: false`, `sideEffects` limited to CSS, no module-level state.
- Tests sit with the unit of change: each component's own `.stories.tsx`.
- Pre-1.0: the public API is not stable until `1.0.0`. Breaking changes are majors, and
  anything removed is deprecated first.

## Known gap

23 of the 42 components render the 3 brands × 2 schemes matrix; axe checks the other 19
in the default `blue`/`light` theme alone, so a contrast regression in `green` or `dark`
does not fail CI for them. Everything added after the original catalogue ships one, as do
the five whose surface changed since. The remaining 19 are the untouched originals. New
components ship a `ThemeMatrix` story (see the `new-component` skill); retrofitting the
rest is open work.

The matrix earns its keep: it has already caught three real problems — a label inheriting
the host's text color inside `.dark`, a toolbar item overriding a composed button's
foreground at 3.26:1, and the portal limitation below.

Portalled components resolve the theme of `<html>`, not of the `[data-theme]` / `.dark`
subtree their trigger sits in, because they render into `<body>`. Scoped theming works
in place; popups follow the document. See the tokens rule and
`PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`.

## Engineering standards

- Every feature ships with its tests. Run `npm run lint` + `npm run typecheck` +
  `npm run test` before declaring work done; report real results.
- Handle errors explicitly at boundaries; never swallow exceptions or ignored error returns.
- No speculative abstractions: introduce a pattern only for a problem this repo has, and say
  which and why.
- Ambiguous request → ask targeted questions first. Requested approach wrong or beatable →
  say why and let the requester choose before proceeding.
