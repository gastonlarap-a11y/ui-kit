---
"@galarap/ui": minor
---

Add `AlertDialog`, `Drawer`, `Collapsible`, `Toolbar`, `ScrollArea` and `Meter`.

`AlertDialog` is `Dialog` for decisions that cannot be undone. The difference is not
cosmetic: it carries the `alertdialog` role and cannot be dismissed by clicking the
backdrop, so the user has to answer rather than closing the question away.

`Drawer` is `Dialog` plus gestures — a panel that enters from an edge and can be swiped
shut, with the same focus trapping and Escape handling. `side` picks the edge; match
`swipeDirection` to it, or the sheet is dismissed in a direction it did not come from.
The grab handle is decorative, because the swipe is an enhancement and the close control
is what a keyboard or screen reader user reaches for.

`Collapsible` is the `Accordion` without the group: one section, no shared state.

`Toolbar` turns a row of controls into a single tab stop with arrow-key navigation, so
ten buttons cost one tab instead of ten. Its items drop the toolbar's own styling when
composed through `render`, so a `danger` button stays red — without that, the toolbar's
text color landed on the button's red background at 3.26:1 contrast.

`ScrollArea` draws consistent scrollbars without taking over scrolling itself; wheel,
touch, keyboard and scroll anchoring stay native.

`Meter` shows a measurement inside a range — disk used, seats taken. It is not `Progress`
with different styling: `Progress` says "this task is 60% done and will finish", `Meter`
says "60% of this capacity is in use", and a screen reader announces them differently.
