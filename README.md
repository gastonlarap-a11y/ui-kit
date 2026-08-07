# @galarap/ui

Accessible React component library built on [Base UI](https://base-ui.com) and Tailwind CSS v4.

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

Every token declares both scheme values at once through `light-dark()`, so either axis
can also be scoped to a **subtree** instead of the whole document — a sidebar or a
preview pane can carry its own brand or its own color scheme:

```tsx
<div data-theme="purple" className="dark">
  <Button>Scoped to this subtree only</Button>
</div>
```

All six brand/scheme combinations are contrast-checked against WCAG AA on every test run.

## Development

```bash
npm run build          # tsup (no-bundle) + tsc declarations + Tailwind CLI
npm run test           # stories as interaction tests + axe, in a real browser
npm run storybook
npm run typecheck
npm run lint
npm run pack-check     # build, then validate the real tarball with publint + attw
npm run check:tarball  # assert nothing but dist/ ever ships
```

`pack-check` and `check:tarball` are the gates that matter: they pack the package exactly
as npm would, verify module and type resolution against that artifact, and fail if
anything beyond the intended files made it in.

## License

MIT © Gaston Lara
