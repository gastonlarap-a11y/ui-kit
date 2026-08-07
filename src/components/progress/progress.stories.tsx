import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Progress } from "./progress.js";

const meta = {
  title: "Molecules/Progress",
  component: Progress,
  // `value` is required by Base UI, so the meta has to supply one. Each story overrides it.
  args: { value: null },
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Progress {...args} label="Uploading" value={62} showValue />
    </div>
  ),
};

/** `value={null}` for work whose length is unknown, rather than faking a percentage. */
export const Indeterminate: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Progress {...args} label="Deploying" value={null} />
    </div>
  ),
};

export const ExposesValueToAssistiveTech: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", {
      name: "Uploading",
    });

    // The visual width means nothing on its own; these attributes are the real state.
    await expect(bar).toHaveAttribute("aria-valuenow", "62");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");
  },
};
