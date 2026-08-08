import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "./avatar.js";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A URL that never resolves, so the fallback is what you see. */
export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://example.invalid/ada.jpg" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

const MEMBERS = ["AL", "BK", "CM", "DR", "EF", "GH"];

/**
 * Overlapping stack with the overflow collapsed into a count. The group is named as a
 * whole, because a screen reader reading six avatars in a row tells you nothing.
 */
export const Group: Story = {
  render: () => (
    <AvatarGroup max={4} aria-label="Project members">
      {MEMBERS.map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const GroupCollapsesTheOverflow: Story = {
  tags: ["!autodocs"],
  render: Group.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Four shown, two collapsed.
    await expect(canvas.getByText("AL")).toBeInTheDocument();
    await expect(canvas.getByText("DR")).toBeInTheDocument();
    await expect(canvas.queryByText("EF")).not.toBeInTheDocument();
    await expect(canvas.getByText("+2")).toBeInTheDocument();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const GroupWithoutOverflowShowsNoCount: Story = {
  tags: ["!autodocs"],
  render: () => (
    <AvatarGroup max={4} aria-label="Project members">
      {MEMBERS.slice(0, 3).map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText(/^\+/),
    ).not.toBeInTheDocument();
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes. The `+N` badge is the part worth auditing: it uses
 * the muted pair, and it sits behind a ring that reads from the surface token.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { AvatarGroup, Avatar, AvatarFallback } from "@galarap/ui";',
          "",
          '<AvatarGroup max={3} aria-label="Project members">',
          "  <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>",
          "</AvatarGroup>",
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
            className="flex flex-wrap items-center gap-6 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div
                key={brand}
                data-theme={brand}
                data-testid={`${scheme}-${brand}`}
              >
                <AvatarGroup max={2} aria-label={`${scheme} ${brand}`}>
                  {MEMBERS.map((initials) => (
                    <Avatar key={initials}>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const overflow = (scheme: string) =>
      canvas
        .getByTestId(`${scheme}-blue`)
        .querySelector('[data-slot="avatar-group-overflow"]') as HTMLElement;

    await expect(overflow("light")).toHaveTextContent("+4");

    // The muted pair must flip with the scheme; declaring it on `:root` alone would
    // leave the badge light forever inside `.dark`.
    await expect(getComputedStyle(overflow("light")).backgroundColor).not.toBe(
      getComputedStyle(overflow("dark")).backgroundColor,
    );

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} className="size-8">
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar {...args} className="size-14">
        <AvatarFallback className="text-base">LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const FallsBackWhenTheImageFails: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    // A broken URL must leave initials, not an empty hole in the layout.
    await expect(await within(canvasElement).findByText("AL")).toBeVisible();
  },
};
