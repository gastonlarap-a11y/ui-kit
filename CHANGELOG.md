# @galarap/ui

## 0.4.0

### Minor Changes

- 903824c: Give the kit a colour and motion system: four new tokens, and the accessibility fix that
  motivated them.

  **`border-strong` — the edge of a control.** Every input, textarea, checkbox, radio, switch
  track, select trigger, OTP box, number-field perimeter, typeahead input group and `outline`
  button drew its boundary with `--ui-border`, which measures **1.29:1** against
  `--ui-surface` in light and 1.38:1 in dark. WCAG 2.2 SC 1.4.11 asks 3:1 of anything that
  identifies a component, and here the border is the only thing that does the identifying:
  `--ui-surface` and `--ui-canvas` are 1.04:1 apart, so the fill of an input does not
  distinguish it from the page behind it. Those controls now use `--ui-border-strong`, which
  measures **3.08:1 to 3.52:1** against both backgrounds across all six brand/scheme
  combinations. The tightest pair is `dark`/`purple` on surface at 3.14:1.

  `--ui-border` is unchanged and stays where it belongs — separators, table rules, the card
  outline, popup edges, container borders. Darkening one token instead of adding a second
  would have hit `Separator`, which paints nothing else, and turned `NumberField` into a
  visible three-cell grid.

  **`surface-overlay` — a third elevation tier.** Dialogs, drawers, popovers, menus, select
  lists, toasts and the typeahead popups all reused `--ui-surface`, the same token as `Card`.
  In dark mode that made a popup exactly the colour of the card behind it, with a shadow that
  reads as almost nothing against a dark background. Portalled surfaces now sit one step
  lighter. In light mode both are white, as before, and the shadow does the separating.

  **`scrim` — the veil behind a modal.** `Dialog`, `AlertDialog` and `Drawer` hardcoded
  `bg-black/50`, the only raw colour left anywhere in the kit. It is now a token, tinted in
  light mode so the page dims into the palette, and denser in dark where a half-opaque veil
  barely registered.

  **`duration-fast|base|slow` — and `prefers-reduced-motion`.** The 150/200/300ms timings were
  spread by hand across forty files with no way to override them, so the kit ignored SC 2.3.3
  entirely. They are tokens now, consumed as `duration-(--ui-duration-base)`, and one media
  query collapses all three to `1ms` — one millisecond rather than zero, because Base UI
  unmounts a popup when its transition ends and a zero duration can skip that event. The full
  test suite passes under `prefers-reduced-motion: reduce`, dialogs and menus included.
  `ease-out` now applies to overlay transitions too, which previously used the browser
  default; that is the one motion change you will notice. `Skeleton` stops pulsing under
  reduced motion — `Button`'s spinner does not, because its movement is the state it reports.

  Every ratio above is measured in a real browser by `Guides/Tokens`, which paints each pair
  to a one-pixel canvas rather than trusting arithmetic — several accents sit outside the sRGB
  gamut, so a calculated ratio and a painted one can disagree.

- 903824c: Fix `Input`: a width on a clearable field put the clear button somewhere else.

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

- 903824c: Make the kit line up, and work right-to-left.

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

### Patch Changes

- 903824c: Fix `Tabs`: the selected tab had no visible state.

  It was styled on `data-selected`, which Base UI does not set on `Tabs.Tab` — the attribute
  is `data-active`. Both utilities that expressed selection therefore never matched, so the
  active tab rendered with a transparent underline and the same `--ui-fg-muted` ink as every
  other tab. `aria-selected` was correct throughout, which is exactly why it survived: a
  screen reader announced the right thing while nothing on screen agreed with it, and the
  existing tests asserted the attribute rather than what it looked like.

  `SelectedTabIsVisiblyDistinct` now asserts the underline is actually painted and that the
  ink steps up from muted, so the two signals cannot silently disappear again.

  Nothing else in the kit was affected: `data-pressed` on `Toggle`, `data-highlighted` on
  menu and select items, and `data-panel-open` on the accordion trigger were all checked
  against Base UI's API reference and are correct.

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
