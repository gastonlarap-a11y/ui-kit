---
paths:
  - "src/styles/**"
---

# Design tokens

`tokens.css` ships verbatim as `@galarap/ui/tokens.css`. It is **not** compiled: the
consumer's own Tailwind build processes its `@theme` blocks, which is what exposes the
tokens as utilities inside the consuming app. Anything that assumes a build step here
breaks that.

- **`@theme inline` is load-bearing.** It keeps the utilities pointing at the custom
  properties instead of inlining their values at build time; without `inline`, runtime theme
  switching stops working.
- **The `var()` trap — this broke subtree dark mode once already.** A `var()` inside a
  custom property resolves on the element that _declares_ it, so
  `--ui-surface: oklch(0.98 0.004 var(--ui-hue))` written once on `:root` makes a nested
  `[data-theme]` inherit the already-resolved color and change nothing. That is why the file
  splits into scheme-only tokens (`:root` / `.dark`) and six brand × scheme blocks with
  literal values. The repetition is the price of correctness; do not "DRY it up".
- **Both axes must be scopeable to any subtree**, not just `<html>`. Neutrals live on
  `[data-theme]` blocks for the same reason the accents do — declaring them on `:root` alone
  leaves them light forever inside a nested `.dark`.
- **Portalled components are the exception, and it is not fixable in CSS.** `Dialog`,
  `AlertDialog`, `Drawer`, `Select`, `Combobox`, `Autocomplete`, `Popover`, `Tooltip`,
  `DropdownMenu` and `ConfirmProvider` render into `<body>`, so they resolve the theme of
  `<html>` and ignore the `[data-theme]` / `.dark` subtree their trigger sits in. Verified
  by `PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`. Scoped theming is
  for in-place components; an app that themes per subtree _and_ needs matching popups has
  to pass Base UI's `container` prop, which the kit does not surface today.
- **Recompute contrast before changing any color.** All 42 foreground/background pairs
  across three brands and both schemes are verified against WCAG AA; the tightest today is
  4.85:1. Record the new tightest ratio in the changeset.
- **Elevation is scheme-aware.** A black shadow is invisible on a dark surface, so there the
  lift comes from the surface being lighter than the canvas and the shadow only separates
  the layer.
- **No font family, ever.** The kit inherits the host application's; shipping one would
  force every consumer to download it.
- `compiled.entry.css` is the precompiled fallback for non-Tailwind consumers. It must stay
  preflight-free — a component library does not reset its host's base styles.
