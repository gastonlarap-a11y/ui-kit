# @galarap/ui

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
