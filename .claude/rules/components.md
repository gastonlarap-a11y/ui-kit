---
paths:
  - "src/components/**/*.tsx"
  - "src/lib/**/*.{ts,tsx}"
  - "src/index.ts"
---

# Component authoring

Every rule below holds for all 42 components today. Breaking one is a regression, not a
style preference.

- **`"use client"` if and only if the file imports `@base-ui/react` or holds state.**
  Presentational components (button, badge, card, alert, table, textarea, skeleton,
  pagination) stay server-renderable and must not get the banner; anything wrapping Base UI
  must, and so must anything calling `useState`/`useEffect` — a hook in `src/lib/` included.
  Receiving an `onClick` is not holding state: `Button` takes handlers and stays a server
  component, because the caller's own client boundary is what makes them work.
- **Every rendered element carries `data-slot="<component>-<part>"`** (the root is just
  `<component>`). It is the documented way consumers target parts from outside, so it is
  public API — do not drop or rename one without a changeset.
- **A control that can sit in a row takes `size: sm | md | lg`** — 32/36/44px, `md` the
  default, declared as a `tv()` variant in the component itself so Tailwind's scanner and
  Prettier's class sorter both see literal strings. `Guides/Sizing` measures the real boxes
  and fails if one drifts. Not every control qualifies: `Switch`'s thumb travel is
  hand-computed from its track, `NumberField`'s stepper is square only by coincidence with
  its group height, and `Checkbox`/`Radio` are sized against the text beside them. Giving
  those a `size` would mean recomputing geometry per step, not swapping a height.
  Watch the native `size` attribute: `<input size>` is a character width, so wrapping
  `ComponentProps` needs `Omit<…, "size">` or the variant is a type error.
- **Logical properties, not physical ones.** `ps-*`/`pe-*`, `ms-*`/`me-*`, `inset-s-*`/
  `inset-e-*`, `border-s`/`border-e`, `rounded-s-*`/`rounded-e-*`, `text-start`/`text-end`.
  Four things have no logical form and need an explicit `rtl:` variant instead — a
  `translate-x`, an entry animation that slides from an edge, a glyph that means
  previous/next, and `space-x-*` (which compiles to a physical margin). `Guides/Direction`
  asserts the swap; a `pr-*` slipping back in fails there.
- **`tv()` only when the component has real variants**, exported as `<name>Variants`
  alongside the component. Otherwise compose classes with `cn()` from `src/lib/cn.js`.
  A consumer's `className` must always win: it is the last argument to `tv()`/`cn()`.
- **`ref` is a plain prop, never `forwardRef`** (React 19). Declare `ref?: Ref<T>` only on
  components that render their own DOM element; Base UI wrappers inherit it through
  `ComponentProps<typeof Base.X>` and must not redeclare it.
- **Relative imports carry the `.js` extension.** `nodenext` enforces it, and it is what
  keeps the no-bundle output valid ESM.
- **Named exports only.** No `export default` outside Storybook files.
- **Every public export carries JSDoc with an `@example`** showing the real usage, plus any
  accessibility contract the consumer must honor (e.g. a `Dialog` always needs a
  `DialogTitle`).
- **An atom never imports another component.** The only allowed internal import is
  `src/lib/`. If two atoms need to share markup or classes, the shared piece moves to
  `src/lib/` (see `popup-classes.ts`, shared by `Combobox` and `Autocomplete`); otherwise
  the composition happens in the consuming story. This holds for 39 of the 42 components
  — assume you are writing an atom unless you decided otherwise on purpose.
- **A composite may compose atoms, and owes them a headless hook.** Its behaviour lives in
  `src/lib/<name>.ts` with no JSX and is exported from the barrel, so a consumer who wants
  different markup keeps the logic. `DataTable` + `useDataTable` is the exemplar; the
  Storybook categories (`Atoms`/`Molecules`) are a separate axis and do not track this.
- **Never impose color on a part that can be composed through `render`.** Base UI merges
  the wrapper's class string with the composed component's, `tailwind-merge` only sees the
  wrapper's, and the wrapper wins — a `danger` button inside a `Toolbar` ended up with the
  toolbar's foreground on its red background at 3.26:1. Either style nothing (as
  `DialogTrigger` does) or drop your own classes when `render` is present (as
  `ToolbarButton` does).
- Anything added under `src/` ships in the package: tsup builds every module there. Helpers
  that exist only for the docs belong in `.storybook/`.
- New or changed export → add it to `src/index.ts` and write a changeset.
