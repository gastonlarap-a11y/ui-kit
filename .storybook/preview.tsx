import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";

import "./storybook.css";

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
  },
  decorators: [withTheme],
  tags: ["autodocs"],
};

export default preview;
