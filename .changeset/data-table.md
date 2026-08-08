---
"@galarap/ui": minor
---

Add `DataTable`, `Pagination` and the `useDataTable` hook.

Until now the kit shipped table primitives and nothing else: sorting, filtering, paging
and the row `map` were the consumer's to write, in every project, every time. `DataTable`
takes an array of column definitions instead, and handles ordering, a global search,
pagination, rows-per-page and row selection on top of the same primitives — which stay
public and unchanged.

A column is a plain object, not a component. `accessor` reduces a row to the scalar the
table sorts and searches by, so the ordering always agrees with what the reader sees;
`cell` takes over the rendering when a value is not enough. Keeping columns as data is
what lets you memoize them, generate them from configuration and get the types inferred.

Every piece of state is controllable, and `manualSorting` / `manualFiltering` /
`manualPagination` hand one stage back to you — that is how a server-paginated endpoint
is wired, with the component reporting intent instead of computing it.

`useDataTable` is exported on its own for the cases where the built-in layout is wrong:
it returns everything `DataTable` renders from, so you keep the behaviour and write your
own markup.

`Pagination` is usable by itself for lists and grids. Its disabled controls carry
`aria-disabled` rather than `disabled`, so a reader who tabs to "Next" and reaches the
last page keeps their place in the tab order instead of having focus thrown back to the
top of the document. Sorted columns are marked with `aria-sort` on the active header
only, and the row count sits in a live region so a search that narrows the table is
actually announced.

This is the first component in the kit that composes others. The architecture rule now
distinguishes atoms — which still never import another component, all 24 of them — from
composites, which may compose atoms but owe you their logic as a standalone hook.
