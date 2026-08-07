import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Input } from "../input/input.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field.js";

const meta = {
  title: "Molecules/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field className="max-w-sm" name="email">
      <FieldLabel>Work email</FieldLabel>
      <Input type="email" placeholder="you@company.com" />
      <FieldDescription>
        We only use this to send billing receipts.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Work email");

    // The label/control association and the description wiring are what make this
    // usable with a screen reader, so assert them rather than trusting the markup.
    await expect(input).toHaveAccessibleDescription(
      "We only use this to send billing receipts.",
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <Field className="max-w-sm" name="email" validationMode="onChange">
      <FieldLabel>Work email</FieldLabel>
      <Input type="email" required placeholder="you@company.com" />
      <FieldError match="valueMissing">
        An email address is required.
      </FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Work email");

    await userEvent.type(input, "a");
    await userEvent.clear(input);

    await expect(
      await canvas.findByText("An email address is required."),
    ).toBeVisible();
    await expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

export const Disabled: Story = {
  render: () => (
    <Field className="max-w-sm" name="email" disabled>
      <FieldLabel>Work email</FieldLabel>
      <Input type="email" placeholder="you@company.com" />
      <FieldDescription>
        Managed by your workspace administrator.
      </FieldDescription>
    </Field>
  ),
};
