import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "storybook-static/**", "coverage/**"] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  /* v7 still exposes the eslintrc-shaped configs at the root; the flat ones live under `.flat`. */
  reactHooks.configs.flat["recommended-latest"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,mjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    /* Build scripts run in Node, not in the browser. */
    files: ["scripts/**/*.mjs", "*.config.{ts,mjs}"],
    languageOptions: {
      globals: globals.nodeBuiltin,
    },
  },
);
