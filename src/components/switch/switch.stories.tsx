import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Switch } from "./switch.js";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="flex items-center gap-3 text-sm text-fg">
      <Switch {...args} name="notifications" />
      <span>Email notifications</span>
    </label>
  ),
};

export const On: Story = {
  render: (args) => (
    <label className="flex items-center gap-3 text-sm text-fg">
      <Switch {...args} defaultChecked name="sync" />
      <span>Sync across devices</span>
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex items-center gap-3 text-sm text-fg">
      <Switch {...args} disabled name="beta" />
      <span>Beta features</span>
    </label>
  ),
};

export const TogglesAndExposesState: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("switch", {
      name: "Email notifications",
    });

    // The switch role and its checked state are what a screen reader announces.
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};
