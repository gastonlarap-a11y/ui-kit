import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Button } from "../button/button.js";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

const meta = {
  title: "Molecules/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger
        render={<Button variant="outline">Actions</Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Grouped: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuGroupLabel>Sort by</DropdownMenuGroupLabel>
          <DropdownMenuItem>Name</DropdownMenuItem>
          <DropdownMenuItem>Last updated</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem defaultChecked>
          Show archived
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const OpensAndNavigatesWithArrowKeys: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Actions",
    });
    await userEvent.click(trigger);

    const menu = await within(document.body).findByRole("menu");
    await waitFor(() => expect(menu).toBeVisible());

    // Arrow keys, not tab: a menu is a single tab stop with roving focus inside.
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(
        within(menu).getByRole("menuitem", { name: "Rename" }),
      ).toHaveFocus(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument(),
    );
  },
};

/**
 * Triggers only. `DropdownMenuContent` is portalled to `<body>` and follows the theme of
 * `<html>`, not the subtree its trigger sits in — asserted once for the whole kit by
 * `PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`. Opening six menus
 * at once is not possible either: a menu is modal, so the second would close the first.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <DropdownMenu>…</DropdownMenu>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <DropdownMenu {...args}>
          <DropdownMenuTrigger
            render={<Button variant="outline">{`${scheme} ${brand}`}</Button>}
          />
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const triggerIn = (cell: HTMLElement) => within(cell).getByRole("button");

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", triggerIn, "borderTopColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", triggerIn, "borderTopColor"),
    );
    await expectSchemesDiffer(canvasElement);
  },
};
