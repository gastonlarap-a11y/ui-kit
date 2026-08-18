import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "./accordion.js";

const meta = {
  title: "Molecules/Accordion",
  component: Accordion,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} className="max-w-md">
      <AccordionItem value="billing">
        <AccordionTrigger>How is billing calculated?</AccordionTrigger>
        <AccordionPanel>
          Per seat, charged monthly on the day you subscribed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="cancel">
        <AccordionTrigger>Can I cancel at any time?</AccordionTrigger>
        <AccordionPanel>
          Yes. Your plan stays active until the end of the period.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

/** Only one section open at a time. */
export const Single: Story = {
  render: (args) => (
    <Accordion {...args} multiple={false} className="max-w-md">
      <AccordionItem value="one">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionPanel>Opening another one closes this.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionPanel>And this closes the first.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const TogglesAndExposesExpandedState: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /How is billing/ });

    // aria-expanded is what a screen reader announces; the visual state is secondary.
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    await expect(canvas.getByText(/Per seat, charged monthly/)).toBeVisible();
  },
};

/**
 * One item open so both halves of the type hierarchy are audited at once: the trigger is
 * `--ui-fg` and the panel body is `--ui-fg-muted`, and the muted one is the pair that
 * gets close to the 4.5:1 floor. The item borders carry the brand tint.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Accordion>…</Accordion>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {/*
       * Base UI gives an open panel `role="region"` labelled by its trigger, which makes
       * it a landmark. Six of them in one canvas means the trigger text has to be unique
       * across the whole matrix, not just within a cell, or axe reports `landmark-unique`.
       */}
      {(brand, scheme) => (
        <Accordion {...args} defaultValue={["open"]} className="w-52">
          <AccordionItem value="open">
            <AccordionTrigger>{`${scheme} ${brand}`}</AccordionTrigger>
            <AccordionPanel>{`Charged monthly in ${brand}.`}</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="shut">
            <AccordionTrigger>{`${scheme} ${brand} collapsed`}</AccordionTrigger>
            <AccordionPanel>Hidden until opened.</AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const itemIn = (cell: HTMLElement) => {
      const item = cell.querySelector('[data-slot="accordion-item"]');
      if (!item) throw new Error("the matrix cell rendered no accordion item");
      return item;
    };

    // The divider between items is the only brand-carrying surface here.
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", itemIn, "borderBottomColor"),
    );

    // Trigger ink and panel ink are deliberately two different tokens.
    for (const scheme of ["light", "dark"] as const) {
      const cell = within(canvasElement).getByTestId(`cell-${scheme}-blue`);
      await expect(
        getComputedStyle(
          within(cell).getByRole("button", { name: `${scheme} blue` }),
        ).color,
      ).not.toBe(
        getComputedStyle(within(cell).getByText(/Charged monthly/)).color,
      );
    }

    await expectSchemesDiffer(canvasElement);
  },
};
