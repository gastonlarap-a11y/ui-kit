import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Skeleton } from "./skeleton.js";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-2" aria-busy>
      <Skeleton {...args} className="h-4 w-48" />
      <Skeleton {...args} className="h-4 w-32" />
    </div>
  ),
};

/** Match the shape of what will replace it, so the layout does not jump. */
export const CardPlaceholder: Story = {
  render: (args) => (
    <div className="flex max-w-sm items-center gap-3" aria-busy>
      <Skeleton {...args} className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton {...args} className="h-4 w-2/3" />
        <Skeleton {...args} className="h-3 w-1/3" />
      </div>
    </div>
  ),
};

export const IsHiddenFromAssistiveTech: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    // The loading state belongs on the container, announced once — not on each shape.
    const shapes = canvasElement.querySelectorAll('[data-slot="skeleton"]');
    await expect(shapes.length).toBe(2);
    for (const shape of shapes) {
      await expect(shape).toHaveAttribute("aria-hidden", "true");
    }
    await expect(
      within(canvasElement).queryByRole("status"),
    ).not.toBeInTheDocument();
  },
};

/**
 * A placeholder is a large, flat area of `--ui-muted`, which makes it the component
 * where a wrong neutral is most visible — and, being `aria-hidden`, the one no screen
 * reader would ever report. Six combinations in front of axe is the only check it gets.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Skeleton className="h-4 w-48" />',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand) => (
        <div className="flex w-32 flex-col gap-2" aria-busy>
          <span className="text-sm text-fg">{brand}</span>
          <Skeleton {...args} className="h-4 w-full" />
          <Skeleton {...args} className="h-4 w-2/3" />
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    // No role and no accessible name by design, so the shape is found by its slot.
    const shapeIn = (cell: HTMLElement) => {
      const shape = cell.querySelector('[data-slot="skeleton"]');
      if (!shape) throw new Error("the matrix cell rendered no skeleton");
      return shape;
    };

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", shapeIn, "backgroundColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", shapeIn, "backgroundColor"),
    );
    await expectSchemesDiffer(canvasElement);
  },
};
