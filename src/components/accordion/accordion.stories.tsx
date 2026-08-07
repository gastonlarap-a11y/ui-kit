import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
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
