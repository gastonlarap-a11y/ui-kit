import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge.js";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Active" },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "accent", "success", "warning", "danger", "outline"],
    },
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
