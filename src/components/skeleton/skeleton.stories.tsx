import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
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
