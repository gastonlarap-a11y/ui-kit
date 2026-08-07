import type { StorybookConfig } from "@storybook/react-vite";

/** Shape of the props `react-docgen-typescript` hands to `propFilter`. */
type DocgenProp = { parent?: { fileName: string } };

/**
 * The default `react-docgen` is faster but only reads simple TS constructs, and it does
 * not see ours at all: with it, `Button` reports only `ref` — `variant` and `size`, which
 * come from the mapped type `VariantProps<typeof buttonVariants>`, disappear entirely.
 * `react-docgen-typescript` invokes the TS compiler and extracts them with their literal
 * unions, at the cost of a slower build.
 */
const typescript = {
  reactDocgen: "react-docgen-typescript",
  reactDocgenTypescriptOptions: {
    shouldExtractLiteralValuesFromEnum: true,
    /**
     * Hides the ~250 HTML attributes inherited from @types/react, which would bury the
     * real API, while keeping Base UI's props (`open`, `onOpenChange`, `render`, ...) —
     * those *are* the component's API even though they live in node_modules.
     */
    propFilter: (prop: DocgenProp) =>
      prop.parent
        ? !/node_modules\/(?!@base-ui)/.test(prop.parent.fileName)
        : true,
  },
  /**
   * Cast because upstream types resolve `reactDocgenTypescriptOptions` to `undefined`
   * under our `nodenext` module resolution: it is declared as
   * `Parameters<typeof docgenTypescript>[0]`, and the plugin is CJS, so the default
   * import from Storybook's ESM `.d.ts` lands on the module namespace instead of the
   * callable signature. Storybook's types assume `bundler` resolution. The option is
   * correct and does take effect — verified in the built output, where `Button` reports
   * `variant` and `size` with their unions and no HTML attributes.
   */
  // Two-step through `unknown` because the upstream type is `undefined`, which does not
  // overlap with any object — TS rejects the direct assertion.
} as unknown as StorybookConfig["typescript"];

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)", "../src/**/*.mdx"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript,
};

export default config;
