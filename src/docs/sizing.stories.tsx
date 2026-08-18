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
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
} from "../components/toolbar/toolbar.js";

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
 * beside it. This story is what stops the next such coincidence from going unnoticed —
 * including the one below it, which is why `ToolbarItemsAreFixedAtSmall` exists.
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

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * `Toolbar` is the one place in the kit where the scale is honoured without a `size` prop.
 * Its items write `h-8` directly and take no `size`, deliberately: a toolbar is a dense row
 * of icon-sized actions and there is no second size for it to be. What was missing is that
 * 32px was a coincidence rather than a contract — nothing connected `ToolbarButton` to
 * `Button` `sm`, so either could have moved without the other noticing.
 *
 * This is the connection. A toolbar item, a toolbar link and a composed `Button size="sm"`
 * are rendered in the same row and asserted to be the same documented height, which is the
 * only thing that actually has to hold: they sit next to each other, so they must line up.
 */
export const ToolbarItemsAreFixedAtSmall: Story = {
  tags: ["!autodocs"],
  render: () => (
    <Toolbar aria-label="Text formatting">
      <ToolbarButton>Bold</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#sizing">Docs</ToolbarLink>
      <ToolbarSeparator />
      {/* Composed rather than plain, because composition is the documented usage and it
          is what would break first: `ToolbarButton` drops its own classes when `render`
          is present, so the height then comes entirely from `Button`. */}
      <ToolbarButton
        render={
          <Button size="sm" variant="ghost">
            Save
          </Button>
        }
      />
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mismatches: string[] = [];

    const items: Array<[string, Element]> = [
      ["toolbar-button", canvas.getByRole("button", { name: "Bold" })],
      ["toolbar-link", canvas.getByRole("link", { name: "Docs" })],
      ["composed-button", canvas.getByRole("button", { name: "Save" })],
    ];

    for (const [name, element] of items) {
      const height = Math.round(element.getBoundingClientRect().height);
      if (height !== HEIGHTS.sm) {
        mismatches.push(`${name}: ${height}px, expected ${HEIGHTS.sm}px`);
      }
    }

    await expect(mismatches).toEqual([]);
  },
};
