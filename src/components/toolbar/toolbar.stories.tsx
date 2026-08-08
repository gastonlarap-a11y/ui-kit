import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Button } from "../button/button.js";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
} from "./toolbar.js";

const meta = {
  title: "Molecules/Toolbar",
  component: Toolbar,
  args: { "aria-label": "Document actions" },
  argTypes: {
    orientation: { description: "Which way the arrow keys move." },
    loopFocus: {
      description: "Whether focus wraps at the ends. On by default.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarButton>Save</ToolbarButton>
      <ToolbarButton>Duplicate</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Delete</ToolbarButton>
    </Toolbar>
  ),
};

/** Grouped, with a link and the kit's `Button` composed through `render`. */
export const Grouped: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarGroup>
        <ToolbarButton>Save</ToolbarButton>
        <ToolbarButton>Duplicate</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton
        render={
          <Button size="sm" variant="danger">
            Delete
          </Button>
        }
      />
      <ToolbarSeparator />
      <ToolbarLink href="#docs">Docs</ToolbarLink>
    </Toolbar>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: Default.render,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const WholeToolbarIsOneTabStop: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "Save" });
    const duplicate = canvas.getByRole("button", { name: "Duplicate" });

    await userEvent.tab();
    await expect(save).toHaveFocus();

    // Arrows move within; a second tab would leave the toolbar entirely.
    await userEvent.keyboard("{ArrowRight}");
    await expect(duplicate).toHaveFocus();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const FocusWrapsAtTheEnds: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "Save" });

    save.focus();
    await userEvent.keyboard("{ArrowLeft}");

    // Wrapping to the last item beats dead-ending on the first.
    await expect(canvas.getByRole("button", { name: "Delete" })).toHaveFocus();
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
          'import { Toolbar, ToolbarButton, ToolbarSeparator } from "@galarap/ui";',
          "",
          '<Toolbar aria-label="Document actions">',
          "  <ToolbarButton>Save</ToolbarButton>",
          "  <ToolbarSeparator />",
          "  <ToolbarButton>Delete</ToolbarButton>",
          "</Toolbar>",
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
            className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand}>
                {/* Each toolbar needs its own name, or six identical ones land on
                    the page and axe flags the duplication. */}
                <Toolbar aria-label={`${scheme} ${brand}`}>
                  <ToolbarButton>{`${scheme} ${brand}`}</ToolbarButton>
                  <ToolbarSeparator />
                  <ToolbarButton>More</ToolbarButton>
                </Toolbar>
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
