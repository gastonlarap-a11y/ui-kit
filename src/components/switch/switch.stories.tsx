import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
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

/**
 * Both states in all six combinations. The off state is the one to watch: the track is
 * `--ui-muted` inside a `--ui-border` hairline and the thumb is `--ui-surface`, so in
 * light mode three near-white neutrals have to stay distinguishable from each other.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Switch name="notifications" />',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <div className="flex flex-col gap-2 text-sm text-fg">
          <label className="flex items-center gap-3">
            <Switch {...args} name={`${scheme}-${brand}-off`} />
            <span>off</span>
          </label>
          <label className="flex items-center gap-3">
            <Switch {...args} defaultChecked name={`${scheme}-${brand}-on`} />
            <span>on</span>
          </label>
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const on = (cell: HTMLElement) =>
      within(cell).getByRole("switch", { name: "on" });
    const off = (cell: HTMLElement) =>
      within(cell).getByRole("switch", { name: "off" });

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", on, "backgroundColor"),
    );

    // The off track is brand-tinted too — `--ui-muted`, not a neutral grey.
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", off, "backgroundColor"),
    );

    await expectSchemesDiffer(canvasElement);
  },
};
