import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Button } from "../components/button/button.js";
import { Input } from "../components/input/input.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/select/select.js";
import { Toggle } from "../components/toggle/toggle.js";

/**
 * The control scale, measured instead of agreed.
 *
 * `size` means a box height before it means anything else: `sm`, `md` and `lg` are 32, 36
 * and 44 CSS pixels, and every control that can sit in a row with a button honours them.
 * That is what lets a search field, its dropdown and its action button line up without
 * anyone reaching for a `className`.
 *
 * It was not always true. `DataTable` used to write `className="h-8 w-20"` onto a
 * `SelectTrigger` by hand so it would match the `size="sm"` buttons of the `Pagination`
 * beside it, and `ToolbarButton` still measures `h-8` only because that happens to equal
 * `Button` `sm`. This story is what stops the next such coincidence from going unnoticed.
 */
const meta = {
  title: "Guides/Sizing",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES = ["sm", "md", "lg"] as const;

/** The contract, in CSS pixels. Changing one of these is a deliberate design decision. */
const HEIGHTS: Record<(typeof SIZES)[number], number> = {
  sm: 32,
  md: 36,
  lg: 44,
};

/** One row per size: the four controls that have to agree on a height. */
function Row({ size }: { size: (typeof SIZES)[number] }) {
  return (
    <div
      data-testid={`row-${size}`}
      className="flex flex-wrap items-center gap-3"
    >
      <span className="w-8 text-xs text-fg-muted">{size}</span>
      <Input
        size={size}
        aria-label={`Search ${size}`}
        placeholder="Search"
        className="w-40"
      />
      <Select>
        <SelectTrigger
          size={size}
          aria-label={`Plan ${size}`}
          placeholder="Plan"
          className="w-32"
        />
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
      <Toggle size={size} aria-label={`Bold ${size}`}>
        B
      </Toggle>
      <Button size={size}>Save</Button>
    </div>
  );
}

export const Scale: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<Input size="sm" />',
          '<SelectTrigger size="sm" />',
          '<Toggle size="sm" />',
          '<Button size="sm">Save</Button>',
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <Row key={size} size={size} />
      ))}
    </div>
  ),
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Every control of a given size is the same height, and that height is the documented one.
 */
export const ControlsOfOneSizeAlign: Story = {
  tags: ["!autodocs"],
  render: Scale.render,
  play: async ({ canvasElement }) => {
    const mismatches: string[] = [];

    for (const size of SIZES) {
      const row = within(canvasElement).getByTestId(`row-${size}`);
      /* `Input` renders a group around its field, so the box that has to line up is the
         group — the field inside it is the content box, two pixels shorter. */
      const field = within(row).getByRole("textbox");
      const inputGroup = field.closest('[data-slot="input-wrapper"]');
      if (!inputGroup) throw new Error("the input rendered no group");

      const controls: Array<[string, Element]> = [
        ["input", inputGroup],
        ["select", within(row).getByRole("combobox")],
        ["toggle", within(row).getByRole("button", { name: `Bold ${size}` })],
        ["button", within(row).getByRole("button", { name: "Save" })],
      ];

      for (const [name, element] of controls) {
        // `getBoundingClientRect` rather than a class assertion: what matters is the box
        // the reader sees, and a class check would pass while a padding change quietly
        // pushed one control taller than the rest.
        const height = element.getBoundingClientRect().height;
        if (Math.round(height) !== HEIGHTS[size]) {
          mismatches.push(
            `${size}/${name}: ${Math.round(height)}px, expected ${HEIGHTS[size]}px`,
          );
        }
      }
    }

    await expect(mismatches).toEqual([]);
  },
};
