import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import {
  classNameArgType,
  variantArgType,
} from "../../../.storybook/arg-types.js";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  argTypes: {
    variant: variantArgType(
      ["info", "success", "warning", "danger"],
      'Severity. `warning` and `danger` also switch the element to `role="alert"`, ' +
        "which interrupts a screen reader; `info` and `success` stay polite.",
    ),
    className: classNameArgType,
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The dashboard will be read-only on Sunday from 02:00 UTC.
      </AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert {...args} variant="info">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          A new version of the CLI is available.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="success">
        <AlertTitle>Deployed</AlertTitle>
        <AlertDescription>
          Your changes are live in every region.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="warning">
        <AlertTitle>Approaching your limit</AlertTitle>
        <AlertDescription>
          You have used 90% of this month&apos;s build minutes.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="danger">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your card was declined. Try another one.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const SeverityChangesTheRole: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args} variant="info">
        <AlertTitle>Informational</AlertTitle>
      </Alert>
      <Alert {...args} variant="danger">
        <AlertTitle>Destructive</AlertTitle>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Only the severe one may interrupt; the rest would talk over the user.
    await expect(canvas.getByRole("status")).toHaveTextContent("Informational");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Destructive");
  },
};
