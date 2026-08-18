import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { ReactNode } from "react";

import { Input } from "../components/input/input.js";
import { Pagination } from "../components/pagination/pagination.js";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table/table.js";

/**
 * Right-to-left, verified rather than assumed.
 *
 * The kit spends physical CSS in very few places — most of it is flex and gap, which are
 * direction-aware already — so the migration was small. What makes it hold is this story:
 * it renders the same components under `dir="ltr"` and `dir="rtl"` and reads back what the
 * browser computed, so a `pr-*` slipping into a component fails here.
 *
 * Four things could not be fixed by renaming a utility, because CSS has no logical form of
 * them: the switch thumb's travel, the toast's entry slide, the pagination chevrons and
 * the avatar stack's overlap. Those carry an explicit `rtl:` variant instead, each with a
 * comment saying why.
 *
 * Use the Direction control in the toolbar to see any story in either direction. One
 * caveat, the same one theming has: a portalled popup reads the direction of `<html>`, not
 * of the subtree its trigger sits in.
 */
const meta = {
  title: "Guides/Direction",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DIRECTIONS = ["ltr", "rtl"] as const;

/**
 * The children take the direction because anything with a landmark role needs a name
 * unique across the whole canvas — two `Pagination` navs both called "Pagination" are two
 * indistinguishable landmarks, and axe is right to say so.
 */
function Sample({
  children,
}: {
  children: (direction: (typeof DIRECTIONS)[number]) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {DIRECTIONS.map((direction) => (
        <div
          key={direction}
          dir={direction}
          data-testid={`dir-${direction}`}
          className="flex flex-col gap-3 rounded-lg bg-canvas p-4"
        >
          <span className="text-xs text-fg-muted">{direction}</span>
          {children(direction)}
        </div>
      ))}
    </div>
  );
}

export const BothDirections: Story = {
  parameters: {
    docs: {
      source: {
        code: '<html dir="rtl">',
      },
    },
  },
  render: () => (
    <Sample>
      {(direction) => (
        <>
          <Input
            aria-label={`Search ${direction}`}
            value="query"
            onValueChange={() => undefined}
            onClear={() => undefined}
            className="w-56"
          />
          <Table className="w-56">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <Pagination
            page={2}
            pageCount={5}
            label={`Pagination ${direction}`}
            onPageChange={() => undefined}
          />
        </>
      )}
    </Sample>
  ),
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Three assertions, one per kind of change the migration had to make: a logical utility
 * that the browser resolves per direction, a `text-align` that must be `start` rather than
 * `left`, and a glyph that needs an explicit `rtl:` variant because CSS cannot flip it.
 */
export const LayoutMirrors: Story = {
  tags: ["!autodocs"],
  render: BothDirections.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ltr = canvas.getByTestId("dir-ltr");
    const rtl = canvas.getByTestId("dir-rtl");

    // 1. The clear button sits on the trailing edge of the field, whichever edge that is.
    // It is a flex sibling rather than an absolutely positioned box, so this follows from
    // the writing direction with no utility of its own — which is exactly the point.
    const trailingSide = (root: HTMLElement) => {
      const field = within(root).getByRole("textbox").getBoundingClientRect();
      const button = within(root)
        .getByRole("button", { name: /Clear/ })
        .getBoundingClientRect();
      return button.left > field.left ? "right" : "left";
    };
    await expect(trailingSide(ltr)).toBe("right");
    await expect(trailingSide(rtl)).toBe("left");

    // 2. A table header aligns to the start of the line, not to the left of the screen.
    // The computed value stays the keyword, which is the point: `text-left` would not.
    await expect(
      getComputedStyle(within(ltr).getByRole("columnheader")).textAlign,
    ).toBe("start");

    // 3. The pagination chevrons mean previous and next, so they mirror. Tailwind v4
    // emits the individual `scale` property rather than a `transform`, so that is what
    // has to be read back.
    const glyph = (root: HTMLElement) => {
      const icon = root.querySelector('[data-slot="pagination-previous"] svg');
      if (!icon) throw new Error("no previous-page glyph rendered");
      return getComputedStyle(icon).scale;
    };
    await expect(glyph(rtl)).toBe("-1 1");
    await expect(glyph(ltr)).not.toBe(glyph(rtl));
  },
};
