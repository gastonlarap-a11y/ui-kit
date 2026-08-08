---
"@galarap/ui": minor
---

Add the form batch: `Form`, `Fieldset` with `FieldsetLegend`, `CheckboxGroup`, `Slider`
with `SliderThumb`, `OtpField`, `Toggle` and `ToggleGroup`.

`Form` is the one that closes a real hole. `Field` already wired labels, descriptions and
`aria-invalid`, but it could only surface what the browser can validate — nothing carried
a server's answer back to the right control. `Form` takes an `errors` map of field name to
message and routes each one to its `FieldError`, and hands `onFormSubmit` the values
already parsed into an object.

`CheckboxGroup` brings the parent checkbox: list every child in `allValues`, mark one
`Checkbox` as `parent`, and the group maintains the indeterminate "some but not all" state
across every individual toggle — the part that is tedious to keep correct by hand.

`Slider` covers ranges by passing an array and one `SliderThumb` per value; thumbs clamp
against each other instead of swapping. `OtpField` gives one box per character with paste,
backspace and arrow keys behaving the way people expect from a code field, and names only
the first box after the field so a screen reader does not read six unrelated inputs.

`Toggle` exposes `aria-pressed` rather than `aria-checked`: it is an action you keep
switched on, not a value you submit. `ToggleGroup` makes a set of them a single tab stop
with arrow-key navigation, single-choice by default and `multiple` when several can be on
at once.

All seven wrap Base UI primitives, so the keyboard behaviour, focus management and ARIA
state come from a maintained implementation. Each ships a `ThemeMatrix` story, so axe
audits their contrast across all three brands in both schemes rather than in the default
theme alone.
