---
"@galarap/ui": minor
---

Add `AvatarGroup`, `ConfirmProvider` with `useConfirm`, and four props to components that
already shipped: `Button loading`, `Input onClear`, `Alert onDismiss` and
`Textarea autosize`.

Everything here is additive. No existing prop changes shape, meaning or default.

`Button loading` shows a spinner, sets `aria-busy` and makes the button inert so a second
click cannot fire the action twice. The label stays visible: replacing it with a spinner
loses what the button was going to do and resizes it under the pointer.

`Alert onDismiss` reports the intent and nothing else — the Alert never removes itself.
A component that unmounts itself makes "stay dismissed" impossible to implement, so the
decision belongs to whoever rendered it.

`Input onClear` is controlled-only by design: an uncontrolled input would need its own
state to know whether it is empty, and two sources of truth for one value is how a form
drifts out of sync with itself. The button is hidden rather than disabled when empty,
because an inert control is one more thing to skip past.

`Textarea autosize` uses CSS `field-sizing`, so there is no ref, no measuring and no
layout thrash per keystroke. It is a 2026 baseline feature: where it is missing the field
stays fixed-height and `rows` applies as usual.

`ConfirmProvider` turns "are you sure?" into one `await`. Mount it once, call
`useConfirm()` anywhere below, and get a promise that resolves to the answer. It builds on
`AlertDialog`, so the question cannot be clicked away, and every exit settles the promise
— Escape included, which resolves `false`. Asking a second question while one is open
resolves the first as declined rather than stranding its promise forever.

`useConfirmState` is exported on its own for building a different confirmation dialog on
the same semantics, following the `useDataTable` precedent.
