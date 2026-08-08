import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { ScrollArea } from "./scroll-area.js";

const LINES = Array.from({ length: 30 }, (_, index) => `Log line ${index + 1}`);

const meta = {
  title: "Molecules/ScrollArea",
  component: ScrollArea,
  argTypes: {
    horizontal: { description: "Adds the horizontal scrollbar too." },
    className: classNameArgType,
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-56 w-72 rounded-lg border border-border bg-surface"
    >
      <div className="flex flex-col gap-1 p-4 text-sm text-fg">
        {LINES.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const BothDirections: Story = {
  args: { horizontal: true },
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-56 w-72 rounded-lg border border-border bg-surface"
    >
      <div className="flex w-[40rem] flex-col gap-1 p-4 text-sm text-fg">
        {LINES.map((line) => (
          <span key={line}>{line} — with enough text to overflow sideways</span>
        ))}
      </div>
    </ScrollArea>
  ),
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The component draws the bar; the platform still does the scrolling. If the viewport
 * ever stopped being a real scroll container, keyboard and wheel scrolling would break
 * silently.
 */
export const ViewportIsARealScrollContainer: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const viewport = canvasElement.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement;

    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);

    viewport.scrollTop = 120;
    await expect(viewport.scrollTop).toBe(120);
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
          'import { ScrollArea } from "@galarap/ui";',
          "",
          '<ScrollArea className="h-64">…</ScrollArea>',
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
              <div key={brand} data-theme={brand}>
                <ScrollArea className="h-24 w-40 rounded-lg border border-border bg-surface">
                  <div className="flex flex-col gap-1 p-3 text-sm text-fg">
                    <span>{`${scheme} ${brand}`}</span>
                    {LINES.slice(0, 8).map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      getComputedStyle(canvas.getByText("light blue")).color,
    ).not.toBe(getComputedStyle(canvas.getByText("dark blue")).color);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
