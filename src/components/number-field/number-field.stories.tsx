import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Field, FieldDescription, FieldLabel } from "../field/field.js";
import { NumberField } from "./number-field.js";

const meta = {
  title: "Molecules/NumberField",
  component: NumberField,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose it inside a `Field`. The input carries no label of its own, and an unlabelled
 * form control is unusable with a screen reader.
 */
export const Default: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="seats">
      <FieldLabel>Seats</FieldLabel>
      <NumberField {...args} defaultValue={1} min={1} max={20} />
    </Field>
  ),
};

/** `format` takes the options of `Intl.NumberFormat`. */
export const Currency: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="budget">
      <FieldLabel>Monthly budget</FieldLabel>
      <NumberField
        {...args}
        defaultValue={49}
        min={0}
        format={{ style: "currency", currency: "EUR" }}
      />
      <FieldDescription>Charged on the first of each month.</FieldDescription>
    </Field>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="seats" disabled>
      <FieldLabel>Seats</FieldLabel>
      <NumberField {...args} defaultValue={5} />
    </Field>
  ),
};

export const StepsAndClampsToMax: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Seats");
    const increment = canvas.getByLabelText(/increase/i);

    await expect(input).toHaveValue("1");
    await userEvent.click(increment);
    await expect(input).toHaveValue("2");

    // Typing past the maximum must be corrected, not accepted.
    await userEvent.clear(input);
    await userEvent.type(input, "99");
    await userEvent.tab();
    await expect(input).toHaveValue("20");
  },
};
