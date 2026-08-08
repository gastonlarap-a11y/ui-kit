import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Toggle } from "../toggle/toggle.js";
import { ToggleGroup } from "./toggle-group.js";

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  args: { "aria-label": "Text alignment" },
  argTypes: {
    multiple: {
      description:
        "Lets several toggles be on at once. The value is an array either way.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: ["left"] },
  render: (args) => (
    <ToggleGroup {...args}>
      <Toggle value="left" aria-label="Align left">
        ⌫
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        ⌦
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        ⌧
      </Toggle>
    </ToggleGroup>
  ),
};

/** With `multiple`, formatting options stack instead of replacing each other. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["bold"], "aria-label": "Formatting" },
  render: (args) => (
    <ToggleGroup {...args}>
      <Toggle value="bold" aria-label="Bold">
        B
      </Toggle>
      <Toggle value="italic" aria-label="Italic">
        I
      </Toggle>
      <Toggle value="underline" aria-label="Underline">
        U
      </Toggle>
    </ToggleGroup>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: ["left"] },
  render: (args) => (
    <ToggleGroup {...args}>
      <Toggle value="left" aria-label="Align left">
        ⌫
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        ⌦
      </Toggle>
    </ToggleGroup>
  ),
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const SingleChoiceReplacesTheSelection: Story = {
  tags: ["!autodocs"],
  args: { defaultValue: ["left"] },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole("button", { name: "Align left" });
    const center = canvas.getByRole("button", { name: "Align center" });

    await expect(left).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(center);
    await expect(center).toHaveAttribute("aria-pressed", "true");
    // The point of a single-choice group: the previous one turns itself off.
    await expect(left).toHaveAttribute("aria-pressed", "false");
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const GroupIsOneTabStop: Story = {
  tags: ["!autodocs"],
  args: { defaultValue: ["left"] },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole("button", { name: "Align left" });
    const center = canvas.getByRole("button", { name: "Align center" });

    await userEvent.tab();
    await expect(left).toHaveFocus();

    // Arrow keys move within the group, so the whole set costs a single tab.
    await userEvent.keyboard("{ArrowRight}");
    await expect(center).toHaveFocus();
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
          'import { ToggleGroup, Toggle } from "@galarap/ui";',
          "",
          '<ToggleGroup defaultValue={["left"]} aria-label="Text alignment">',
          '  <Toggle value="left" aria-label="Align left">…</Toggle>',
          "</ToggleGroup>",
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
              <div key={brand} data-theme={brand}>
                <ToggleGroup
                  aria-label={`${scheme} ${brand}`}
                  defaultValue={["on"]}
                >
                  <Toggle value="on" aria-label={`${scheme} ${brand} on`}>
                    On
                  </Toggle>
                  <Toggle value="off" aria-label={`${scheme} ${brand} off`}>
                    Off
                  </Toggle>
                </ToggleGroup>
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
