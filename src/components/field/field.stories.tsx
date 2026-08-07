import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Input } from "../input/input.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field.js";

const meta = {
  title: "Molecules/Field",
  component: Field,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Two conventions keep the docs snippets copyable.
 *
 * A story is either an example or a behaviour check, never both: combining `render` with
 * `play` serialises the whole story object into the snippet, test assertions included.
 * Examples keep `render`; checks carry `play` and are tagged `!autodocs`.
 *
 * And every `render` takes `args` and spreads them. Without that, Storybook cannot derive
 * the source dynamically and falls back to printing `{ render: () => … }` around the JSX.
 */

export const Default: Story = {
  render: (args) => (
    <Field {...args} className="max-w-sm" name="email">
      <FieldLabel>Work email</FieldLabel>
      <Input type="email" placeholder="you@company.com" />
      <FieldDescription>
        We only use this to send billing receipts.
      </FieldDescription>
    </Field>
  ),
};

export const WithValidation: Story = {
  render: (args) => (
    <Field
      {...args}
      className="max-w-sm"
      name="email"
      validationMode="onChange"
    >
      <FieldLabel>Work email</FieldLabel>
      <Input type="email" required placeholder="you@company.com" />
      <FieldError match="valueMissing">
        An email address is required.
      </FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Field {...args} className="max-w-sm" name="email" disabled>
      <FieldLabel>Work email</FieldLabel>
      <Input type="email" placeholder="you@company.com" />
      <FieldDescription>
        Managed by your workspace administrator.
      </FieldDescription>
    </Field>
  ),
};

export const AssociatesLabelAndDescription: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Work email");

    // The label/control association and the description wiring are what make this
    // usable with a screen reader, so assert them rather than trusting the markup.
    await expect(input).toHaveAccessibleDescription(
      "We only use this to send billing receipts.",
    );
  },
};

export const ReportsMissingValue: Story = {
  tags: ["!autodocs"],
  render: WithValidation.render,
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
