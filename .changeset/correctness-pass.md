---
"@galarap/ui": minor
---

Two contracts worth knowing before you use the new components, and one documented
limitation.

**`getRowId` receives an index that is absolute across the filtered set**, not the row's
position within the page. That is what makes the common fallback
`getRowId={(row, i) => i}` safe: a per-page index would give page 2 the same ids as page
1, leaking selection between pages. `DataTableRow.index` and `cell(row, index)` follow
the same rule, so a row label says which row it actually is.

**`Input`'s `onClear` requires `value`**, enforced by the type. The component reads
`value` to decide whether there is anything to clear, so an uncontrolled input would
render a button that never appears. It is a compile error rather than a mystery.

**Portalled components resolve the document's theme, not their subtree's.** `Dialog`,
`AlertDialog`, `Drawer`, `Select`, `Combobox`, `Autocomplete`, `Popover`, `Tooltip`,
`DropdownMenu` and `ConfirmProvider` render into `<body>`, so a `[data-theme]` or `.dark`
wrapper around the trigger does not reach the popup. Scoped theming applies to in-place
components; popups follow `<html>`. This is a limitation of portals, not a bug being
fixed — it is documented here because nothing said so before.

`Alert`, `Avatar`, `Input`, `Textarea` and `ConfirmProvider` also gain the three-brand,
two-scheme matrix story, bringing contrast auditing to 23 of the 42 components.
