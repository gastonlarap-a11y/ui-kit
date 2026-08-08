import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Toggle } from "./toggle.js";

const meta = {
  title: "Atoms/Toggle",
  component: Toggle,
  args: {
    children: "B",
    "aria-label": "Bold",
  },
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const PressedStateIsExposed: Story = {
  tags: ["!autodocs"],
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Bold" });

    // `aria-pressed`, not `aria-checked`: this is an action kept on, not a form value.
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
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
          'import { Toggle } from "@galarap/ui";',
          "",
          '<Toggle aria-label="Bold" defaultPressed>B</Toggle>',
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
            className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand} className="flex gap-2">
                <Toggle aria-label={`${scheme} ${brand} on`} defaultPressed>
                  On
                </Toggle>
                <Toggle aria-label={`${scheme} ${brand} off`}>Off</Toggle>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // A pressed toggle paints itself with the brand accent.
    const accents = BRANDS.map(
      (brand) =>
        getComputedStyle(
          canvas.getByRole("button", { name: `light ${brand} on` }),
        ).backgroundColor,
    );
    await expect(new Set(accents).size).toBe(BRANDS.length);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
