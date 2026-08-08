import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Slider, SliderThumb } from "./slider.js";

const meta = {
  title: "Molecules/Slider",
  component: Slider,
  args: { label: "Volume", defaultValue: 40 },
  argTypes: {
    label: {
      description:
        "Shown above the track and used as the accessible name. A slider without one " +
        "tells a screen reader nothing about what it controls.",
    },
    showValue: { description: "Renders the current value next to the label." },
    className: classNameArgType,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <Slider {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: { showValue: true },
  render: Default.render,
};

export const Stepped: Story = {
  args: {
    label: "Rating",
    min: 0,
    max: 5,
    step: 1,
    defaultValue: 3,
    showValue: true,
  },
  render: Default.render,
};

/** Two thumbs over one track. Each needs its own `index` and accessible name. */
export const Range: Story = {
  args: { label: "Price", defaultValue: [20, 80], showValue: true },
  render: (args) => (
    <div className="w-72">
      <Slider {...args}>
        <SliderThumb index={0} aria-label="Minimum price" />
        <SliderThumb index={1} aria-label="Maximum price" />
      </Slider>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const KeyboardSteps: Story = {
  tags: ["!autodocs"],
  args: { showValue: true },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider");

    await expect(slider).toHaveAttribute("aria-valuenow", "40");

    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "41");

    // Home and End are part of the pattern, not a nicety.
    await userEvent.keyboard("{Home}");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
    await userEvent.keyboard("{End}");
    await expect(slider).toHaveAttribute("aria-valuenow", "100");
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const RangeThumbsDoNotCross: Story = {
  tags: ["!autodocs"],
  args: { label: "Price", defaultValue: [20, 22] },
  render: Range.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const min = canvas.getByRole("slider", { name: "Minimum price" });

    min.focus();
    // Pushing the lower thumb past the upper one must clamp, not swap.
    await userEvent.keyboard(
      "{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}",
    );

    const lower = Number(min.getAttribute("aria-valuenow"));
    const upper = Number(
      canvas
        .getByRole("slider", { name: "Maximum price" })
        .getAttribute("aria-valuenow"),
    );
    await expect(lower).toBeLessThanOrEqual(upper);
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
          'import { Slider } from "@galarap/ui";',
          "",
          '<Slider label="Volume" showValue defaultValue={40} />',
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
                <Slider label={`${scheme} ${brand}`} defaultValue={60} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    /* Read the indicator through its `data-slot`, not through `getByRole("slider")`:
       that role belongs to Base UI's inner input, which carries no accent of its own. */
    const accents = BRANDS.map((brand) => {
      const indicator = canvas
        .getByTestId(`light-${brand}`)
        .querySelector('[data-slot="slider-indicator"]');
      return getComputedStyle(indicator as HTMLElement).backgroundColor;
    });
    await expect(new Set(accents).size).toBe(BRANDS.length);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
