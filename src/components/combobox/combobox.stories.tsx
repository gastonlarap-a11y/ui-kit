import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Field, FieldLabel } from "../field/field.js";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "./combobox.js";

interface Fruit {
  value: string;
  label: string;
}

const FRUITS: Fruit[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
  { value: "blackberry", label: "Blackberry" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
];

const meta = {
  title: "Molecules/Combobox",
  component: Combobox,
  args: { items: FRUITS },
  argTypes: {
    items: {
      description:
        "The selectable items. Base UI filters this list as the user types, so the " +
        "filtering and the rendering never disagree.",
    },
    multiple: {
      description: "Switches the input to removable chips, one per selection.",
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Field name="fruit">
        <FieldLabel>Choose a fruit</FieldLabel>
        <Combobox {...args}>
          <ComboboxInput placeholder="e.g. Apple" />
          <ComboboxContent empty="No fruits found.">
            {(fruit: Fruit) => (
              <ComboboxItem key={fruit.value} value={fruit}>
                {fruit.label}
              </ComboboxItem>
            )}
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  ),
};

/** With `multiple`, each selection becomes a chip that can be removed on its own. */
export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => (
    <div className="w-72">
      <Field name="fruits">
        <FieldLabel>Choose fruits</FieldLabel>
        <Combobox {...args}>
          <ComboboxChips<Fruit> placeholder="e.g. Apple">
            {(value) =>
              value.map((fruit) => (
                <ComboboxChip
                  key={fruit.value}
                  removeLabel={`Remove ${fruit.label}`}
                >
                  {fruit.label}
                </ComboboxChip>
              ))
            }
          </ComboboxChips>
          <ComboboxContent empty="No fruits found.">
            {(fruit: Fruit) => (
              <ComboboxItem key={fruit.value} value={fruit}>
                {fruit.label}
              </ComboboxItem>
            )}
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  ),
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const TypingFiltersTheList: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox");

    await userEvent.click(input);
    await waitFor(async () => {
      await expect(await screen.findAllByRole("option")).toHaveLength(
        FRUITS.length,
      );
    });

    // "ap" matches Apple and Apricot, and also Grape — the filter is a substring match.
    await userEvent.type(input, "ap");
    await waitFor(async () => {
      const visible = (await screen.findAllByRole("option")).map(
        (option) => option.textContent,
      );
      await expect(visible).toEqual(["Apple", "Apricot", "Grape"]);
    });
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const NoMatchShowsTheEmptyState: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox");

    await userEvent.click(input);
    await userEvent.type(input, "durian");

    await waitFor(async () => {
      await expect(screen.getByText("No fruits found.")).toBeInTheDocument();
    });
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ChipRemoveDeselects: Story = {
  tags: ["!autodocs"],
  args: { multiple: true },
  render: Multiple.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");

    await userEvent.click(input);
    await userEvent.click(await screen.findByRole("option", { name: "Apple" }));
    await userEvent.click(
      await screen.findByRole("option", { name: "Cherry" }),
    );

    await waitFor(async () => {
      await expect(
        canvas.getByRole("button", { name: "Remove Apple" }),
      ).toBeInTheDocument();
    });

    // Removing a chip must deselect the item, not just hide the chip.
    await userEvent.click(canvas.getByRole("button", { name: "Remove Apple" }));
    await waitFor(async () => {
      await expect(
        canvas.queryByRole("button", { name: "Remove Apple" }),
      ).not.toBeInTheDocument();
    });
    await expect(
      canvas.getByRole("button", { name: "Remove Cherry" }),
    ).toBeInTheDocument();
  },
};

const BRANDS = ["blue", "green", "purple"] as const;

/**
 * Every brand in both color schemes, so axe checks the contrast of all six
 * combinations rather than the `blue`/`light` default alone.
 *
 * The popup is portalled, so only the closed input is audited here — the popup's own
 * contrast is covered by the item styles it shares with `Select`.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          'import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem } from "@galarap/ui";',
          "",
          "<Combobox items={fruits}>",
          '  <ComboboxInput placeholder="e.g. Apple" />',
          "  <ComboboxContent>",
          "    {(fruit) => <ComboboxItem value={fruit}>{fruit.label}</ComboboxItem>}",
          "  </ComboboxContent>",
          "</Combobox>",
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
                <Field name={`fruit-${scheme}-${brand}`}>
                  <FieldLabel>{`${scheme} ${brand}`}</FieldLabel>
                  <Combobox items={FRUITS}>
                    <ComboboxInput placeholder="Search" />
                    <ComboboxContent>
                      {(fruit: Fruit) => (
                        <ComboboxItem key={fruit.value} value={fruit}>
                          {fruit.label}
                        </ComboboxItem>
                      )}
                    </ComboboxContent>
                  </Combobox>
                </Field>
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

    // The input surface reads from the neutral tokens, which must flip per scheme.
    const light = canvas.getByRole("combobox", { name: "light blue" });
    const dark = canvas.getByRole("combobox", { name: "dark blue" });
    await expect(getComputedStyle(light).color).not.toBe(
      getComputedStyle(dark).color,
    );
  },
};
