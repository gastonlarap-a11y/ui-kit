import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Field, FieldLabel } from "../field/field.js";
import { Input } from "../input/input.js";
import { Fieldset, FieldsetLegend } from "./fieldset.js";

const meta = {
  title: "Molecules/Fieldset",
  component: Fieldset,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Fieldset {...args} className="max-w-sm">
      <FieldsetLegend>Billing address</FieldsetLegend>
      <Field name="street">
        <FieldLabel>Street</FieldLabel>
        <Input placeholder="Calle Falsa 123" />
      </Field>
      <Field name="city">
        <FieldLabel>City</FieldLabel>
        <Input placeholder="Santiago" />
      </Field>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const LegendNamesTheGroup: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The whole point: the group carries a name a screen reader announces before
    // each control inside it.
    await expect(
      canvas.getByRole("group", { name: "Billing address" }),
    ).toBeInTheDocument();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const DisabledCascadesToControls: Story = {
  tags: ["!autodocs"],
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole("textbox");
    // A native `<fieldset disabled>` disables its controls without touching them.
    for (const input of inputs) await expect(input).toBeDisabled();
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, so axe checks the contrast of all six
 * combinations rather than the `blue`/`light` default alone.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { Fieldset, FieldsetLegend } from "@galarap/ui";',
          "",
          "<Fieldset>",
          "  <FieldsetLegend>Billing address</FieldsetLegend>",
          "</Fieldset>",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(["light", "dark"] as const).map((scheme) => (
        <div key={scheme} className={scheme === "dark" ? "dark" : undefined}>
          <div
            data-testid={`row-${scheme}`}
            className="flex flex-wrap gap-4 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand} className="w-40">
                <Fieldset>
                  <FieldsetLegend>{`${scheme} ${brand}`}</FieldsetLegend>
                  <Field name={`f-${scheme}-${brand}`}>
                    <FieldLabel>Street</FieldLabel>
                    <Input />
                  </Field>
                </Fieldset>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Legend and label read from the neutral tokens, which must flip with the scheme.
    await expect(
      getComputedStyle(canvas.getByText("light blue")).color,
    ).not.toBe(getComputedStyle(canvas.getByText("dark blue")).color);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
