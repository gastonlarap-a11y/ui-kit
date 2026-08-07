import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A URL that never resolves, so the fallback is what you see. */
export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://example.invalid/ada.jpg" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} className="size-8">
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar {...args} className="size-14">
        <AvatarFallback className="text-base">LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const FallsBackWhenTheImageFails: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    // A broken URL must leave initials, not an empty hole in the layout.
    await expect(await within(canvasElement).findByText("AL")).toBeVisible();
  },
};
