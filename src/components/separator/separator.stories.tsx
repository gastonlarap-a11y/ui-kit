import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Separator } from "./separator.js";

const meta = {
  title: "Atoms/Separator",
  component: Separator,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-3 text-sm text-fg">
      <span>Project settings</span>
      <Separator {...args} />
      <span>Danger zone</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-6 items-center gap-3 text-sm text-fg">
      <span>Docs</span>
      <Separator {...args} orientation="vertical" />
      <span>Support</span>
      <Separator {...args} orientation="vertical" />
      <span>Status</span>
    </div>
  ),
};

export const ExposesSeparatorRole: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    // The grouping must be announced, not merely drawn.
    await expect(
      within(canvasElement).getByRole("separator"),
    ).toBeInTheDocument();
  },
};
