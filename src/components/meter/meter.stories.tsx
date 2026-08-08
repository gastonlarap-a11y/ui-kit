import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Meter } from "./meter.js";

const meta = {
  title: "Molecules/Meter",
  component: Meter,
  args: { label: "Storage used", value: 24, showValue: true },
  argTypes: {
    value: { description: "The measurement. Required." },
    format: {
      description:
        "`Intl.NumberFormat` options. This is how you get “12.4 GB” instead of “24”.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <Meter {...args} />
    </div>
  ),
};

export const Formatted: Story = {
  args: {
    label: "Storage used",
    value: 62,
    format: { style: "unit", unit: "gigabyte" },
  },
  render: Default.render,
};

export const NearlyFull: Story = {
  args: { label: "Seats used", value: 95 },
  render: Default.render,
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The role is the reason to pick `Meter` over `Progress`: a screen reader announces a
 * measurement, not a task that is going to finish.
 */
export const ExposesTheMeterRole: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole("meter", {
      name: "Storage used",
    });

    await expect(meter).toHaveAttribute("aria-valuenow", "24");
    await expect(meter).toHaveAttribute("aria-valuemin", "0");
    await expect(meter).toHaveAttribute("aria-valuemax", "100");
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
          'import { Meter } from "@galarap/ui";',
          "",
          '<Meter label="Storage used" showValue value={24} />',
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
              <div
                key={brand}
                data-theme={brand}
                data-testid={`${scheme}-${brand}`}
                className="w-40"
              >
                <Meter label={`${scheme} ${brand}`} value={60} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const accents = BRANDS.map(
      (brand) =>
        getComputedStyle(
          canvas
            .getByTestId(`light-${brand}`)
            .querySelector('[data-slot="meter-indicator"]') as HTMLElement,
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
