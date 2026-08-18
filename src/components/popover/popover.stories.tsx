import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Button } from "../button/button.js";
import { Field, FieldLabel } from "../field/field.js";
import { Input } from "../input/input.js";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js";

const meta = {
  title: "Molecules/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline">Share</Button>} />
      <PopoverContent>
        <PopoverTitle>Share this project</PopoverTitle>
        <PopoverDescription>
          Anyone with the link can view it.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

/** Unlike a tooltip, a popover can hold controls the user reaches with the keyboard. */
export const WithForm: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline">Invite</Button>} />
      <PopoverContent>
        <PopoverTitle>Invite a teammate</PopoverTitle>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <Input type="email" placeholder="you@company.com" />
        </Field>
        <Button size="sm">Send invite</Button>
      </PopoverContent>
    </Popover>
  ),
};

export const OpensAndClosesOnEscape: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Share",
    });
    await userEvent.click(trigger);

    const dialog = await within(document.body).findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).toHaveAccessibleName("Share this project");

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        within(document.body).queryByRole("dialog"),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/**
 * Triggers only. `PopoverContent` is portalled to `<body>` and follows the theme of
 * `<html>` rather than the subtree its trigger sits in — see
 * `PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`, which asserts that
 * limitation once for the whole kit. The outline trigger is the useful half here: it
 * paints `--ui-border` and `--ui-fg`, so it covers both the hairline and the ink.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Popover>…</Popover>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <Popover {...args}>
          <PopoverTrigger
            render={<Button variant="outline">{`${scheme} ${brand}`}</Button>}
          />
          <PopoverContent>
            <PopoverTitle>{`Share in ${scheme} ${brand}`}</PopoverTitle>
            <PopoverDescription>
              Anyone with the link can view it.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
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
