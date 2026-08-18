import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Radio, RadioGroup } from "./radio.js";

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} name="plan" defaultValue="pro">
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="free" />
        <span>Free</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="pro" />
        <span>Pro</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="enterprise" />
        <span>Enterprise</span>
      </label>
    </RadioGroup>
  ),
};

export const WithDisabledOption: Story = {
  render: (args) => (
    <RadioGroup {...args} name="tier" defaultValue="standard">
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="standard" />
        <span>Standard</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-fg">
        <Radio value="priority" disabled />
        <span>Priority — not available on your plan</span>
      </label>
    </RadioGroup>
  ),
};

export const ArrowKeysMoveBetweenOptions: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pro = canvas.getByRole("radio", { name: "Pro" });
    await expect(pro).toBeChecked();

    // Roving focus is the whole point of a group: one tab stop, arrows to choose.
    pro.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      canvas.getByRole("radio", { name: "Enterprise" }),
    ).toBeChecked();
    await expect(pro).not.toBeChecked();
  },
};

/**
 * The selected radio is the only place `--ui-accent-fg` is painted as a shape rather
 * than as text: the inner dot is `bg-accent-fg` on `bg-accent`. If that pair ever
 * collapses the control still looks checked to a sighted user at a glance, so nothing
 * short of comparing the two computed colours catches it.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <RadioGroup name="plan" defaultValue="pro">…</RadioGroup>',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <RadioGroup {...args} name={`${scheme}-${brand}`} defaultValue="on">
          <label className="flex items-center gap-2 text-sm text-fg">
            <Radio value="on" />
            <span>on</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-fg">
            <Radio value="off" />
            <span>off</span>
          </label>
        </RadioGroup>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const selected = (cell: HTMLElement) =>
      within(cell).getByRole("radio", { name: "on" });

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", selected, "backgroundColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", selected, "backgroundColor"),
    );

    // The dot must stay a different colour from the fill it sits on.
    for (const scheme of ["light", "dark"] as const) {
      const radio = selected(
        within(canvasElement).getByTestId(`cell-${scheme}-blue`),
      );
      const dot = radio.querySelector('[data-slot="radio-indicator"]');
      if (!dot) throw new Error("the selected radio rendered no indicator");
      await expect(getComputedStyle(dot).backgroundColor).not.toBe(
        getComputedStyle(radio).backgroundColor,
      );
    }

    await expectSchemesDiffer(canvasElement);
  },
};
