import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { useConfirm } from "../../lib/use-confirm.js";
import { Button } from "../button/button.js";
import { ConfirmProvider } from "./confirm.js";

const meta = {
  title: "Molecules/ConfirmProvider",
  component: ConfirmProvider,
} satisfies Meta<typeof ConfirmProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reports what the promise resolved to, which is the whole contract. */
function DeleteButton() {
  const confirm = useConfirm();
  const [outcome, setOutcome] = useState<string>("nothing yet");

  async function askThenAct() {
    const confirmed = await confirm({
      title: "Delete this project?",
      description: "Every deployment and environment variable goes with it.",
      confirmLabel: "Delete project",
      cancelLabel: "Keep it",
    });
    setOutcome(confirmed ? "confirmed" : "declined");
  }

  return (
    <div className="flex flex-col items-start gap-3">
      {/* `void` because an onClick handler must not return a promise — this is the
          shape a consumer writes too. */}
      <Button variant="danger" onClick={() => void askThenAct()}>
        Delete project
      </Button>
      <p className="text-sm text-fg-muted">
        Outcome: <span data-testid="outcome">{outcome}</span>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ConfirmProvider>
      <DeleteButton />
    </ConfirmProvider>
  ),
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ConfirmingResolvesTrue: Story = {
  tags: ["!autodocs"],
  render: () => (
    <ConfirmProvider>
      <DeleteButton />
    </ConfirmProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Delete project" }),
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Delete project" }),
    );

    await waitFor(async () => {
      await expect(canvas.getByTestId("outcome")).toHaveTextContent(
        "confirmed",
      );
    });
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const CancellingResolvesFalse: Story = {
  tags: ["!autodocs"],
  render: () => (
    <ConfirmProvider>
      <DeleteButton />
    </ConfirmProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Delete project" }),
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Keep it" }),
    );

    await waitFor(async () => {
      await expect(canvas.getByTestId("outcome")).toHaveTextContent("declined");
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Escape must settle the promise too. If it only closed the dialog, the caller would
 * await forever.
 */
export const EscapeResolvesFalse: Story = {
  tags: ["!autodocs"],
  render: () => (
    <ConfirmProvider>
      <DeleteButton />
    </ConfirmProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Delete project" }),
    );
    await screen.findByRole("alertdialog");
    await userEvent.keyboard("{Escape}");

    await waitFor(async () => {
      await expect(canvas.getByTestId("outcome")).toHaveTextContent("declined");
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Asking a second question while one is open must not strand the first promise.
 */
export const ASecondQuestionDeclinesTheFirst: Story = {
  tags: ["!autodocs"],
  render: () => (
    <ConfirmProvider>
      <TwoQuestions />
    </ConfirmProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Ask twice" }));

    await waitFor(async () => {
      // The first resolved rather than hanging forever.
      await expect(canvas.getByTestId("first")).toHaveTextContent("declined");
    });
    await expect(
      await screen.findByRole("alertdialog", { name: "Second question" }),
    ).toBeInTheDocument();
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, with the dialog open. This is the one place the
 * confirmation's own surface gets audited — elsewhere it is portalled and closed.
 *
 * Only one provider can have a dialog open at a time, so the six variants are rendered
 * as separate scoped subtrees around a single open dialog each.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { ConfirmProvider, useConfirm } from "@galarap/ui";',
          "",
          "<ConfirmProvider>{children}</ConfirmProvider>",
          "",
          "const confirm = useConfirm();",
          'await confirm({ title: "Delete this project?" });',
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
                <ConfirmProvider>
                  <AskButton label={`${scheme} ${brand}`} />
                </ConfirmProvider>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The triggers live in the canvas, so they do resolve per subtree.
    await expect(
      getComputedStyle(canvas.getByRole("button", { name: "light blue" }))
        .backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByRole("button", { name: "dark blue" }))
        .backgroundColor,
    );

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Documents a real limitation rather than a feature: the dialog is portalled to the
 * body, so it resolves the theme of `<html>`, **not** the `[data-theme]` / `.dark`
 * subtree its trigger sits in. Scoped theming works for in-place components; anything
 * portalled (`Dialog`, `AlertDialog`, `Drawer`, `Select`, `Combobox`, `Autocomplete`,
 * `Popover`, `Tooltip`, `DropdownMenu`) follows the document.
 *
 * If this ever starts failing, the kit gained subtree-aware portals and the note in
 * `AGENTS.md` can go.
 */
export const PortalledDialogFollowsTheDocumentTheme: Story = {
  tags: ["!autodocs"],
  render: () => (
    <div className="dark">
      <div data-theme="green" className="rounded-lg bg-canvas p-4">
        <ConfirmProvider>
          <AskButton label="scoped trigger" />
        </ConfirmProvider>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "scoped trigger" }),
    );
    const confirmButton = await screen.findByRole("button", {
      name: "Confirm",
    });

    // The light value of `--ui-danger`, even though the trigger sits inside `.dark`.
    await expect(getComputedStyle(confirmButton).backgroundColor).toBe(
      "oklch(0.55 0.22 27)",
    );

    await userEvent.keyboard("{Escape}");
  },
};

/** Opens a confirmation named after the theme it sits in. */
function AskButton({ label }: { label: string }) {
  const confirm = useConfirm();
  return (
    <Button onClick={() => void confirm({ title: label })}>{label}</Button>
  );
}

/** Fires two confirmations back to back without awaiting the first. */
function TwoQuestions() {
  const confirm = useConfirm();
  const [first, setFirst] = useState("pending");

  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        onClick={() => {
          void confirm({ title: "First question" }).then((ok) =>
            setFirst(ok ? "confirmed" : "declined"),
          );
          void confirm({ title: "Second question" });
        }}
      >
        Ask twice
      </Button>
      <p className="text-sm text-fg-muted">
        First: <span data-testid="first">{first}</span>
      </p>
    </div>
  );
}
