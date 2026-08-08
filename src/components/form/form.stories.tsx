import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Button } from "../button/button.js";
import { Field, FieldError, FieldLabel } from "../field/field.js";
import { Input } from "../input/input.js";
import { Form } from "./form.js";

const meta = {
  title: "Molecules/Form",
  component: Form,
  argTypes: {
    errors: {
      description:
        "Map of field `name` to message. This is how a server-side failure reaches the " +
        "right `FieldError` — the browser cannot validate what only the server knows.",
    },
    onFormSubmit: {
      description:
        "Receives the values already parsed into an object and prevents the native " +
        "submit for you.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Form {...args} className="max-w-sm">
      <Field name="email">
        <FieldLabel>Work email</FieldLabel>
        <Input type="email" required placeholder="you@company.com" />
        <FieldError match="valueMissing">
          An email address is required.
        </FieldError>
      </Field>
      <Button type="submit" className="self-start">
        Subscribe
      </Button>
    </Form>
  ),
};

/**
 * The reason `Form` exists. `Field` validates what the browser can see; only the server
 * knows that an address is already taken. Clear the entry when the user edits, or the
 * message outlives the mistake.
 */
function ServerValidated() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Form
      className="max-w-sm"
      errors={errors}
      onFormSubmit={(values) => {
        const email = String(values.email ?? "");
        setErrors(
          email === "taken@company.com"
            ? { email: "That address is already registered." }
            : {},
        );
      }}
    >
      <Field name="email">
        <FieldLabel>Work email</FieldLabel>
        <Input type="email" required defaultValue="taken@company.com" />
        <FieldError />
      </Field>
      <Button type="submit" className="self-start">
        Subscribe
      </Button>
    </Form>
  );
}

export const ServerErrors: Story = {
  render: () => <ServerValidated />,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ServerErrorLandsOnItsField: Story = {
  tags: ["!autodocs"],
  render: () => <ServerValidated />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));

    await waitFor(async () => {
      await expect(
        canvas.getByText("That address is already registered."),
      ).toBeInTheDocument();
    });

    // The message is wired to the control, not just printed nearby.
    const input = canvas.getByRole("textbox", { name: "Work email" });
    await expect(input).toHaveAttribute("aria-invalid", "true");
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ServerErrorClearsOnResubmit: Story = {
  tags: ["!autodocs"],
  render: () => <ServerValidated />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Work email" });

    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));
    await waitFor(async () => {
      await expect(
        canvas.getByText("That address is already registered."),
      ).toBeInTheDocument();
    });

    await userEvent.clear(input);
    await userEvent.type(input, "free@company.com");
    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));

    await waitFor(async () => {
      await expect(
        canvas.queryByText("That address is already registered."),
      ).not.toBeInTheDocument();
    });
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const NativeValidationStillRuns: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }));

    // `Form` adds server errors; it does not replace what the browser already checks.
    await waitFor(async () => {
      await expect(
        canvas.getByText("An email address is required."),
      ).toBeInTheDocument();
    });
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, so axe checks the contrast of all six
 * combinations rather than the `blue`/`light` default alone. The error text is the
 * part worth auditing — danger on surface is the tightest pair in the palette.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { Form, Field, FieldLabel, FieldError, Input } from "@galarap/ui";',
          "",
          "<Form errors={errors} onFormSubmit={save}>",
          '  <Field name="email">',
          "    <FieldLabel>Work email</FieldLabel>",
          '    <Input type="email" />',
          "    <FieldError />",
          "  </Field>",
          "</Form>",
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
            className="flex flex-wrap gap-4 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand} className="w-44">
                <Form errors={{ email: `${scheme} ${brand} error` }}>
                  <Field name="email">
                    <FieldLabel>{`${scheme} ${brand}`}</FieldLabel>
                    <Input />
                    <FieldError />
                  </Field>
                </Form>
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
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );

    // The danger token must re-resolve per scheme, not stay light inside `.dark`.
    await expect(
      getComputedStyle(canvas.getByText("light blue error")).color,
    ).not.toBe(getComputedStyle(canvas.getByText("dark blue error")).color);
  },
};
