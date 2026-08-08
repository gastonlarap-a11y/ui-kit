import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.js";

const meta = {
  title: "Molecules/AlertDialog",
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="danger">Delete project</Button>}
      />
      <AlertDialogContent>
        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
        <AlertDialogDescription>
          Every deployment and environment variable goes with it. This cannot be
          undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost">Keep it</Button>} />
          <AlertDialogClose
            render={<Button variant="danger">Delete project</Button>}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
      within(canvasElement).getByRole("button", { name: "Delete project" }),
    );

    // `alertdialog`, not `dialog`: the role is what tells a screen reader this one
    // interrupts and needs an answer.
    await waitFor(async () => {
      await expect(
        screen.getByRole("alertdialog", { name: "Delete this project?" }),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The difference from `Dialog`: clicking the backdrop must not answer the question for
 * the user.
 */
export const BackdropClickDoesNotDismiss: Story = {
  tags: ["!autodocs"],
  args: { defaultOpen: true },
  render: Default.render,
  play: async () => {
    const dialog = await screen.findByRole("alertdialog");
    const backdrop = document.querySelector(
      '[data-slot="alert-dialog-backdrop"]',
    );

    await userEvent.click(backdrop as HTMLElement);

    // Still there — only an explicit choice closes it.
    await expect(dialog).toBeInTheDocument();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const FocusReturnsToTheTrigger: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Delete project",
    });

    await userEvent.click(trigger);
    await screen.findByRole("alertdialog");
    await userEvent.click(screen.getByRole("button", { name: "Keep it" }));

    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, so axe checks the contrast of all six
 * combinations rather than the `blue`/`light` default alone.
 *
 * The dialog itself is portalled, so this audits the triggers — the popup shares its
 * surface tokens with `Dialog`, which is covered by its own matrix.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { AlertDialog, AlertDialogTrigger, AlertDialogContent } from "@galarap/ui";',
          "",
          "<AlertDialog>",
          '  <AlertDialogTrigger render={<Button variant="danger">Delete</Button>} />',
          "  <AlertDialogContent>…</AlertDialogContent>",
          "</AlertDialog>",
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
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="danger">{`${scheme} ${brand}`}</Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogTitle>{`${scheme} ${brand}`}</AlertDialogTitle>
                    <AlertDialogFooter>
                      <AlertDialogClose render={<Button>Close</Button>} />
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // `danger` is a semantic token, not a brand accent, so it must stay constant
    // across brands and flip only with the scheme.
    const perBrand = BRANDS.map(
      (brand) =>
        getComputedStyle(canvas.getByRole("button", { name: `light ${brand}` }))
          .backgroundColor,
    );
    await expect(new Set(perBrand).size).toBe(1);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
