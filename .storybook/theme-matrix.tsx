import type { ReactNode } from "react";
import { expect, within } from "storybook/test";

/**
 * The shared scaffolding behind every `ThemeMatrix` story.
 *
 * A matrix story does two jobs at once: it proves the tokens can be scoped to a subtree
 * rather than only to `<html>`, and it puts all six brand/scheme combinations in front of
 * axe so a contrast regression in `green` or `dark` fails CI instead of hiding behind the
 * `blue`/light default.
 *
 * The grid itself was copied by hand into every component that had one, which is why the
 * assertions drifted into index arithmetic over `getAllByRole`. It lives here now so the
 * 42 components audit the same six combinations the same way, and so a cell can be
 * addressed by name.
 *
 * This file lives outside `src/` on purpose: tsup builds every `src/**` module, so a
 * docs-only helper in there would ship inside the published package.
 */

export const BRANDS = ["blue", "green", "purple"] as const;
export type Brand = (typeof BRANDS)[number];

export const SCHEMES = ["light", "dark"] as const;
export type Scheme = (typeof SCHEMES)[number];

/**
 * Renders `children` once per brand and scheme, each in its own scoped subtree.
 *
 * Every cell is reachable as `cell-<scheme>-<brand>` and every row as `row-<scheme>`,
 * so a `play` function can name the combination it is asserting on instead of counting
 * positions in a flat `getAllByRole` result.
 */
export function ThemeMatrixGrid({
  children,
}: {
  children: (brand: Brand, scheme: Scheme) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {SCHEMES.map((scheme) => (
        <div key={scheme} className={scheme === "dark" ? "dark" : undefined}>
          <div
            data-testid={`row-${scheme}`}
            className="flex flex-wrap items-start gap-4 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div
                key={brand}
                data-theme={brand}
                data-testid={`cell-${scheme}-${brand}`}
                className="flex items-center gap-2"
              >
                {children(brand, scheme)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The cell for one combination, for a `play` function that needs to scope its queries. */
export function matrixCell(
  canvasElement: HTMLElement,
  scheme: Scheme,
  brand: Brand,
): HTMLElement {
  return within(canvasElement).getByTestId(`cell-${scheme}-${brand}`);
}

/**
 * The neutral surface itself must flip between schemes, not just the accents.
 *
 * Checking only the accent hid a real bug once: accents are declared on `[data-theme]`,
 * which re-resolves inside a nested `.dark`, while the neutrals were declared on `:root`
 * alone and stayed light forever.
 */
export async function expectSchemesDiffer(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await expect(
    getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
  ).not.toBe(getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor);
}

/**
 * A brand-carrying token must resolve to a different value in each of the three palettes.
 *
 * Pass the computed values in brand order; a duplicate means one subtree failed to
 * re-resolve, which is the failure mode `[data-theme]` scoping exists to prevent.
 */
export async function expectBrandsDiffer(values: readonly string[]) {
  await expect(new Set(values).size).toBe(BRANDS.length);
}

/**
 * The computed properties a matrix assertion ever reads. Kept to colours on purpose: a
 * matrix story exists to catch a token resolving to the wrong colour, and a geometry
 * regression belongs in the component's own behaviour story.
 */
export type ColorProperty =
  | "backgroundColor"
  | "color"
  | "borderTopColor"
  | "borderBottomColor"
  | "borderLeftColor"
  | "borderRightColor"
  | "outlineColor"
  | "fill";

/** Reads one computed colour from an element inside each brand cell of a scheme. */
export function readPerBrand(
  canvasElement: HTMLElement,
  scheme: Scheme,
  pick: (cell: HTMLElement) => Element,
  property: ColorProperty,
): string[] {
  return BRANDS.map(
    (brand) =>
      getComputedStyle(pick(matrixCell(canvasElement, scheme, brand)))[
        property
      ],
  );
}
