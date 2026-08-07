---
"@galarap/ui": minor
---

Add the data and feedback components: `Avatar`, `Separator`, `Progress`, `Skeleton`,
`Alert` and `Table`.

`Avatar`, `Separator` and `Progress` compose Base UI primitives. The other three are plain
markup, because the platform already carries the semantics: `Table` wraps the native table
elements rather than reimplementing rows with divs, and `Skeleton` is a shape that stays
out of the accessibility tree so the loading state is announced once by its container.

`Alert` switches to `role="alert"` only for `warning` and `danger`; informational messages
stay polite instead of interrupting a screen reader.

This completes the catalogue: 24 components, each with a documentation page carrying its
import line, props table and copyable example.
