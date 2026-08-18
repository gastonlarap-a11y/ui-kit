---
paths:
  - "src/**/*.stories.tsx"
  - "src/**/*.mdx"
  - ".storybook/**/*.{ts,tsx}"
---

# Stories = tests + docs

There is no separate test suite. `npm run test` runs these files in a real Chromium through
`@storybook/addon-vitest`, and `a11y: { test: "error" }` turns every axe violation into a
failing test. A story is therefore three things at once: a usage example, an interaction
test and an accessibility audit.

- **`title` is `Atoms/<Name>` or `Molecules/<Name>`** for a component. `Guides` is for the
  pages that document the system rather than a component — the MDX pages and
  `Guides/Tokens`, which measures the palette. `storySort` in `.storybook/preview.tsx`
  depends on all three.
- **`satisfies Meta<typeof X>`**, never a bare annotation — it is what keeps `StoryObj`
  arg-typed. **CSF 3, not CSF Factories** — see the note at the end for why, and do not
  reopen it without new evidence.
- **Prop descriptions come from `variantArgType` / `classNameArgType`** in
  `.storybook/arg-types.js`. `react-docgen-typescript` cannot see variant props (they come
  from the mapped `VariantProps<…>`) and `className` is filtered out with the inherited HTML
  attributes, so both are described by hand or they are undocumented.
- **Write a `play` function** asserting the behaviour that matters. Skip it only for purely
  presentational components (today: badge, card).
- **Behaviour-only stories are tagged `tags: ["!autodocs"]`** so they stay out of the docs
  page. Anything without that tag is read as a usage example by a person deciding whether to
  install the package.
- **No spies in the shared `meta.args`.** A `fn()` there is serialised into every snippet as
  `onClick={function eY(){}}` and makes all of them uncopyable; stories that assert on a
  handler declare their own.
- **A `render` that documents nothing needs `parameters.docs.source.code`** with the snippet
  a consumer would actually write.
- **Assert on class tokens, not substrings.** `hover:bg-accent-hover` contains `bg-accent`,
  so a substring check passes for the wrong reason.
- **Every component ships a `ThemeMatrix` story**, built on `ThemeMatrixGrid` from
  `.storybook/theme-matrix.js` — never a hand-rolled grid, so all 42 audit the same six
  combinations. The helper gives you `cell-<scheme>-<brand>` and `row-<scheme>` test ids,
  `readPerBrand` to sample one computed colour across the three palettes, and
  `expectSchemesDiffer` / `expectBrandsDiffer`. Address a cell by name rather than counting
  positions in a flat `getAllByRole` result.
- **Assert what is actually brand- or scheme-dependent about the component.** `--ui-surface`
  is pure white in all three light palettes, so a card's background only varies in dark;
  its border varies in both. Picking the wrong one writes a test that cannot fail.
- **A portalled component's matrix audits its trigger, not its popup.** The popup renders
  into `<body>` and follows the theme of `<html>`, so six open popups would audit the
  document theme six times. `confirm.stories.tsx` is the exemplar.
- **Six copies of a landmark need six names.** An open `Accordion.Panel` is a
  `role="region"`, so its trigger text has to be unique across the whole matrix or axe
  reports `landmark-unique`. Components with a single fixed-name viewport (`ToastProvider`)
  are mounted once around the whole grid instead.

## CSF Factories stays out — measured, 2026-08-18

`npx storybook automigrate csf-factories` was run over all 45 files on Storybook 10.5.8 and
the result thrown away. What it produced:

- **45 broken imports.** The codemod writes `from "../../../.storybook/preview"` with no
  extension. `nodenext` rejects that (TS2835), and the extension rule is not a preference
  here — it is what keeps the `tsup --no-bundle` output valid ESM.
- **71 × TS2883**, and this one is structural. `export const X = meta.story({…})` infers
  the exported type instead of annotating it, so TS has to be able to _write that type
  down_ — and it transitively names Base UI internals like `PopoverHandle` from
  `@base-ui/react/popover/index.parts.mjs`, which no public path re-exports. "Not
  portable." Fixing it means either a `preview.type<…>()` on every file, which is more
  ceremony than the `satisfies` it replaced, or moving `declaration` out of the root
  tsconfig — changing how the whole repo is type-checked to accommodate a story format.
- **12 of 45 test files stopped importing**, taking 83 of 235 tests with them.
  `@storybook/addon-vitest` — the thing that runs the suite — was never added to
  `definePreview`, which is storybookjs/storybook#32626.

Against that: the format is still labelled a preview feature whose "API may change in
future releases", while CSF 3 is explicitly supported "for the foreseeable future" and is
not deprecated.

**Revisit when the docs stop calling it a preview feature.** Then re-run the migration and
check the three items above; the first is a `sed`, the second is the one that decides it.
