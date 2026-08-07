import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  classNameArgType,
  variantArgType,
} from "../../../.storybook/arg-types.js";
import { Button } from "./button.js";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: {
    children: "Save changes",
    onClick: fn(),
  },
  argTypes: {
    variant: variantArgType(
      ["solid", "outline", "ghost", "danger"],
      "Visual weight. `solid` for the one primary action on the screen, `outline` and " +
        "`ghost` for secondary ones, `danger` for destructive actions.",
    ),
    size: variantArgType(
      ["sm", "md", "lg"],
      "Control height. `md` is the default; `sm` suits dense toolbars and table rows.",
    ),
    className: classNameArgType,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="solid">
        Solid
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    // Genuinely inert, not just faded: pointer events are off, so no click lands.
    await expect(getComputedStyle(button).pointerEvents).toBe("none");
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ClickIsForwarded: Story = {
  tags: ["!autodocs"],
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, all in one canvas. Two jobs: it proves the
 * tokens can be scoped to a subtree rather than only to `<html>`, and it puts all
 * six combinations in front of axe so a contrast regression in any of them fails CI
 * — the blue default alone would hide problems in the other two palettes.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      // The real render is a nested map over brands and schemes, which documents
      // nothing. Show what a consumer would actually write instead.
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Button>Scoped to this subtree only</Button>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["light", "dark"] as const).map((scheme) => (
        <div key={scheme} className={scheme === "dark" ? "dark" : undefined}>
          <div
            data-testid={`row-${scheme}`}
            className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div
                key={brand}
                data-theme={brand}
                className="flex items-center gap-2"
              >
                <Button {...args} variant="solid">
                  {brand}
                </Button>
                <Button {...args} variant="outline">
                  {brand}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const light = canvas.getAllByRole("button", { name: "blue" });

    // Each brand must resolve to a different accent within its own subtree.
    const solids = BRANDS.map(
      (brand) =>
        canvas.getAllByRole("button", { name: brand })[0] as HTMLElement,
    );
    const colors = solids.map((b) => getComputedStyle(b).backgroundColor);
    await expect(new Set(colors).size).toBe(BRANDS.length);

    // And the same brand must differ between the light and dark subtrees.
    await expect(
      getComputedStyle(light[0] as HTMLElement).backgroundColor,
    ).not.toBe(getComputedStyle(light[2] as HTMLElement).backgroundColor);

    // The neutrals must flip too, not just the accents. Checking only the accent
    // hid a real bug: the accents are declared on [data-theme], which re-resolves
    // inside a nested `.dark`, while the neutrals were declared on :root alone and
    // stayed light forever.
    const lightCanvas = getComputedStyle(
      canvas.getByTestId("row-light"),
    ).backgroundColor;
    const darkCanvas = getComputedStyle(
      canvas.getByTestId("row-dark"),
    ).backgroundColor;
    await expect(lightCanvas).not.toBe(darkCanvas);

    // Outline buttons read their border and text from the neutral tokens.
    const lightOutline = canvas.getAllByRole("button", {
      name: "blue",
    })[1] as HTMLElement;
    const darkOutline = canvas.getAllByRole("button", {
      name: "blue",
    })[3] as HTMLElement;
    await expect(getComputedStyle(lightOutline).color).not.toBe(
      getComputedStyle(darkOutline).color,
    );
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ConsumerClassNameWins: Story = {
  tags: ["!autodocs"],
  args: { className: "bg-danger" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    // Assert on class tokens, not substrings: `hover:bg-accent-hover` contains
    // "bg-accent" and would make a substring check pass for the wrong reason.
    const classes = [...button.classList];
    await expect(classes).toContain("bg-danger");
    // tailwind-merge must drop the base `bg-accent` instead of letting both land.
    await expect(classes).not.toContain("bg-accent");
  },
};
