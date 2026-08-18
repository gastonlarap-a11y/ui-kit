import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Button } from "../button/button.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip.js";

const meta = {
  title: "Molecules/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="ghost">Archive</Button>} />
      <TooltipContent>Moves the project out of your active list</TooltipContent>
    </Tooltip>
  ),
};

/**
 * The delay lives on the provider, not on the tooltip. Wrapping a group in one also
 * makes neighbouring tooltips skip the wait once the first has opened.
 */
export const NoDelay: Story = {
  render: (args) => (
    <TooltipProvider delay={0}>
      <Tooltip {...args}>
        <TooltipTrigger render={<Button variant="ghost">Duplicate</Button>} />
        <TooltipContent>Creates a copy in the same workspace</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const OpensOnKeyboardFocus: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <TooltipProvider delay={0}>
      <Tooltip {...args}>
        <TooltipTrigger render={<Button variant="ghost">Archive</Button>} />
        <TooltipContent>
          Moves the project out of your active list
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Archive",
    });

    // Focus, not just hover: a tooltip only reachable with a pointer is not a tooltip.
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    const hint = await within(document.body).findByText(
      "Moves the project out of your active list",
    );
    await waitFor(() => expect(hint).toBeVisible());
  },
};

/**
 * Triggers only, and deliberately so.
 *
 * `TooltipContent` is portalled to `<body>`, so it resolves the theme of `<html>` and
 * ignores the `[data-theme]` / `.dark` subtree its trigger sits in — opening six of them
 * here would audit the document theme six times over, not six different themes. The
 * limitation itself is asserted once, in `PortalledDialogFollowsTheDocumentTheme` in
 * `confirm.stories.tsx`; what this story covers is the half that *is* scopeable.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Tooltip>…</Tooltip>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <Tooltip {...args}>
          <TooltipTrigger render={<Button>{`${scheme} ${brand}`}</Button>} />
          <TooltipContent>{`Hint for ${scheme} ${brand}`}</TooltipContent>
        </Tooltip>
      )}
    </ThemeMatrixGrid>
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
