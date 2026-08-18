import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Checkbox } from "./checkbox.js";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} name="terms" />
      <span>I accept the terms</span>
    </label>
  ),
};

export const Checked: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} defaultChecked name="newsletter" />
      <span>Send me product updates</span>
    </label>
  ),
};

/** For a parent checkbox whose children are only partly selected. */
export const Indeterminate: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} indeterminate name="all" />
      <span>Select all</span>
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm text-fg">
      <Checkbox {...args} disabled name="locked" />
      <span>Managed by your administrator</span>
    </label>
  ),
};

export const TogglesOnClickAndSpace: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox", {
      name: "I accept the terms",
    });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // The keyboard path matters as much as the pointer one.
    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The visible box is 20px, sized for the 14px text beside it. WCAG 2.2 SC 2.5.8 asks for
 * a 24px pointer target, so a pseudo-element extends the hit area without moving anything.
 *
 * axe cannot verify this: `target-size` measures the element's own box and knows nothing
 * about `::before`. So the assertion is the thing that actually matters — put the pointer
 * two pixels outside the visible box and check the control is what is under it.
 */
export const PointerTargetReachesTwentyFourPixels: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox", {
      name: "I accept the terms",
    });
    const box = checkbox.getBoundingClientRect();
    await expect(Math.round(box.width)).toBe(20);

    /* Past the visible edge on every side. A 24px target around a 20px box is a 2px
       band, so 1.5px is inside it and clear of the boundary, where hit testing is
       ambiguous by a rounding error. */
    const outside: Array<[string, number, number]> = [
      ["leading", box.left - 1.5, box.top + box.height / 2],
      ["trailing", box.right + 1.5, box.top + box.height / 2],
      ["above", box.left + box.width / 2, box.top - 1.5],
      ["below", box.left + box.width / 2, box.bottom + 1.5],
    ];

    for (const [edge, x, y] of outside) {
      const hit = document.elementFromPoint(x, y);
      await expect(
        `${edge}: ${hit === checkbox || checkbox.contains(hit) ? "checkbox" : "missed"}`,
      ).toBe(`${edge}: checkbox`);
    }
  },
};

/**
 * Both states in all six combinations. The unchecked box is the kit's strictest
 * non-text contrast case — a hairline border on a surface, with nothing else to
 * identify the control — and the checked one has to keep its tick legible on an accent
 * that changes with the brand.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Checkbox name="terms" />',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <div className="flex flex-col gap-2 text-sm text-fg">
          <label className="flex items-center gap-2">
            <Checkbox {...args} name={`${scheme}-${brand}-off`} />
            <span>off</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox {...args} defaultChecked name={`${scheme}-${brand}-on`} />
            <span>on</span>
          </label>
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const checked = (cell: HTMLElement) =>
      within(cell).getByRole("checkbox", { name: "on" });

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", checked, "backgroundColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", checked, "backgroundColor"),
    );
    await expectSchemesDiffer(canvasElement);
  },
};
