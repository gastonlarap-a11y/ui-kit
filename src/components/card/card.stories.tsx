import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";

const meta = {
  title: "Molecules/Card",
  component: Card,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>
          Generated on the first day of every month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-fg-muted">
          Includes usage totals, billing summary and outstanding invoices.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Download</Button>
        <Badge variant="success">Ready</Badge>
      </CardFooter>
    </Card>
  ),
};

/**
 * The card is the kit's elevation test: it has to read as raised against the canvas in
 * both schemes, and the two do it differently. In light, `--ui-surface` is pure white in
 * every brand, so only the border and the canvas underneath carry the hue; in dark, the
 * surface itself is brand-tinted and lighter than the canvas. Both halves are asserted
 * below, because a change that flattens one would leave the other passing.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Card>…</Card>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand) => (
        <Card {...args} className="w-48">
          <CardHeader>
            <CardTitle>{brand}</CardTitle>
            <CardDescription>Scoped to this subtree.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Badge variant="accent">{brand}</Badge>
          </CardFooter>
        </Card>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const cardIn = (cell: HTMLElement) => {
      const card = cell.querySelector('[data-slot="card"]');
      if (!card) throw new Error("the matrix cell rendered no card");
      return card;
    };

    // Light: the surface is white everywhere, so the hue lives in the hairline.
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", cardIn, "borderTopColor"),
    );

    // Dark: the surface itself carries the brand and sits above the canvas.
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", cardIn, "backgroundColor"),
    );
    await expect(
      getComputedStyle(
        cardIn(within(canvasElement).getByTestId("cell-dark-blue")),
      ).backgroundColor,
    ).not.toBe(
      getComputedStyle(within(canvasElement).getByTestId("row-dark"))
        .backgroundColor,
    );

    await expectSchemesDiffer(canvasElement);
  },
};
