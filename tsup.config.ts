import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.stories.tsx",
    "!src/**/*.test.ts",
    "!src/**/*.test.tsx",
  ],
  format: ["esm"],
  /* No bundling on purpose: each source file is transpiled 1:1, so every component
     keeps its own "use client" banner and consumers get exact tree-shaking. */
  bundle: false,
  /* Declarations come from `tsc -p tsconfig.build.json`, which mirrors this 1:1 layout. */
  dts: false,
  outDir: "dist",
  target: "es2022",
  sourcemap: false,
  clean: false,
});
