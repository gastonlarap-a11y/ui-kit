# @galarap/ui

Accessible React component library on Base UI + Tailwind CSS v4. ESM-only, published to
npm as `@galarap/ui`, documented as a Storybook site on GitHub Pages.

## Layout

- `src/components/<name>/` — `<name>.tsx` + `<name>.stories.tsx` + `index.ts`, re-exported from `src/index.ts`
- `src/lib/` — helpers; `cn`, `useDataTable` and `useConfirm` are public, `icons.tsx` and
  `popup-classes.ts` never ship in the barrel
- `src/styles/tokens.css` — the public token entrypoint, shipped uncompiled on purpose
- `.storybook/` — docs-only helpers (`arg-types.ts`, `theme-matrix.tsx`); they live outside
  `src/` because tsup builds every `src/**` module
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
- Tests sit with the unit of change: each component's own `.stories.tsx`, plus three
  cross-cutting guides in `src/docs/` that measure what no single component can:
  `Guides/Tokens` (every colour pair's WCAG ratio), `Guides/Sizing` (control heights agree)
  and `Guides/Direction` (the layout mirrors under `dir="rtl"`).
- Pre-1.0: the public API is not stable until `1.0.0`. Breaking changes are majors, and
  anything removed is deprecated first.

## Theme coverage

All 42 components render the 3 brands × 2 schemes matrix, so a contrast regression in
`green` or `dark` fails CI for every one of them. The grid, the cell lookup and the two
assertions every matrix repeats live in `.storybook/theme-matrix.tsx`; a new component
composes `ThemeMatrixGrid` and asserts what is brand- or scheme-dependent about itself
(see the `new-component` skill).

axe runs pinned to `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and
`best-practice`, with `target-size` (SC 2.5.8) enabled by hand — it is the only WCAG 2.2
rule axe-core 4.13 ships and it is off by default, so selecting the tag alone checks
nothing.

`Guides/Tokens` in `src/docs/tokens.stories.tsx` measures every documented
foreground/background pair in all six combinations by painting it to a one-pixel canvas
and computing the WCAG ratio. It is what makes a token edit safe: `tokens.css` used to
say "recompute before changing any colour" and nothing enforced it.

The matrix earns its keep: it has caught five real problems — a label inheriting the
host's text color inside `.dark`, a toolbar item overriding a composed button's
foreground at 3.26:1, `Tabs` styling a `data-selected` attribute Base UI never sets
(leaving the selected tab with no visible state at all), a duplicated `role="region"`
landmark under more than one `ToastProvider`, and the portal limitation below.

Control boundaries meet SC 1.4.11: `--ui-border-strong` measures between 3.08:1 and
3.52:1 against both `--ui-surface` and `--ui-canvas` in all six combinations, and the
story asserts it. `--ui-border` stays a soft hairline for what only groups or separates,
which 1.4.11 does not reach.

Portalled components resolve the theme of `<html>`, not of the `[data-theme]` / `.dark`
subtree their trigger sits in, because they render into `<body>`. Scoped theming works
in place; popups follow the document. Their matrices therefore audit the trigger in all
six combinations and leave the popup to the document theme. See the tokens rule and
`PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`.

## Engineering standards

- Every feature ships with its tests. Run `npm run lint` + `npm run typecheck` +
  `npm run test` before declaring work done; report real results.
- Handle errors explicitly at boundaries; never swallow exceptions or ignored error returns.
- No speculative abstractions: introduce a pattern only for a problem this repo has, and say
  which and why.
- Ambiguous request → ask targeted questions first. Requested approach wrong or beatable →
  say why and let the requester choose before proceeding.
