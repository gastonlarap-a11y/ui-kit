---
paths:
  - "src/**/*.stories.tsx"
  - "src/**/*.mdx"
  - ".storybook/**/*.{ts,tsx}"
---

# Stories = tests + docs

There is no separate test suite. `npm run test` runs these files in a real Chromium through
`@storybook/addon-vitest`, and `a11y: { test: "error" }` turns every axe violation into a
failing test. A story is therefore three things at once: a usage example, an interaction
test and an accessibility audit.

- **`title` is `Atoms/<Name>` or `Molecules/<Name>`.** Those are the only two categories
  (`Guides` is reserved for the MDX pages); `storySort` in `.storybook/preview.tsx` depends
  on it.
- **`satisfies Meta<typeof X>`**, never a bare annotation — it is what keeps `StoryObj`
  arg-typed.
- **Prop descriptions come from `variantArgType` / `classNameArgType`** in
  `.storybook/arg-types.js`. `react-docgen-typescript` cannot see variant props (they come
  from the mapped `VariantProps<…>`) and `className` is filtered out with the inherited HTML
  attributes, so both are described by hand or they are undocumented.
- **Write a `play` function** asserting the behaviour that matters. Skip it only for purely
  presentational components (today: badge, card).
- **Behaviour-only stories are tagged `tags: ["!autodocs"]`** so they stay out of the docs
  page. Anything without that tag is read as a usage example by a person deciding whether to
  install the package.
- **No spies in the shared `meta.args`.** A `fn()` there is serialised into every snippet as
  `onClick={function eY(){}}` and makes all of them uncopyable; stories that assert on a
  handler declare their own.
- **A `render` that documents nothing needs `parameters.docs.source.code`** with the snippet
  a consumer would actually write.
- **Assert on class tokens, not substrings.** `hover:bg-accent-hover` contains `bg-accent`,
  so a substring check passes for the wrong reason.
- New components ship a `ThemeMatrix` story — see `button.stories.tsx` for the exemplar and
  the `new-component` skill for why.
