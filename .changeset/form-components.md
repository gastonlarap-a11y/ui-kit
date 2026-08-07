---
"@galarap/ui": minor
---

Add the form components: `Checkbox`, `RadioGroup` with `Radio`, `Switch`, `NumberField`,
`Select` and `Textarea`.

All but `Textarea` compose Base UI primitives, so the listbox semantics, roving focus,
typeahead, numeric parsing and clamping come from a maintained implementation rather than
from hand-rolled handlers. `Textarea` is a plain `<textarea>` — the platform already gets
that one right.

Each is designed to sit inside a `Field`, which supplies the label association and the
`aria-invalid` wiring. The docs show that composition, and the accessibility tests fail
the build on an unlabelled control.

Icons are drawn inline: five paths did not justify an icon dependency.
