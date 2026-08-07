---
"@galarap/ui": minor
---

Add the overlay and navigation components: `Tooltip`, `Popover`, `DropdownMenu`, `Tabs`,
`Accordion` and `Toast`.

All compose Base UI primitives, so focus management, popup positioning, roving focus and
typeahead come from a maintained implementation. Each bundles its portal and positioner,
so composing one takes a trigger and its content and nothing else.

`Toast` ships as `<ToastProvider>` plus a `useToast()` hook: mount the provider once in
your layout and queue toasts from anywhere below it, including from a promise.
