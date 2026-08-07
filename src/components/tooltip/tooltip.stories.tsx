import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

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
