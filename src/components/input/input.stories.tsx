import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Input } from "./input.js";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: { placeholder: "you@company.com" },
  argTypes: {
    onClear: {
      description:
        "Shows a clear button while the field has content. Controlled only — the " +
        "component reads `value` to know whether there is anything to clear.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standalone. Inside a `Field` the label wiring is automatic — see the Field page. */
export const Default: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Work email</span>
      <Input {...args} />
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Work email</span>
      <Input {...args} disabled />
    </label>
  ),
};

export const AcceptsTypedText: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Work email");
    await userEvent.type(input, "ada@example.com");
    await expect(input).toHaveValue("ada@example.com");
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes. The clear button is the part worth auditing: it
 * sits on the input surface and reads from the muted foreground.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { Input } from "@galarap/ui";',
          "",
          "<Input value={query} onValueChange={setQuery} onClear={() => setQuery('')} />",
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
              <label
                key={brand}
                data-theme={brand}
                className="flex w-44 flex-col gap-1.5"
              >
                <span className="text-sm font-medium text-fg">{`${scheme} ${brand}`}</span>
                <Input
                  value="ada@example.com"
                  onValueChange={() => {}}
                  onClear={() => {}}
                  clearLabel={`Clear ${scheme} ${brand}`}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      getComputedStyle(canvas.getByRole("button", { name: "Clear light blue" }))
        .color,
    ).not.toBe(
      getComputedStyle(canvas.getByRole("button", { name: "Clear dark blue" }))
        .color,
    );

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};

/**
 * Clearable. It is controlled on purpose: an uncontrolled input would need its own
 * state to know whether it is empty, and two sources of truth for one value is how a
 * form ends up out of sync with itself.
 */
function Clearable() {
  const [value, setValue] = useState("ada@example.com");

  return (
    <label className="flex max-w-sm flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">Work email</span>
      <Input
        value={value}
        onValueChange={setValue}
        onClear={() => setValue("")}
        placeholder="you@company.com"
      />
    </label>
  );
}

export const WithClearButton: Story = {
  render: () => <Clearable />,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ClearEmptiesAndThenHidesItself: Story = {
  tags: ["!autodocs"],
  render: () => <Clearable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Work email");

    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await expect(input).toHaveValue("");

    // Gone rather than present-but-inert: an empty control is one more thing for a
    // screen reader user to skip past for no reason.
    await waitFor(async () => {
      await expect(
        canvas.queryByRole("button", { name: "Clear" }),
      ).not.toBeInTheDocument();
    });
  },
};
