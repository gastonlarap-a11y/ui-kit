import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Fieldset, FieldsetLegend } from "../fieldset/fieldset.js";
import { CheckboxGroup } from "./checkbox-group.js";

const PERMISSIONS = ["read", "write", "delete"] as const;

const meta = {
  title: "Molecules/CheckboxGroup",
  component: CheckboxGroup,
  argTypes: {
    allValues: {
      description:
        "Every child value. Required for the parent checkbox — it is how the group " +
        "knows what 'all of them' means.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: ["read"] },
  render: (args) => (
    <CheckboxGroup {...args}>
      {PERMISSIONS.map((permission) => (
        <label key={permission} className="flex items-center gap-2 text-sm">
          <Checkbox value={permission} />
          <span className="capitalize">{permission}</span>
        </label>
      ))}
    </CheckboxGroup>
  ),
};

/**
 * The "select all" pattern. Make the group controlled, list every child in `allValues`
 * and mark one `Checkbox` as `parent`; the group drives its indeterminate state.
 */
function WithParent() {
  const [value, setValue] = useState<string[]>(["read"]);

  return (
    <Fieldset>
      <FieldsetLegend>Permissions</FieldsetLegend>
      <CheckboxGroup
        value={value}
        onValueChange={setValue}
        allValues={[...PERMISSIONS]}
      >
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox parent />
          <span>All permissions</span>
        </label>
        <div className="ml-6 flex flex-col gap-2">
          {PERMISSIONS.map((permission) => (
            <label key={permission} className="flex items-center gap-2 text-sm">
              <Checkbox value={permission} />
              <span className="capitalize">{permission}</span>
            </label>
          ))}
        </div>
      </CheckboxGroup>
    </Fieldset>
  );
}

export const SelectAll: Story = {
  render: () => <WithParent />,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ParentGoesIndeterminate: Story = {
  tags: ["!autodocs"],
  render: () => <WithParent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole("checkbox", { name: "All permissions" });

    // One of three ticked: the state that is tedious to maintain by hand.
    await expect(parent).toHaveAttribute("aria-checked", "mixed");

    await userEvent.click(canvas.getByRole("checkbox", { name: "write" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "delete" }));
    await expect(parent).toHaveAttribute("aria-checked", "true");

    // Clicking a full parent clears everything below it.
    await userEvent.click(parent);
    await expect(parent).toHaveAttribute("aria-checked", "false");
    await expect(
      canvas.getByRole("checkbox", { name: "read" }),
    ).toHaveAttribute("aria-checked", "false");
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, so axe checks the contrast of all six
 * combinations rather than the `blue`/`light` default alone.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { CheckboxGroup, Checkbox } from "@galarap/ui";',
          "",
          '<CheckboxGroup defaultValue={["read"]}>',
          '  <label><Checkbox value="read" /> Read</label>',
          "</CheckboxGroup>",
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
            className="flex flex-wrap gap-6 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand}>
                <CheckboxGroup defaultValue={["on"]}>
                  {/* `text-fg` is not decoration here: without it the label inherits
                      the host's default color and stays dark inside `.dark`, which is
                      a real contrast failure and axe catches it. */}
                  <label className="flex items-center gap-2 text-sm text-fg">
                    <Checkbox value="on" />
                    <span>{`${scheme} ${brand}`}</span>
                  </label>
                </CheckboxGroup>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const accents = BRANDS.map(
      (brand) =>
        getComputedStyle(
          canvas.getByRole("checkbox", { name: `light ${brand}` }),
        ).backgroundColor,
    );
    await expect(new Set(accents).size).toBe(BRANDS.length);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
