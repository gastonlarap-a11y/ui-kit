import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import {
  BRANDS,
  SCHEMES,
  ThemeMatrixGrid,
} from "../../.storybook/theme-matrix.js";
import { cn } from "../lib/cn.js";

/**
 * The contrast contract, measured instead of asserted in a comment.
 *
 * `tokens.css` carries a line saying every foreground/background pair is verified against
 * WCAG AA and to recompute before changing any colour. That was true when it was written
 * and there was nothing to keep it true afterwards — a token edit in `green`/dark could
 * pass every component test while quietly dropping a pair below the floor.
 *
 * This story renders each documented pair in all six brand/scheme combinations and
 * measures what the browser actually paints, so the contract fails here rather than in
 * someone's product.
 */
const meta = {
  title: "Guides/Tokens",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Pair {
  /** Stable id, also what the assertion reports when it fails. */
  name: string;
  /** Class painting the sample: a text colour, or a fill for a non-text boundary. */
  sample: string;
  /** Class painting what the sample sits on. */
  against: string;
  /** Which computed property carries the sample's colour. */
  read: "color" | "backgroundColor";
  /** WCAG floor: 4.5:1 for body text (1.4.3), 3:1 for a UI boundary (1.4.11). */
  min: number;
}

/**
 * Text pairs. Every one of these is a real combination the components render — the ink
 * of a label on a card, of a description on the page, of a button's own foreground on
 * its fill.
 */
const TEXT_PAIRS: Pair[] = [
  {
    name: "fg on surface",
    sample: "text-fg",
    against: "bg-surface",
    read: "color",
    min: 4.5,
  },
  {
    name: "fg on canvas",
    sample: "text-fg",
    against: "bg-canvas",
    read: "color",
    min: 4.5,
  },
  {
    name: "fg-muted on canvas",
    sample: "text-fg-muted",
    against: "bg-canvas",
    read: "color",
    min: 4.5,
  },
  {
    name: "fg-muted on surface",
    sample: "text-fg-muted",
    against: "bg-surface",
    read: "color",
    min: 4.5,
  },
  {
    name: "muted-fg on muted",
    sample: "text-muted-fg",
    against: "bg-muted",
    read: "color",
    min: 4.5,
  },
  {
    name: "accent-fg on accent",
    sample: "text-accent-fg",
    against: "bg-accent",
    read: "color",
    min: 4.5,
  },
  {
    name: "danger-fg on danger",
    sample: "text-danger-fg",
    against: "bg-danger",
    read: "color",
    min: 4.5,
  },
  {
    name: "success-fg on success",
    sample: "text-success-fg",
    against: "bg-success",
    read: "color",
    min: 4.5,
  },
  {
    name: "warning-fg on warning",
    sample: "text-warning-fg",
    against: "bg-warning",
    read: "color",
    min: 4.5,
  },
];

/**
 * Non-text pairs: the shapes that identify a control rather than label it. SC 1.4.11 asks
 * 3:1 of these.
 *
 * `--ui-border` is not among them. It draws what groups, separates and frames — a
 * `Separator`, a table rule, a card outline — and none of those identify a control or its
 * state, which is what 1.4.11 is scoped to. The edge that does identify one is
 * `--ui-border-strong`, and it is asserted here.
 */
const BOUNDARY_PAIRS: Pair[] = [
  {
    name: "border-strong on surface",
    sample: "bg-border-strong",
    against: "bg-surface",
    read: "backgroundColor",
    min: 3,
  },
  {
    name: "border-strong on canvas",
    sample: "bg-border-strong",
    against: "bg-canvas",
    read: "backgroundColor",
    min: 3,
  },
  {
    name: "accent on surface",
    sample: "bg-accent",
    against: "bg-surface",
    read: "backgroundColor",
    min: 3,
  },
  {
    name: "ring on canvas",
    sample: "bg-ring",
    against: "bg-canvas",
    read: "backgroundColor",
    min: 3,
  },
];

/**
 * Elevation, which is not a contrast question.
 *
 * A ratio is the wrong instrument for "does this popup read as floating above that card":
 * at dark-mode luminances every ratio compresses towards 1:1, so the numbers say almost
 * nothing while the step is plainly visible. What must hold is only that the step exists
 * — the tokens have to resolve to different colours — and that is asserted separately
 * from the WCAG floors below.
 */
const ELEVATION_PAIRS = [
  {
    name: "overlay over surface",
    above: "bg-surface-overlay",
    below: "bg-surface",
  },
  { name: "surface over canvas", above: "bg-surface", below: "bg-canvas" },
] as const;

const PAIRS = [...TEXT_PAIRS, ...BOUNDARY_PAIRS];

/** Sample over `against`, tagged so the assertion can find it again. */
function Swatch({ pair }: { pair: Pair }) {
  return (
    <div
      data-pair={pair.name}
      className={cn(
        "flex w-40 items-center gap-2 rounded-sm px-2 py-1",
        pair.against,
      )}
    >
      {pair.read === "color" ? (
        <span
          data-slot="sample"
          className={cn("text-xs font-medium", pair.sample)}
        >
          {pair.name}
        </span>
      ) : (
        <>
          <span
            data-slot="sample"
            aria-hidden
            className={cn("size-4 shrink-0 rounded-full", pair.sample)}
          />
          <span className="text-xs text-fg">{pair.name}</span>
        </>
      )}
    </div>
  );
}

export const Palette: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          "/* app/globals.css */",
          '@import "tailwindcss";',
          '@import "@galarap/ui/tokens.css";',
        ].join("\n"),
      },
    },
  },
  render: () => (
    <ThemeMatrixGrid>
      {() => (
        <div className="flex flex-col gap-1">
          {PAIRS.map((pair) => (
            <Swatch key={pair.name} pair={pair} />
          ))}
        </div>
      )}
    </ThemeMatrixGrid>
  ),
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Every pair, in all six combinations, measured against its WCAG floor.
 */
export const MeetsItsContrastContract: Story = {
  tags: ["!autodocs"],
  render: Palette.render,
  play: async ({ canvasElement }) => {
    const failures: string[] = [];

    for (const scheme of SCHEMES) {
      for (const brand of BRANDS) {
        const cell = within(canvasElement).getByTestId(
          `cell-${scheme}-${brand}`,
        );

        for (const pair of PAIRS) {
          const swatch = cell.querySelector(`[data-pair="${pair.name}"]`);
          if (!swatch) throw new Error(`no swatch rendered for ${pair.name}`);
          const sample = swatch.querySelector('[data-slot="sample"]');
          if (!sample) throw new Error(`no sample rendered for ${pair.name}`);

          const ratio = contrastRatio(
            getComputedStyle(sample)[pair.read],
            getComputedStyle(swatch).backgroundColor,
          );

          if (ratio < pair.min) {
            failures.push(
              `${scheme}/${brand} — ${pair.name}: ${ratio.toFixed(2)}:1, needs ${pair.min}:1`,
            );
          }
        }
      }
    }

    await expect(failures).toEqual([]);
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The elevation ladder must stay a ladder. A popup that resolves to the same colour as
 * the card behind it is invisible as a layer, and in dark mode that is exactly what
 * happened before `--ui-surface-overlay` existed: every portalled surface reused
 * `--ui-surface`, and the shadow that was supposed to separate them is nearly
 * imperceptible against a dark background.
 */
export const ElevationStepsApart: Story = {
  tags: ["!autodocs"],
  render: () => (
    <ThemeMatrixGrid>
      {() => (
        <div className="flex flex-col gap-1">
          {ELEVATION_PAIRS.map((pair) => (
            <div
              key={pair.name}
              data-pair={pair.name}
              className={cn("w-40 rounded-sm p-2", pair.below)}
            >
              <div
                data-slot="above"
                className={cn(
                  "rounded-sm px-2 py-1 text-xs text-fg",
                  pair.above,
                )}
              >
                {pair.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    for (const scheme of SCHEMES) {
      for (const brand of BRANDS) {
        const cell = within(canvasElement).getByTestId(
          `cell-${scheme}-${brand}`,
        );

        for (const pair of ELEVATION_PAIRS) {
          const below = cell.querySelector(`[data-pair="${pair.name}"]`);
          if (!below) throw new Error(`no swatch rendered for ${pair.name}`);
          const above = below.querySelector('[data-slot="above"]');
          if (!above) throw new Error(`no upper layer for ${pair.name}`);

          // Light mode is the deliberate exception: overlay and surface are both pure
          // white there and the shadow does the separating, so only dark is asserted.
          if (scheme === "dark" || pair.name === "surface over canvas") {
            await expect(
              `${scheme}/${brand} ${pair.name}: ${getComputedStyle(above).backgroundColor}`,
            ).not.toBe(
              `${scheme}/${brand} ${pair.name}: ${getComputedStyle(below).backgroundColor}`,
            );
          }
        }
      }
    }
  },
};

/**
 * Converts any CSS colour the browser can paint into sRGB, by painting it.
 *
 * Parsing `oklch(…)` by hand would go stale the moment a token starts using
 * `color-mix()` or a relative colour, and `getComputedStyle` hands back whichever
 * notation was authored. A one-pixel canvas is whatever the user's screen would get,
 * which is the thing WCAG is actually about.
 */
function toSrgb(color: string): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("no 2d context to resolve colours with");

  // An unparseable colour leaves fillStyle untouched rather than throwing, which would
  // silently measure the sentinel instead of the token.
  const sentinel = "#010203";
  context.fillStyle = sentinel;
  context.fillStyle = color;
  if (context.fillStyle === sentinel && color !== sentinel) {
    throw new Error(`the browser could not parse the colour ${color}`);
  }

  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  if (r === undefined || g === undefined || b === undefined) {
    throw new Error(`no pixel data for the colour ${color}`);
  }
  return [r / 255, g / 255, b / 255];
}

/** WCAG 2.2 relative luminance, on sRGB components in 0..1. */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.2 contrast ratio between two CSS colours, lighter over darker. */
function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [
    relativeLuminance(toSrgb(a)),
    relativeLuminance(toSrgb(b)),
  ].sort((x, y) => y - x);
  if (lighter === undefined || darker === undefined) {
    throw new Error("could not measure both sides of the pair");
  }
  return (lighter + 0.05) / (darker + 0.05);
}
