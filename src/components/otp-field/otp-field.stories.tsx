import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Field, FieldLabel } from "../field/field.js";
import { OtpField } from "./otp-field.js";

const meta = {
  title: "Molecules/OtpField",
  component: OtpField,
  args: { length: 6 },
  argTypes: {
    length: { description: "How many character boxes to render. Required." },
    separatorAfter: {
      description:
        "0-based indexes after which to draw a separator, e.g. `[2]` for a 3 + 3 group.",
    },
    validationType: {
      description:
        "What can be typed. Defaults to `numeric` here, since most codes are digits.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof OtpField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <OtpField {...args} />
    </Field>
  ),
};

export const Grouped: Story = {
  args: { separatorAfter: [2] },
  render: Default.render,
};

export const Masked: Story = {
  args: { mask: true, length: 4 },
  render: Default.render,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const TypingAdvancesAndBackspaceRetreats: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole("textbox");
    await expect(inputs).toHaveLength(6);

    inputs[0]?.focus();
    await userEvent.keyboard("123");

    // Focus follows the code forwards without any per-input wiring.
    await expect(inputs[3]).toHaveFocus();

    await userEvent.keyboard("{Backspace}{Backspace}");
    await expect(inputs[1]).toHaveFocus();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const OnlyTheFirstBoxTakesTheFieldName: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The rest announce their position instead of being six unnamed inputs.
    await expect(
      canvas.getByRole("textbox", { name: "Character 2 of 6" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("textbox", { name: "Verification code" }),
    ).toBeInTheDocument();
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
          'import { OtpField } from "@galarap/ui";',
          "",
          "<OtpField length={6} autoSubmit />",
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
              <div key={brand} data-theme={brand}>
                <Field name={`code-${scheme}-${brand}`}>
                  <FieldLabel>{`${scheme} ${brand}`}</FieldLabel>
                  <OtpField length={3} />
                </Field>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The boxes read their surface and border from the neutral tokens, which must
    // flip with the scheme.
    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );

    const lightBox = canvas.getByRole("textbox", { name: "light blue" });
    const darkBox = canvas.getByRole("textbox", { name: "dark blue" });
    await expect(getComputedStyle(lightBox).backgroundColor).not.toBe(
      getComputedStyle(darkBox).backgroundColor,
    );
  },
};
