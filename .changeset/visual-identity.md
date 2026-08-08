---
"@galarap/ui": minor
---

Give the kit a visual identity of its own.

**Surfaces now have depth.** `--ui-canvas` and `--ui-surface` used to be the same pure
white, so a `Card` was distinguishable from the page only by a 1px border. The canvas now
sits below the surface in lightness, and elevation tokens (`--ui-shadow-sm|md|lg`, exposed
as `shadow-*`) are scheme-aware: on a dark surface a black shadow reads as nothing, so
there the lift comes from the surface colour instead.

**The neutrals carry a trace of the brand hue.** Backgrounds, borders and muted text are
tinted toward blue, green or purple, so the palette reads as one system rather than grey
with a coloured button in it.

**Controls are 36px** instead of 40px, radii are slightly rounder, buttons give under the
pointer, and there is a shared type scale with tighter tracking on the larger sizes. No
font family is imposed — the kit still inherits the host application's.

All 42 foreground/background pairs across the three brands and both schemes are verified
against WCAG AA; the tightest is 4.85:1.
