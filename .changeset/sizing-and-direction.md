---
"@galarap/ui": minor
---

Make the kit line up, and work right-to-left.

**A shared size scale.** `Button` was the only component with a `size`, so anything that
had to match it did so by hand: `DataTable` wrote `className="h-8 w-20"` onto a
`SelectTrigger` to align it with the `size="sm"` buttons beside it, and `ToolbarButton`
measures `h-8` only because that happens to equal `Button` `sm`. `Input`, `Textarea`,
`SelectTrigger` and `Toggle` now take `size: "sm" | "md" | "lg"` — 32, 36 and 44 CSS
pixels, with `md` identical to what they rendered before. `Guides/Sizing` measures the real
boxes on every test run, so the next drift fails instead of being noticed later.

`Button` `sm` changes with it: its label goes from 12px to 14px, matching every other
control at that size. The most visible place is `Pagination`, whose page numbers get
bigger.

`Switch`, `NumberField`, `Checkbox`, `Radio` and `OtpField` deliberately do not take a
`size`. Their geometry is derived rather than declared — the switch thumb's travel is
computed from its track width, the number field's stepper is square only because it
matches its group's height — so a size step there means recomputing, not swapping.

Note for TypeScript: `<input size>` is a native attribute meaning a width in characters, so
`InputProps` omits it. Character width is a `className="w-*"` away and always was.

**Right-to-left.** The components now use logical CSS — `ps`/`pe`, `inset-s`/`inset-e`,
`border-s`/`border-e`, `text-start`/`text-end` — so they follow `dir` with no props of
their own. Four things have no logical form in CSS and carry an explicit `rtl:` variant
instead: the switch thumb's travel, the toast's entry slide, the pagination chevrons (which
mean previous and next, so they mirror) and the avatar stack's overlap.

This fixes a real bug: `DataTableColumn.align` has always been `"start" | "center" | "end"`,
but it resolved to `text-right`/`text-left`, so a column declared `align: "end"` landed on
the wrong side of a right-to-left table.

`Drawer` gains `side="start"` and `side="end"`, which follow the reading direction.
`side="left"` and `side="right"` keep meaning the physical edge of the screen — both are
useful and they are not the same request.

`Guides/Direction` renders the affected components in both directions and reads back what
the browser computed, so a physical utility slipping back in fails there.

**Smaller things.** Long menus scroll: `DropdownMenu` had no height cap, so a menu taller
than the viewport had no way to reach its last item. Every popup that scrolls now draws a
thin scrollbar in the kit's own neutrals instead of the platform's grey slab. `Checkbox`
and `Radio` keep their 20px box but grow a 24px pointer target, the size WCAG 2.2 SC 2.5.8
asks for — verified by clicking outside the visible box, since axe measures the element and
not its pseudo-elements. `DataTable`'s live row count and page-size options use tabular
figures, so the line stops twitching as you type in the search box.

`Select` and `DropdownMenu` now share the popup and row classes that `Combobox` and
`Autocomplete` already used; they had drifted into byte-for-byte copies of them. `Dialog`,
`Drawer`, `Popover`, `Toast` and `Tooltip` keep their own — their differences are real.
