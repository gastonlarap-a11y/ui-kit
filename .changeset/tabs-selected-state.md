---
"@galarap/ui": patch
---

Fix `Tabs`: the selected tab had no visible state.

It was styled on `data-selected`, which Base UI does not set on `Tabs.Tab` — the attribute
is `data-active`. Both utilities that expressed selection therefore never matched, so the
active tab rendered with a transparent underline and the same `--ui-fg-muted` ink as every
other tab. `aria-selected` was correct throughout, which is exactly why it survived: a
screen reader announced the right thing while nothing on screen agreed with it, and the
existing tests asserted the attribute rather than what it looked like.

`SelectedTabIsVisiblyDistinct` now asserts the underline is actually painted and that the
ink steps up from muted, so the two signals cannot silently disappear again.

Nothing else in the kit was affected: `data-pressed` on `Toggle`, `data-highlighted` on
menu and select items, and `data-panel-open` on the accordion trigger were all checked
against Base UI's API reference and are correct.
