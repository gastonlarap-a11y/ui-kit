---
"@galarap/ui": patch
---

Document every component.

Each component now carries a JSDoc description with a copyable `@example`, which lands
in the published `.d.ts` and therefore in editor tooltips, not just in the docs site.

The Storybook site gains a documentation page per component — props table with types and
descriptions, live example, and the usage snippet shown expanded. `@storybook/addon-docs`
was missing, which is why the `autodocs` tag had never generated anything.
