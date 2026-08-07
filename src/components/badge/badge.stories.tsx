import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  classNameArgType,
  variantArgType,
} from "../../../.storybook/arg-types.js";
import { Badge } from "./badge.js";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Active" },
  argTypes: {
    variant: variantArgType(
      ["neutral", "accent", "success", "warning", "danger", "outline"],
      "Intent of the label. `neutral` for plain metadata, `success`/`warning`/`danger` " +
        "for state, `accent` to tie it to the current brand, `outline` when the badge " +
        "sits on an already busy surface.",
    ),
    className: classNameArgType,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} variant="neutral">
        Neutral
      </Badge>
      <Badge {...args} variant="accent">
        Accent
      </Badge>
      <Badge {...args} variant="success">
        Success
      </Badge>
      <Badge {...args} variant="warning">
        Warning
      </Badge>
      <Badge {...args} variant="danger">
        Danger
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
    </div>
  ),
};
