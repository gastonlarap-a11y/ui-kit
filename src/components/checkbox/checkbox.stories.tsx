import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Checkbox } from "./checkbox.js";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} name="terms" />
      <span>I accept the terms</span>
    </label>
  ),
};

export const Checked: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} defaultChecked name="newsletter" />
      <span>Send me product updates</span>
    </label>
  ),
};

/** For a parent checkbox whose children are only partly selected. */
export const Indeterminate: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} indeterminate name="all" />
      <span>Select all</span>
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} disabled name="locked" />
      <span>Managed by your administrator</span>
    </label>
  ),
};

export const TogglesOnClickAndSpace: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox", {
      name: "I accept the terms",
    });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // The keyboard path matters as much as the pointer one.
    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};
