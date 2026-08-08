import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  classNameArgType,
  variantArgType,
} from "../../../.storybook/arg-types.js";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  argTypes: {
    variant: variantArgType(
      ["info", "success", "warning", "danger"],
      'Severity. `warning` and `danger` also switch the element to `role="alert"`, ' +
        "which interrupts a screen reader; `info` and `success` stay polite.",
    ),
    onDismiss: {
      description:
        "Shows a close button and reports the intent. The Alert never removes itself — " +
        "whoever rendered it decides what happens.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The dashboard will be read-only on Sunday from 02:00 UTC.
      </AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert {...args} variant="info">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          A new version of the CLI is available.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="success">
        <AlertTitle>Deployed</AlertTitle>
        <AlertDescription>
          Your changes are live in every region.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="warning">
        <AlertTitle>Approaching your limit</AlertTitle>
        <AlertDescription>
          You have used 90% of this month&apos;s build minutes.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="danger">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your card was declined. Try another one.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  args: { onDismiss: () => {} },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <AlertTitle>Trial ends in 3 days</AlertTitle>
      <AlertDescription>
        Add a payment method to keep your projects running.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The Alert reports the intent and nothing else. Removing itself would make a
 * "dismissed" state impossible to remember across a re-render.
 */
export const DismissReportsButDoesNotRemove: Story = {
  tags: ["!autodocs"],
  args: { onDismiss: fn() },
  render: Dismissible.render,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();

    // Still on screen: the caller decides whether it goes away.
    await expect(canvas.getByText("Trial ends in 3 days")).toBeInTheDocument();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const NoDismissButtonWithoutTheHandler: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("button"),
    ).not.toBeInTheDocument();
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes. The dismiss button is the part worth auditing: it
 * sits on four different tinted surfaces, and `warning` on light is the tightest pair.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { Alert, AlertTitle } from "@galarap/ui";',
          "",
          '<Alert variant="warning" onDismiss={hide}>',
          "  <AlertTitle>Trial ends in 3 days</AlertTitle>",
          "</Alert>",
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
            className="flex flex-col gap-3 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand} className="flex gap-3">
                {(["info", "warning", "danger"] as const).map((variant) => (
                  <Alert
                    key={variant}
                    variant={variant}
                    onDismiss={() => {}}
                    dismissLabel={`Dismiss ${scheme} ${brand} ${variant}`}
                    className="flex-1"
                  >
                    <AlertTitle>{`${scheme} ${brand}`}</AlertTitle>
                    <AlertDescription>{variant}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The dismiss control reads from the neutral tokens, which must re-resolve per
    // scheme rather than staying light inside `.dark`.
    await expect(
      getComputedStyle(
        canvas.getByRole("button", { name: "Dismiss light blue info" }),
      ).color,
    ).not.toBe(
      getComputedStyle(
        canvas.getByRole("button", { name: "Dismiss dark blue info" }),
      ).color,
    );

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};

export const SeverityChangesTheRole: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args} variant="info">
        <AlertTitle>Informational</AlertTitle>
      </Alert>
      <Alert {...args} variant="danger">
        <AlertTitle>Destructive</AlertTitle>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Only the severe one may interrupt; the rest would talk over the user.
    await expect(canvas.getByRole("status")).toHaveTextContent("Informational");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Destructive");
  },
};
