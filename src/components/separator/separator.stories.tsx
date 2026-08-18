import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
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

/**
 * `--ui-border` is the kit's quietest token and the easiest to get wrong: it is the only
 * thing a `Separator` paints, so if the border ever stops being brand-tinted or stops
 * flipping with the scheme, this story is the only place that notices.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Separator />",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand) => (
        <div className="flex w-28 flex-col gap-2 text-sm text-fg">
          <span>{brand}</span>
          <Separator {...args} />
          <span className="text-fg-muted">divided</span>
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const separatorIn = (cell: HTMLElement) =>
      within(cell).getByRole("separator");

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", separatorIn, "backgroundColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", separatorIn, "backgroundColor"),
    );
    await expectSchemesDiffer(canvasElement);
  },
};
