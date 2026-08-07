import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Only used by the development surfaces (Storybook and the Vitest browser runs).
 * The published package is built by tsup, not by Vite.
 */
export default defineConfig({
  plugins: [tailwindcss(), react()],
});
