import type { Meta, StoryObj } from "@storybook/react-vite";
import { within } from "storybook/test";

import {
  classNameArgType,
  variantArgType,
} from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Badge } from "./badge.js";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Active" },
  argTypes: {
    variant: variantArgType(
      ["neutral", "accent", "success", "warning", "danger", "outline"],
      "Intent of the label. `neutral` for plain metadata, `success`/`warning`/`danger` " +
        "for state, `accent` to tie it to the current brand, `outline` when the badge " +
        "sits on an already busy surface.",
    ),
    className: classNameArgType,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} variant="neutral">
        Neutral
      </Badge>
      <Badge {...args} variant="accent">
        Accent
      </Badge>
      <Badge {...args} variant="success">
        Success
      </Badge>
      <Badge {...args} variant="warning">
        Warning
      </Badge>
      <Badge {...args} variant="danger">
        Danger
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
    </div>
  ),
};

const VARIANTS = [
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
  "outline",
] as const;

/**
 * Every variant in every brand and scheme. Badge is the densest contrast surface in the
 * kit — six foreground/background pairs, one of which (`warning`) inverts its ink — so
 * auditing it in the `blue`/light default alone would leave thirty combinations unchecked.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          '    <Badge variant="accent">Scoped to this subtree only</Badge>',
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {() => (
        <div className="flex flex-col items-start gap-1">
          {VARIANTS.map((variant) => (
            <Badge key={variant} {...args} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const byLabel = (label: string) => (cell: HTMLElement) =>
      within(cell).getByText(label);

    // The accent badge carries the brand hue outright.
    await expectBrandsDiffer(
      readPerBrand(
        canvasElement,
        "light",
        byLabel("accent"),
        "backgroundColor",
      ),
    );

    // And so does the neutral one: the muted fill is brand-tinted rather than a flat
    // grey, which is the whole reason `--ui-muted` lives in the brand blocks and not
    // in the scheme-only ones.
    await expectBrandsDiffer(
      readPerBrand(
        canvasElement,
        "light",
        byLabel("neutral"),
        "backgroundColor",
      ),
    );

    await expectSchemesDiffer(canvasElement);
  },
};
