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
- **Contrast is measured, not recomputed by hand.** `Guides/Tokens`
  (`src/docs/tokens.stories.tsx`) paints every documented pair in all six combinations and
  asserts its WCAG ratio, so a colour edit that drops one below the floor fails the run.
  Add the pair there when you add a token, and record the new tightest ratio in the
  changeset. Do not trust arithmetic over the measurement: several accents sit outside the
  sRGB gamut and the browser gamut-maps them, so a calculated ratio and a painted one can
  disagree.
- **Two border tokens, and the difference is not cosmetic.** `--ui-border-strong` is for
  the edge of the thing you click or type into, where SC 1.4.11 asks 3:1 — inputs,
  textareas, checkboxes, radios, the switch track, the select trigger, the OTP boxes, the
  number-field perimeter, the typeahead input group, the `outline` button.
  `--ui-border` is the hairline for what groups, separates or frames: separators, table
  rules, the card outline, popup edges, container borders, the number field's internal
  divider. Darkening the single token instead would have hit `Separator`, which paints
  nothing else, and turned the number field into a visible three-cell grid.
- **Elevation is scheme-aware, and has three tiers.** `--ui-canvas` < `--ui-surface` <
  `--ui-surface-overlay`. A black shadow is invisible on a dark surface, so there the lift
  comes from each tier being lighter than the one below; in light mode `surface` and
  `surface-overlay` are both white and the shadow does the work. Portalled popups use
  `bg-surface-overlay`, in-place surfaces use `bg-surface`.
- **Timings are tokens so reduced motion is one media query.** `--ui-duration-fast|base|slow`,
  consumed as `duration-(--ui-duration-base)` — Tailwind v4 has no `--duration-*` namespace,
  so there is no `duration-base` utility to reach for. Under
  `prefers-reduced-motion: reduce` all three collapse to **1ms, never 0**: Base UI unmounts
  a popup when its transition ends, and a zero duration can skip the event and strand it.
- **No font family, ever.** The kit inherits the host application's; shipping one would
  force every consumer to download it.
- `compiled.entry.css` is the precompiled fallback for non-Tailwind consumers. It must stay
  preflight-free — a component library does not reset its host's base styles.
