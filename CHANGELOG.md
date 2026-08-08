# @galarap/ui

## 0.3.0

### Minor Changes

- cac4b60: Add `AvatarGroup`, `ConfirmProvider` with `useConfirm`, and four props to components that
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

- cac4b60: Two contracts worth knowing before you use the new components, and one documented
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

- cac4b60: Add `DataTable`, `Pagination` and the `useDataTable` hook.

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

- cac4b60: Add the form batch: `Form`, `Fieldset` with `FieldsetLegend`, `CheckboxGroup`, `Slider`
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

- cac4b60: Add `AlertDialog`, `Drawer`, `Collapsible`, `Toolbar`, `ScrollArea` and `Meter`.

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

- cac4b60: Add `Combobox` and `Autocomplete`, the two typeahead controls.

  `Combobox` is the "select with a search box" the kit was missing. `Select` makes you scan
  a list; `Combobox` filters it as you type while keeping the listbox semantics, and still
  refuses anything that is not one of your items. `multiple` turns the input into removable
  chips, one per selection, with the text cursor after them.

  `Autocomplete` looks almost identical and answers a different question: there the typed
  text _is_ the value and the suggestions are only a shortcut. Use it for search boxes and
  for fields that accept anything but usually repeat. The short version — if a typo should
  be rejected, you want `Combobox`; if a typo is a valid answer, you want `Autocomplete`.

  Both bundle the portal, positioner, popup and list, so you compose the items and nothing
  else. The empty state is a prop rather than a child: Base UI renders it as a sibling of
  the list, and passing it as a child would put it inside, where it would be treated as an
  item.

  The render function's item is typed `never` instead of Base UI's `any`, so annotating it
  yourself — `{(fruit: Fruit) => …}` — keeps `any` out of the kit's public types entirely.

  Their shared styling lives in one internal module, because a user cannot tell which of the
  two a given field is and two controls that should look identical must not drift apart.

## 0.2.0

### Minor Changes

- b94cf26: Add the data and feedback components: `Avatar`, `Separator`, `Progress`, `Skeleton`,
  `Alert` and `Table`.

  `Avatar`, `Separator` and `Progress` compose Base UI primitives. The other three are plain
  markup, because the platform already carries the semantics: `Table` wraps the native table
  elements rather than reimplementing rows with divs, and `Skeleton` is a shape that stays
  out of the accessibility tree so the loading state is announced once by its container.

  `Alert` switches to `role="alert"` only for `warning` and `danger`; informational messages
  stay polite instead of interrupting a screen reader.

  This completes the catalogue: 24 components, each with a documentation page carrying its
  import line, props table and copyable example.

- 1ca7820: Add the form components: `Checkbox`, `RadioGroup` with `Radio`, `Switch`, `NumberField`,
  `Select` and `Textarea`.

  All but `Textarea` compose Base UI primitives, so the listbox semantics, roving focus,
  typeahead, numeric parsing and clamping come from a maintained implementation rather than
  from hand-rolled handlers. `Textarea` is a plain `<textarea>` — the platform already gets
  that one right.

  Each is designed to sit inside a `Field`, which supplies the label association and the
  `aria-invalid` wiring. The docs show that composition, and the accessibility tests fail
  the build on an unlabelled control.

  Icons are drawn inline: five paths did not justify an icon dependency.

- 6dd62d7: Add the overlay and navigation components: `Tooltip`, `Popover`, `DropdownMenu`, `Tabs`,
  `Accordion` and `Toast`.

  All compose Base UI primitives, so focus management, popup positioning, roving focus and
  typeahead come from a maintained implementation. Each bundles its portal and positioner,
  so composing one takes a trigger and its content and nothing else.

  `Toast` ships as `<ToastProvider>` plus a `useToast()` hook: mount the provider once in
  your layout and queue toasts from anywhere below it, including from a promise.

- 60fc435: Give the kit a visual identity of its own.

  **Surfaces now have depth.** `--ui-canvas` and `--ui-surface` used to be the same pure
  white, so a `Card` was distinguishable from the page only by a 1px border. The canvas now
  sits below the surface in lightness, and elevation tokens (`--ui-shadow-sm|md|lg`, exposed
  as `shadow-*`) are scheme-aware: on a dark surface a black shadow reads as nothing, so
  there the lift comes from the surface colour instead.

  **The neutrals carry a trace of the brand hue.** Backgrounds, borders and muted text are
  tinted toward blue, green or purple, so the palette reads as one system rather than grey
  with a coloured button in it.

  **Controls are 36px** instead of 40px, radii are slightly rounder, buttons give under the
  pointer, and there is a shared type scale with tighter tracking on the larger sizes. No
  font family is imposed — the kit still inherits the host application's.

  All 42 foreground/background pairs across the three brands and both schemes are verified
  against WCAG AA; the tightest is 4.85:1.

## 0.1.1

### Patch Changes

- c8caec0: Document every component.

  Each component now carries a JSDoc description with a copyable `@example`, which lands
  in the published `.d.ts` and therefore in editor tooltips, not just in the docs site.

  The Storybook site gains a documentation page per component — props table with types and
  descriptions, live example, and the usage snippet shown expanded. `@storybook/addon-docs`
  was missing, which is why the `autodocs` tag had never generated anything.

## 0.1.0

### Minor Changes

- fd6781c: Initial release.

  Six components built on Base UI — `Button`, `Badge`, `Card`, `Dialog`, `Field` and
  `Input` — with two independent theming axes (brand palette via `data-theme`, color
  scheme via `.dark`) driven entirely by CSS custom properties.

  The package is ESM-only, ships `"use client"` boundaries per component so it works
  inside React Server Components, and exposes its tokens both as an uncompiled
  `tokens.css` for Tailwind v4 consumers and as a precompiled `styles.css` for
  everyone else.
