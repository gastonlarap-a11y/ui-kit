import type { ArgTypes } from "@storybook/react-vite";

/**
 * Docs-only prop descriptions.
 *
 * Two kinds of props never get a description from `react-docgen-typescript`:
 * variant props, which come from the mapped type `VariantProps<typeof …>` and carry no
 * JSDoc to extract, and `className`, which is filtered out with the rest of the inherited
 * HTML attributes. Both are part of the real API, so they are described here instead.
 *
 * This file lives outside `src/` on purpose: tsup builds every `src/**` module, so a
 * docs-only helper in there would ship inside the published package.
 */

export const classNameArgType: ArgTypes[string] = {
  description:
    "Extra classes, merged with `tailwind-merge`. Conflicting utilities win over the " +
    'component\'s own defaults, so `className="bg-danger"` really does replace the ' +
    "background instead of fighting it in the cascade.",
  table: { type: { summary: "string" }, category: "Styling" },
  control: "text",
};

export const variantArgType = (
  options: readonly string[],
  description: string,
): ArgTypes[string] => ({
  description,
  options: [...options],
  control: "select",
  table: { type: { summary: options.map((o) => `"${o}"`).join(" | ") } },
});
