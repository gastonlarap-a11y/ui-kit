import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer.js";

const meta = {
  title: "Molecules/Drawer",
  component: Drawer,
  argTypes: {
    side: {
      description:
        "Which edge it enters from. The swipe direction is derived from it, so the two " +
        "cannot disagree.",
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline">Filters</Button>} />
      <DrawerContent>
        <DrawerTitle>Filters</DrawerTitle>
        <DrawerDescription>Narrow the list of results.</DrawerDescription>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Cancel</Button>} />
          <DrawerClose render={<Button>Apply</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** From the side, for a detail panel that sits next to the list it belongs to. */
export const FromTheRight: Story = {
  args: { side: "right" },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline">Details</Button>} />
      <DrawerContent>
        <DrawerTitle>Deployment details</DrawerTitle>
        <DrawerDescription>
          Built from `main` eight minutes ago.
        </DrawerDescription>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Open: Story = {
  args: { defaultOpen: true },
  render: Default.render,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const TitleIsTheAccessibleName: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Filters" }),
    );

    await waitFor(async () => {
      await expect(
        screen.getByRole("dialog", { name: "Filters" }),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The swipe is an enhancement; a keyboard user gets the same exit. If Escape stopped
 * working, the drawer would be a trap on desktop.
 */
export const EscapeClosesItAndFocusComesBack: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Filters",
    });

    await userEvent.click(trigger);
    await screen.findByRole("dialog", { name: "Filters" });

    await userEvent.keyboard("{Escape}");

    await waitFor(async () => {
      await expect(
        screen.queryByRole("dialog", { name: "Filters" }),
      ).not.toBeInTheDocument();
    });
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Regression: the edge and the swipe direction used to be two independent props, so a
 * right-hand panel could be configured to be flicked downwards.
 */
export const SwipeDirectionFollowsTheSide: Story = {
  tags: ["!autodocs"],
  args: { side: "right", defaultOpen: true },
  render: FromTheRight.render,
  play: async () => {
    const popup = await screen.findByRole("dialog", {
      name: "Deployment details",
    });

    // Base UI stamps the resolved direction onto the popup.
    await expect(popup.closest("[data-swipe-direction]")).toHaveAttribute(
      "data-swipe-direction",
      "right",
    );
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, so axe checks the contrast of all six
 * combinations rather than the `blue`/`light` default alone.
 *
 * The panel is portalled, so this audits the triggers; the panel's surface tokens are
 * the same ones `Dialog` already covers.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@galarap/ui";',
          "",
          "<Drawer>",
          '  <DrawerTrigger render={<Button variant="outline">Filters</Button>} />',
          "  <DrawerContent>",
          "    <DrawerTitle>Filters</DrawerTitle>",
          "  </DrawerContent>",
          "</Drawer>",
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
                <Drawer>
                  <DrawerTrigger
                    render={
                      <Button variant="outline">{`${scheme} ${brand}`}</Button>
                    }
                  />
                  <DrawerContent>
                    <DrawerTitle>{`${scheme} ${brand}`}</DrawerTitle>
                    <DrawerFooter>
                      <DrawerClose render={<Button>Close</Button>} />
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Outline triggers read border and text from the neutral tokens.
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
