import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Field, FieldLabel } from "../field/field.js";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
} from "./autocomplete.js";

interface Tag {
  id: string;
  value: string;
}

const TAGS: Tag[] = [
  { id: "bug", value: "bug" },
  { id: "feature", value: "feature" },
  { id: "docs", value: "documentation" },
  { id: "perf", value: "performance" },
  { id: "a11y", value: "accessibility" },
];

const meta = {
  title: "Molecules/Autocomplete",
  component: Autocomplete,
  args: { items: TAGS },
  argTypes: {
    items: { description: "The suggestions offered while typing." },
    mode: {
      description:
        "How suggestions are applied: `list` (default), `inline`, `both` or `none`.",
    },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Field name="tag">
        <FieldLabel>Search tags</FieldLabel>
        <Autocomplete {...args}>
          <AutocompleteInput placeholder="e.g. feature" />
          <AutocompleteContent empty="No tags found.">
            {(tag: Tag) => (
              <AutocompleteItem key={tag.id} value={tag}>
                {tag.value}
              </AutocompleteItem>
            )}
          </AutocompleteContent>
        </Autocomplete>
      </Field>
    </div>
  ),
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const SuggestionsNarrowAsYouType: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox");

    await userEvent.type(input, "e");
    await waitFor(async () => {
      await expect((await screen.findAllByRole("option")).length).toBeLessThan(
        TAGS.length,
      );
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * This is the whole difference from `Combobox`: what the user typed is a valid answer
 * even though no suggestion matched it.
 */
export const FreeTextSurvivesClosingThePopup: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox");

    await userEvent.type(input, "regression");
    await waitFor(async () => {
      await expect(screen.getByText("No tags found.")).toBeInTheDocument();
    });

    await userEvent.keyboard("{Escape}");

    // A Combobox would have thrown this away; an Autocomplete keeps it.
    await expect(input).toHaveValue("regression");
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const PickingASuggestionFillsTheInput: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox");

    await userEvent.type(input, "acc");
    await userEvent.click(
      await screen.findByRole("option", { name: "accessibility" }),
    );

    await waitFor(async () => {
      await expect(input).toHaveValue("accessibility");
    });
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
          'import { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem } from "@galarap/ui";',
          "",
          "<Autocomplete items={tags}>",
          '  <AutocompleteInput placeholder="e.g. feature" />',
          "  <AutocompleteContent>",
          "    {(tag) => <AutocompleteItem value={tag}>{tag.value}</AutocompleteItem>}",
          "  </AutocompleteContent>",
          "</Autocomplete>",
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
                <Field name={`tag-${scheme}-${brand}`}>
                  <FieldLabel>{`${scheme} ${brand}`}</FieldLabel>
                  <Autocomplete items={TAGS}>
                    <AutocompleteInput placeholder="Search" />
                    <AutocompleteContent>
                      {(tag: Tag) => (
                        <AutocompleteItem key={tag.id} value={tag}>
                          {tag.value}
                        </AutocompleteItem>
                      )}
                    </AutocompleteContent>
                  </Autocomplete>
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

    await expect(
      getComputedStyle(canvas.getByRole("combobox", { name: "light blue" }))
        .color,
    ).not.toBe(
      getComputedStyle(canvas.getByRole("combobox", { name: "dark blue" }))
        .color,
    );
  },
};
