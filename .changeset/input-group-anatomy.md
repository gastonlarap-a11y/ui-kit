---
"@galarap/ui": minor
---

Fix `Input`: a width on a clearable field put the clear button somewhere else.

`<Input className="w-56" onClear={…} />` narrowed the field to 224px while the wrapper the
button was positioned against stayed full width, so the button ended up at the edge of the
page. Every class involved was correct on its own; the bug was which element each one
landed on.

`Input` now renders a group around its field the way `Combobox` and `Autocomplete` already
do, and the group is what carries the border, height, background and the consumer's
`className`. The field inside is transparent and fills it, and the clear button is a flex
sibling rather than an absolutely positioned box — so it sits at the field's trailing edge
whatever the width, and follows the writing direction without a rule of its own.

Two things to know if you style `Input` from outside:

- **`className` reaches the group**, `[data-slot="input-wrapper"]`. That is where a width,
  a background or a radius now belongs. CSS aimed at `[data-slot="input"]` for the border
  needs to move; the field itself no longer draws one.
- **`className` is a plain string.** It used to accept Base UI's state function because it
  reached the `<input>`; the group is a `<div>` with no input state to react to.

`ClearButtonStaysWithTheField` asserts the geometry, since the failure was geometric and no
class assertion would have caught it.
