import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Textarea } from "./textarea.js";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  args: { placeholder: "What changed?" },
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Release summary</span>
      <Textarea {...args} rows={4} />
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Release summary</span>
      <Textarea {...args} rows={4} disabled />
    </label>
  ),
};

/**
 * Grows with its content. Done in CSS with `field-sizing`, so there is no measuring and
 * no layout thrash per keystroke — and where the browser lacks it, the field simply
 * stays fixed-height.
 */
export const Autosize: Story = {
  args: { autosize: true },
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Release summary</span>
      <Textarea {...args} placeholder="Grows as you type" />
    </label>
  ),
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const AutosizeGrowsWithContent: Story = {
  tags: ["!autodocs"],
  args: { autosize: true },
  render: Autosize.render,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByLabelText("Release summary");
    const before = textarea.getBoundingClientRect().height;

    await userEvent.type(textarea, "one{Enter}two{Enter}three{Enter}four");

    // Skipped where `field-sizing` is unsupported: there the fixed height is the
    // documented fallback, not a regression.
    if (CSS.supports("field-sizing", "content")) {
      await expect(textarea.getBoundingClientRect().height).toBeGreaterThan(
        before,
      );
    }
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
          'import { Textarea } from "@galarap/ui";',
          "",
          '<Textarea autosize placeholder="Grows as you type" />',
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
              <label
                key={brand}
                data-theme={brand}
                className="flex w-40 flex-col gap-1.5"
              >
                <span className="text-sm font-medium text-fg">{`${scheme} ${brand}`}</span>
                <Textarea autosize defaultValue="Some copy" />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      getComputedStyle(canvas.getByLabelText("light blue")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByLabelText("dark blue")).backgroundColor,
    );

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};

export const AcceptsMultilineText: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByLabelText("Release summary");
    await userEvent.type(textarea, "First line{Enter}second line");
    await expect(textarea).toHaveValue("First line\nsecond line");
  },
};
