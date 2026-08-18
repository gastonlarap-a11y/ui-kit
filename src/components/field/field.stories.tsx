import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
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

/**
 * A field is three type sizes and three inks stacked on one canvas: the label in
 * `--ui-fg`, the description in `--ui-fg-muted` at `text-xs`, and the error in
 * `--ui-danger`. The description is the tightest pair in the kit — small text on the
 * page background — so it is the one worth seeing in all six combinations.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Field name="email">…</Field>',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <div className="flex w-44 flex-col gap-3">
          <Field {...args} name={`${scheme}-${brand}`}>
            <FieldLabel>{`${scheme} ${brand}`}</FieldLabel>
            <Input placeholder="you@company.com" />
            <FieldDescription>Billing receipts only.</FieldDescription>
          </Field>
          {/*
           * `invalid` on the root is what drives `data-invalid:text-danger` on the
           * label. `FieldError` is left out: it renders from real `ValidityState`, not
           * from this prop, so it would need a submit to appear.
           */}
          <Field {...args} name={`${scheme}-${brand}-bad`} invalid>
            <FieldLabel>Invalid</FieldLabel>
            <Input defaultValue="not-an-email" />
          </Field>
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const descriptionIn = (cell: HTMLElement) => {
      const description = cell.querySelector('[data-slot="field-description"]');
      if (!description)
        throw new Error("the matrix cell rendered no description");
      return description;
    };

    // The muted ink is brand-tinted, so it must resolve differently in each palette.
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", descriptionIn, "color"),
    );

    // Label, description and invalid label are three deliberately different inks.
    for (const scheme of ["light", "dark"] as const) {
      const cell = within(canvasElement).getByTestId(`cell-${scheme}-blue`);
      const inks = [
        getComputedStyle(within(cell).getByText(`${scheme} blue`)).color,
        getComputedStyle(descriptionIn(cell)).color,
        getComputedStyle(within(cell).getByText("Invalid")).color,
      ];
      await expect(new Set(inks).size).toBe(3);
    }

    await expectSchemesDiffer(canvasElement);
  },
};
