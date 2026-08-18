import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Button } from "../button/button.js";
import { ToastProvider, useToast } from "./toast.js";

const meta = {
  title: "Molecules/Toast",
  component: ToastProvider,
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `useToast` only works below a `ToastProvider`, so the trigger lives in its own component. */
function SaveButton() {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Project saved",
          description: "All changes are live.",
        })
      }
    >
      Save project
    </Button>
  );
}

export const Default: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <SaveButton />
    </ToastProvider>
  ),
};

function PromiseButton() {
  const toast = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        void toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1200)),
          {
            loading: { title: "Deploying…" },
            success: {
              title: "Deployed",
              description: "Live in every region.",
            },
            error: { title: "Deploy failed" },
          },
        )
      }
    >
      Deploy
    </Button>
  );
}

/** One toast that follows a promise through loading, success and failure. */
export const FromAPromise: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <PromiseButton />
    </ToastProvider>
  ),
};

export const AnnouncesAndDismisses: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Save project" }),
    );

    const body = within(document.body);
    const toast = await body.findByText("Project saved");
    await waitFor(() => expect(toast).toBeVisible());

    // Base UI keeps the close button out of the accessibility tree until the stack is
    // expanded or the button itself has focus, so a screen reader is not read a dismiss
    // control for every toast that passes by. Hovering is part of the flow, not noise.
    await userEvent.hover(body.getByRole("dialog", { name: "Project saved" }));

    await userEvent.click(await body.findByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(body.queryByText("Project saved")).not.toBeInTheDocument(),
    );
  },
};

/**
 * Triggers only. A toast is rendered by its provider's viewport on `<body>`, so it
 * follows the theme of `<html>` rather than the subtree that raised it — the same
 * portal limitation `PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`
 * asserts for the whole kit.
 *
 * One provider wraps the whole matrix rather than one per cell, which is both how the
 * component is meant to be mounted and what keeps it valid: the viewport is a
 * `role="region"` landmark with a fixed name, so six providers would be six
 * indistinguishable landmarks and axe would rightly reject it.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <ToastProvider>{children}</ToastProvider>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ThemeMatrixGrid>
        {(brand, scheme) => <RaiseButton label={`${scheme} ${brand}`} />}
      </ThemeMatrixGrid>
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const triggerIn = (cell: HTMLElement) => within(cell).getByRole("button");

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", triggerIn, "backgroundColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", triggerIn, "backgroundColor"),
    );
    await expectSchemesDiffer(canvasElement);
  },
};

/** Raises a toast named after the theme it sits in. */
function RaiseButton({ label }: { label: string }) {
  const toast = useToast();
  return <Button onClick={() => toast.add({ title: label })}>{label}</Button>;
}
