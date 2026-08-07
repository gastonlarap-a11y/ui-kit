import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Textarea } from "./textarea.js";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  args: { placeholder: "What changed?" },
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Release summary</span>
      <Textarea {...args} rows={4} />
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Release summary</span>
      <Textarea {...args} rows={4} disabled />
    </label>
  ),
};

export const AcceptsMultilineText: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByLabelText("Release summary");
    await userEvent.type(textarea, "First line{Enter}second line");
    await expect(textarea).toHaveValue("First line\nsecond line");
  },
};
