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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";

const meta = {
  title: "Molecules/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Example = () => (
  <Dialog>
    <DialogTrigger render={<Button variant="outline">Delete project</Button>} />
    <DialogContent>
      <DialogTitle>Delete project</DialogTitle>
      <DialogDescription>
        This permanently removes the project and every deployment attached to
        it.
      </DialogDescription>
      <DialogFooter>
        <DialogClose render={<Button variant="ghost">Cancel</Button>} />
        <DialogClose render={<Button variant="danger">Delete</Button>} />
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/**
 * Written out inline rather than reusing `Example`, so the snippet on the docs page
 * is the code you would actually copy instead of `<Example />`.
 */
export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger
        render={<Button variant="outline">Delete project</Button>}
      />
      <DialogContent>
        <DialogTitle>Delete project</DialogTitle>
        <DialogDescription>
          This permanently removes the project and every deployment attached to
          it.
        </DialogDescription>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button variant="danger">Delete</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * The dialog renders in a portal on `document.body`, so these assertions query the
 * whole document rather than the story canvas.
 */
export const OpensAndTrapsFocus: Story = {
  tags: ["!autodocs"],
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Delete project",
    });
    await userEvent.click(trigger);

    const dialog = await within(document.body).findByRole("dialog");
    // The popup mounts at opacity 0 and fades in, so wait the enter animation out
    // instead of racing it — asserting immediately is what makes this flaky.
    await waitFor(() => expect(dialog).toBeVisible());

    // The accessible name and description must come from Title/Description.
    await expect(dialog).toHaveAccessibleName("Delete project");
    await expect(dialog).toHaveAccessibleDescription(
      /permanently removes the project/,
    );

    // Focus must move into the dialog, otherwise keyboard users are stranded.
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    );
  },
};

export const ClosesOnEscapeAndRestoresFocus: Story = {
  tags: ["!autodocs"],
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Delete project",
    });
    await userEvent.click(trigger);

    await within(document.body).findByRole("dialog");
    await userEvent.keyboard("{Escape}");

    await waitFor(() =>
      expect(
        within(document.body).queryByRole("dialog"),
      ).not.toBeInTheDocument(),
    );
    // Focus returning to the trigger is what keeps keyboard navigation coherent.
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/**
 * Triggers only. `DialogContent` renders into `<body>`, so it resolves the theme of
 * `<html>` and not the subtree its trigger sits in; six open dialogs here would audit
 * the document theme six times and would fight each other for the focus trap. The
 * limitation is asserted once for the whole kit by
 * `PortalledDialogFollowsTheDocumentTheme` in `confirm.stories.tsx`.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Dialog>…</Dialog>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <Dialog {...args}>
          <DialogTrigger
            render={<Button variant="outline">{`${scheme} ${brand}`}</Button>}
          />
          <DialogContent>
            <DialogTitle>{`Delete in ${scheme} ${brand}`}</DialogTitle>
            <DialogDescription>
              This permanently removes the project.
            </DialogDescription>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost">Cancel</Button>} />
              <DialogClose render={<Button variant="danger">Delete</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
