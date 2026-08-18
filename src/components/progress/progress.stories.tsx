import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
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

/**
 * Filled bar on an unfilled track: `--ui-accent` over `--ui-muted`. The pair has to stay
 * separable in every brand, because the proportion between them is the entire message —
 * there is no text on the bar to fall back on.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Progress label="Uploading" value={62} showValue />',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand) => (
        <div className="w-40">
          <Progress {...args} label={brand} value={62} showValue />
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const partIn = (slot: string) => (cell: HTMLElement) => {
      const part = cell.querySelector(`[data-slot="progress-${slot}"]`);
      if (!part)
        throw new Error(`the matrix cell rendered no progress ${slot}`);
      return part;
    };

    await expectBrandsDiffer(
      readPerBrand(
        canvasElement,
        "light",
        partIn("indicator"),
        "backgroundColor",
      ),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", partIn("track"), "backgroundColor"),
    );

    // Fill and track must never resolve to the same colour: the bar would read as empty.
    for (const scheme of ["light", "dark"] as const) {
      const cell = within(canvasElement).getByTestId(`cell-${scheme}-blue`);
      await expect(
        getComputedStyle(partIn("indicator")(cell)).backgroundColor,
      ).not.toBe(getComputedStyle(partIn("track")(cell)).backgroundColor);
    }

    await expectSchemesDiffer(canvasElement);
  },
};
