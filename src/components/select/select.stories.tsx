import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Field, FieldLabel } from "../field/field.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectTrigger,
} from "./select.js";

const meta = {
  title: "Molecules/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose it inside a `Field`. The trigger has no label of its own, and an unlabelled
 * combobox is unusable with a screen reader.
 */
export const Default: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="plan">
      <FieldLabel>Plan</FieldLabel>
      <Select {...args}>
        <SelectTrigger placeholder="Choose a plan" />
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

export const WithDefaultValue: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="plan">
      <FieldLabel>Plan</FieldLabel>
      <Select {...args} defaultValue="pro">
        <SelectTrigger placeholder="Choose a plan" />
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

/**
 * The trigger shows the raw value by default, so `value="pro"` displays as `pro`. Pass
 * `items` to map each value to the label you want shown — needed whenever the stored
 * value is an id or a code rather than something readable.
 */
export const WithLabels: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="plan">
      <FieldLabel>Plan</FieldLabel>
      <Select
        {...args}
        defaultValue="pro"
        items={{ free: "Free forever", pro: "Pro", enterprise: "Enterprise" }}
      >
        <SelectTrigger placeholder="Choose a plan" />
        <SelectContent>
          <SelectItem value="free">Free forever</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

export const Grouped: Story = {
  render: (args) => (
    <Field className="max-w-3xs" name="region">
      <FieldLabel>Region</FieldLabel>
      <Select {...args}>
        <SelectTrigger placeholder="Choose a region" />
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Europe</SelectGroupLabel>
            <SelectItem value="eu-west">Ireland</SelectItem>
            <SelectItem value="eu-central">Frankfurt</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectGroupLabel>Americas</SelectGroupLabel>
            <SelectItem value="us-east">Virginia</SelectItem>
            <SelectItem value="sa-east">Sao Paulo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
};

/**
 * The listbox renders in a portal on `document.body`, so these assertions query the
 * whole document rather than the story canvas.
 */
export const OpensAndSelects: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox");
    await userEvent.click(trigger);

    const listbox = await within(document.body).findByRole("listbox");
    await waitFor(() => expect(listbox).toBeVisible());

    await userEvent.click(within(listbox).getByRole("option", { name: "Pro" }));

    // Case-insensitive on purpose: without `items` the trigger shows the raw value
    // (`pro`), not the item's label. See the WithLabels story.
    await waitFor(() => expect(trigger).toHaveTextContent(/pro/i));
    // Focus must come back to the trigger, or keyboard users are stranded.
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
