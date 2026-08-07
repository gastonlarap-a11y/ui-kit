import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { Decorator, Preview } from "@storybook/react-vite";
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import * as kit from "../src/index.js";
import { docsDark, docsLight } from "./theme.js";
import "./storybook.css";

/**
 * Read from the barrel itself, so the import line in the docs can never drift from
 * what the package actually exports.
 */
const PUBLIC_EXPORTS = new Set(Object.keys(kit));

/**
 * Every snippet is prefixed with the import it needs. Seeing `<Button>` tells you
 * nothing about where `Button` comes from, which is the first thing you need when
 * you have just installed the package.
 */
function withImportLine(code: string): string {
  // Storybook runs the transform more than once per snippet, so without this guard the
  // import line stacks up on itself.
  if (code.includes('from "@galarap/ui"')) return code;

  const used = new Set<string>();
  for (const [, name] of code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) {
    if (name && PUBLIC_EXPORTS.has(name)) used.add(name);
  }
  if (used.size === 0) return code;

  const names = [...used].sort().join(", ");
  return `import { ${names} } from "@galarap/ui";\n\n${code}`;
}

/**
 * Swaps the documentation chrome with the toolbar.
 *
 * `parameters.docs.theme` is read once and never reacts to globals
 * (storybookjs/storybook#26242), so following the toggle means replacing the container.
 *
 * The scheme is read from the `dark` class on `<html>` rather than from the addons
 * channel: the channel's `globalsUpdated` payload turned out to lag the toolbar by one
 * change, which rendered the docs in the opposite scheme. The class is written by the
 * decorator below, lives in this same document, and is what the components themselves
 * respond to — one source of truth instead of two that can disagree.
 */
function ThemedDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));

    // Also runs once on mount: the container renders before the decorator's effect has
    // written the class, so the first paint would otherwise use a stale scheme.
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <DocsContainer {...props} theme={isDark ? docsDark : docsLight} />;
}

/**
 * Theme attributes go on `<html>`, not on a wrapper element, because portalled
 * content (dialogs, popovers) is attached to `document.body` and would otherwise
 * render outside the themed subtree.
 */
function ThemedCanvas({
  theme,
  scheme,
  children,
}: {
  theme: string;
  scheme: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", scheme === "dark");
  }, [theme, scheme]);

  return <div className="min-h-24 bg-canvas p-6 text-fg">{children}</div>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemedCanvas
    theme={String(context.globals.theme)}
    scheme={String(context.globals.scheme)}
  >
    <Story />
  </ThemedCanvas>
);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Brand palette",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "blue", title: "Blue" },
          { value: "green", title: "Green" },
          { value: "purple", title: "Purple" },
        ],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: "Color scheme",
      toolbar: {
        title: "Scheme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "blue",
    scheme: "light",
  },
  parameters: {
    controls: { expanded: true },
    /* Any axe violation fails the Vitest run rather than just showing a warning. */
    a11y: { test: "error" },
    docs: {
      /* Show the usage snippet expanded instead of behind a "Show code" button —
         reading how to use a component should not need a click. */
      canvas: { sourceState: "shown" },
      source: { transform: withImportLine },
      container: ThemedDocsContainer,
    },
    options: {
      /* Guides before the component reference. */
      storySort: { order: ["Guides", "Atoms", "Molecules"] },
    },
  },
  decorators: [withTheme],
  tags: ["autodocs"],
};

export default preview;
