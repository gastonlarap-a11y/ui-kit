---
name: new-component
description: Scaffold a new component under src/components/ following the button (own DOM) or dialog (Base UI wrapper) exemplar. Use when adding a component to the kit.
argument-hint: "<component-name>"
---

# New component

## 1. Settle the public API first

Everything below derives from it, so decide before writing anything:

- The parts: one element, or a compound (`X`, `XTrigger`, `XContent`, …)?
- The variants, if any, and their default.
- The accessibility contract the consumer must honor (e.g. `Dialog` needs a `DialogTitle`
  because that becomes its accessible name). It goes in the JSDoc.

## 2. Pick the shape — this decides everything mechanical

|                | Base UI wrapper                    | Own DOM element                        |
| -------------- | ---------------------------------- | -------------------------------------- |
| Exemplar       | `src/components/dialog/dialog.tsx` | `src/components/button/button.tsx`     |
| `"use client"` | **required**                       | **must not** be added                  |
| Props          | `ComponentProps<typeof Base.X>`    | own interface + `ref?: Ref<T>`         |
| Classes        | `cn()`                             | `tv()` if it has variants, else `cn()` |

The rule is mechanical: `"use client"` if and only if the file imports `@base-ui/react`
**or holds state**. Base UI wrappers inherit `ref` through `ComponentProps` — never
redeclare it there.

Composing other components is a third shape — a composite, like `DataTable`. It needs a
headless hook in `src/lib/` exported alongside it. Do not reach for it by default; see
the composite rule in `.claude/rules/components.md`.

## 3. Create the directory

`src/components/<name>/` with exactly three files, mirroring the exemplar:

- `<name>.tsx` — the component. Every rendered element gets `data-slot="<name>-<part>"`
  (the root is just `<name>`). Every export carries JSDoc with an `@example`.
- `<name>.stories.tsx` — see step 4.
- `index.ts` — one line re-exporting the component, its variants object if any, and its
  prop types.

Relative imports carry the `.js` extension.

## 4. Write the stories — they are the tests

Copy the structure from `src/components/button/button.stories.tsx`:

- `title: "Atoms/<Name>"` or `"Molecules/<Name>"`; `satisfies Meta<typeof X>`.
- Describe variant props and `className` with `variantArgType` / `classNameArgType` from
  `.storybook/arg-types.js` — docgen cannot see either.
- A `play` function per behaviour worth guaranteeing. Behaviour-only stories get
  `tags: ["!autodocs"]`.
- **A `ThemeMatrix` story.** Copy Button's: it renders the three brands in both schemes so
  axe checks all six combinations. Without it the component is only contrast-audited in
  `blue`/`light`, which is the gap recorded in AGENTS.md — do not add to it.

## 5. Register it (magnet file)

Add the export block to `src/index.ts`, alphabetically, listing the component, its variants
object and its prop types.

## 6. Changeset

`src/**` changed, so write a `.changeset/<slug>.md` by hand — `minor` for a new component.
Follow the prose style of the existing ones: what changed and why it matters to a consumer,
not a commit log.

## 7. Verify

```bash
npm run lint && npm run typecheck && npm run test && npm run format:check
```

Report the real results.
