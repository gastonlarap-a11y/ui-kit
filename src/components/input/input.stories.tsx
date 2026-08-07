import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Input } from "./input.js";

import { classNameArgType } from "../../../.storybook/arg-types.js";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: { placeholder: "you@company.com" },
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Work email</span>
      <Input {...args} />
    </label>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Work email");
    await userEvent.type(input, "ada@example.com");
    await expect(input).toHaveValue("ada@example.com");
  },
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Work email</span>
      <Input {...args} disabled />
    </label>
  ),
};
