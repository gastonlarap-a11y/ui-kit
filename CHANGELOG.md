# @galarap/ui

## 0.1.1

### Patch Changes

- c8caec0: Document every component.

  Each component now carries a JSDoc description with a copyable `@example`, which lands
  in the published `.d.ts` and therefore in editor tooltips, not just in the docs site.

  The Storybook site gains a documentation page per component — props table with types and
  descriptions, live example, and the usage snippet shown expanded. `@storybook/addon-docs`
  was missing, which is why the `autodocs` tag had never generated anything.

## 0.1.0

### Minor Changes

- fd6781c: Initial release.

  Six components built on Base UI — `Button`, `Badge`, `Card`, `Dialog`, `Field` and
  `Input` — with two independent theming axes (brand palette via `data-theme`, color
  scheme via `.dark`) driven entirely by CSS custom properties.

  The package is ESM-only, ships `"use client"` boundaries per component so it works
  inside React Server Components, and exposes its tokens both as an uncompiled
  `tokens.css` for Tailwind v4 consumers and as a precompiled `styles.css` for
  everyone else.
