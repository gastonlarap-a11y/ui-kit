import { copyFileSync, mkdirSync } from "node:fs";

/**
 * `tokens.css` ships uncompiled on purpose: it carries `@theme` blocks that the
 * consumer's own Tailwind build has to process. Running it through the CLI here
 * would flatten it into plain CSS and break that.
 */
mkdirSync("dist", { recursive: true });
copyFileSync("src/styles/tokens.css", "dist/tokens.css");
