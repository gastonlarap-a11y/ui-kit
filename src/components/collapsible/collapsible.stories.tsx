import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "./collapsible.js";

const meta = {
  title: "Molecules/Collapsible",
  component: Collapsible,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="max-w-sm">
      <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
      <CollapsiblePanel>
        Requests are retried three times with exponential backoff before the job
        is marked as failed.
      </CollapsiblePanel>
    </Collapsible>
  ),
};

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const TriggerReportsAndTogglesState: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Advanced settings" });

    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(async () => {
      await expect(canvas.getByText(/Requests are retried/)).toBeVisible();
    });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
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
          'import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "@galarap/ui";',
          "",
          "<Collapsible>",
          "  <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>",
          "  <CollapsiblePanel>…</CollapsiblePanel>",
          "</Collapsible>",
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
              <div key={brand} data-theme={brand} className="w-40">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger>{`${scheme} ${brand}`}</CollapsibleTrigger>
                  <CollapsiblePanel>Panel copy.</CollapsiblePanel>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Trigger and panel read from the neutral tokens, which must flip per scheme.
    await expect(
      getComputedStyle(canvas.getByRole("button", { name: "light blue" }))
        .color,
    ).not.toBe(
      getComputedStyle(canvas.getByRole("button", { name: "dark blue" })).color,
    );

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
