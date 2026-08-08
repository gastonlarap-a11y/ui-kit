# @galarap/ui

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
