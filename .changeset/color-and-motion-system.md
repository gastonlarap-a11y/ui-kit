---
"@galarap/ui": minor
---

Give the kit a colour and motion system: four new tokens, and the accessibility fix that
motivated them.

**`border-strong` — the edge of a control.** Every input, textarea, checkbox, radio, switch
track, select trigger, OTP box, number-field perimeter, typeahead input group and `outline`
button drew its boundary with `--ui-border`, which measures **1.29:1** against
`--ui-surface` in light and 1.38:1 in dark. WCAG 2.2 SC 1.4.11 asks 3:1 of anything that
identifies a component, and here the border is the only thing that does the identifying:
`--ui-surface` and `--ui-canvas` are 1.04:1 apart, so the fill of an input does not
distinguish it from the page behind it. Those controls now use `--ui-border-strong`, which
measures **3.08:1 to 3.52:1** against both backgrounds across all six brand/scheme
combinations. The tightest pair is `dark`/`purple` on surface at 3.14:1.

`--ui-border` is unchanged and stays where it belongs — separators, table rules, the card
outline, popup edges, container borders. Darkening one token instead of adding a second
would have hit `Separator`, which paints nothing else, and turned `NumberField` into a
visible three-cell grid.

**`surface-overlay` — a third elevation tier.** Dialogs, drawers, popovers, menus, select
lists, toasts and the typeahead popups all reused `--ui-surface`, the same token as `Card`.
In dark mode that made a popup exactly the colour of the card behind it, with a shadow that
reads as almost nothing against a dark background. Portalled surfaces now sit one step
lighter. In light mode both are white, as before, and the shadow does the separating.

**`scrim` — the veil behind a modal.** `Dialog`, `AlertDialog` and `Drawer` hardcoded
`bg-black/50`, the only raw colour left anywhere in the kit. It is now a token, tinted in
light mode so the page dims into the palette, and denser in dark where a half-opaque veil
barely registered.

**`duration-fast|base|slow` — and `prefers-reduced-motion`.** The 150/200/300ms timings were
spread by hand across forty files with no way to override them, so the kit ignored SC 2.3.3
entirely. They are tokens now, consumed as `duration-(--ui-duration-base)`, and one media
query collapses all three to `1ms` — one millisecond rather than zero, because Base UI
unmounts a popup when its transition ends and a zero duration can skip that event. The full
test suite passes under `prefers-reduced-motion: reduce`, dialogs and menus included.
`ease-out` now applies to overlay transitions too, which previously used the browser
default; that is the one motion change you will notice. `Skeleton` stops pulsing under
reduced motion — `Button`'s spinner does not, because its movement is the state it reports.

Every ratio above is measured in a real browser by `Guides/Tokens`, which paints each pair
to a one-pixel canvas rather than trusting arithmetic — several accents sit outside the sRGB
gamut, so a calculated ratio and a painted one can disagree.
