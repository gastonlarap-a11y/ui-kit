import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Radio, RadioGroup } from "./radio.js";

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} name="plan" defaultValue="pro">
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="free" />
        <span>Free</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="pro" />
        <span>Pro</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="enterprise" />
        <span>Enterprise</span>
      </label>
    </RadioGroup>
  ),
};

export const WithDisabledOption: Story = {
  render: (args) => (
    <RadioGroup {...args} name="tier" defaultValue="standard">
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="standard" />
        <span>Standard</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="priority" disabled />
        <span>Priority — not available on your plan</span>
      </label>
    </RadioGroup>
  ),
};

export const ArrowKeysMoveBetweenOptions: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pro = canvas.getByRole("radio", { name: "Pro" });
    await expect(pro).toBeChecked();

    // Roving focus is the whole point of a group: one tab stop, arrows to choose.
    pro.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      canvas.getByRole("radio", { name: "Enterprise" }),
    ).toBeChecked();
    await expect(pro).not.toBeChecked();
  },
};
