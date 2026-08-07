import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

import { classNameArgType } from "../../../.storybook/arg-types.js";

const meta = {
  title: "Molecules/Card",
  component: Card,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>
          Generated on the first day of every month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-fg-muted">
          Includes usage totals, billing summary and outstanding invoices.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Download</Button>
        <Badge variant="success">Ready</Badge>
      </CardFooter>
    </Card>
  ),
};
