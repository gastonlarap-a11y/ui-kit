# @galarap/ui

Accessible React component library built on [Base UI](https://base-ui.com) and Tailwind CSS v4.

**[Browse the components →](https://gastonlarap-a11y.github.io/ui-kit/)**

- **ESM-only**, tree-shakeable, ships `"use client"` boundaries intact for React Server Components.
- **Two theming axes**: brand palette (`data-theme`) and color scheme (light / dark), independent of each other.
- **Accessibility is tested, not claimed** — every component is audited with axe on each story.

> Status: pre-release. The public API is not stable until `1.0.0`.

## Install

```bash
npm install @galarap/ui
```

Requires React 19.

## Usage

### With Tailwind CSS v4 (recommended)

Import the tokens and point Tailwind at the package, so your own build emits only the
utilities you actually render — no duplicated CSS, and your `className` overrides win naturally.

```css
/* app/globals.css */
@import "tailwindcss";
@import "@galarap/ui/tokens.css";
@source "../node_modules/@galarap/ui/dist";
```

### Without Tailwind

Import the precompiled stylesheet instead. It ships without preflight, so it will not
reset your application's base styles.

```ts
import "@galarap/ui/styles.css";
```

### Rendering a component

```tsx
import { Button } from "@galarap/ui";

export function Example() {
  return <Button className="w-full">Save</Button>;
}
```

## Theming

Both axes are plain HTML attributes, so they work in Server Components:

```html
<html data-theme="green" class="dark"></html>
```

| Attribute      | Values                                      |
| -------------- | ------------------------------------------- |
| `data-theme`   | `blue` (default), `green`, `purple`         |
| `class="dark"` | opts the subtree into the dark color scheme |

Either axis can also be scoped to a **subtree** instead of the whole document, so a
sidebar or a preview pane can carry its own brand or its own color scheme:

```tsx
<div className="dark">
  <div data-theme="purple">
    <Button>Scoped to this subtree only</Button>
  </div>
</div>
```

Put `data-theme` on the `.dark` element or anywhere inside it — that is the nesting
the tokens are written for.

One caveat worth knowing before you rely on it: components that render in a portal —
`Dialog`, `AlertDialog`, `Drawer`, `Select`, `Combobox`, `Autocomplete`, `Popover`,
`Tooltip`, `DropdownMenu` and `ConfirmProvider` — are attached to `<body>`, so they
resolve the theme on `<html>` rather than the subtree their trigger sits in. Scoped
theming applies to in-place components; popups follow the document.

23 of the 42 components are rendered in all six brand/scheme combinations on every test
run, so a contrast regression in any of them fails CI. The rest are audited with axe in
the default `blue` / light theme.

## Development

Requires Node 24 (see `.nvmrc`); the published package supports Node ≥ 20.19.

```bash
npm ci
```

```bash
npm run build           # tsup (no-bundle) + tsc declarations + Tailwind CLI
npm run test            # stories as interaction tests + axe, in a real browser
npm run storybook       # docs site on :6006
npm run build-storybook # what the Pages deployment publishes
npm run typecheck
npm run lint
npm run format          # prettier, incl. Tailwind class sorting inside tv() and cn()
npm run changeset       # required for any change under src/
npm run pack-check      # build, then validate the real tarball with publint + attw
npm run check:tarball   # assert nothing but dist/ ever ships
```

### Project structure

- `src/components/<name>/` — component, its stories and a one-line barrel
- `src/lib/` — internal helpers; only `cn` is public
- `src/styles/tokens.css` — the public token entrypoint, shipped uncompiled
- `.storybook/` — docs-only helpers, kept out of `src/` so they never ship

`pack-check` and `check:tarball` are the gates that matter: they pack the package exactly
as npm would, verify module and type resolution against that artifact, and fail if
anything beyond the intended files made it in.

## License

MIT © Gaston Lara
