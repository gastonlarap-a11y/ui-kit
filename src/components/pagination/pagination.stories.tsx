import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import { Pagination } from "./pagination.js";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  args: {
    page: 1,
    pageCount: 10,
    /* Not a spy: every story below drives the component through `Interactive`, and a
       `fn()` here would be serialised into all of the copyable snippets. */
    onPageChange: () => {},
  },
  argTypes: {
    page: { description: "Current page, 1-based." },
    pageCount: { description: "Total number of pages." },
    siblingCount: {
      description:
        "How many page numbers to keep on each side of the current one. The rendered " +
        "width stays constant regardless of which page is active.",
    },
    showEdges: {
      description: "Adds the jump-to-first and jump-to-last controls.",
    },
    className: classNameArgType,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drives the controlled component the way a consumer would. */
function Interactive({
  initialPage = 1,
  ...props
}: Partial<ComponentProps<typeof Pagination>> & {
  initialPage?: number;
}) {
  const [page, setPage] = useState(initialPage);
  return (
    <Pagination pageCount={10} {...props} page={page} onPageChange={setPage} />
  );
}

export const Default: Story = {
  render: (args) => <Interactive {...args} />,
};

export const WithEdges: Story = {
  args: { showEdges: true },
  render: (args) => <Interactive {...args} initialPage={5} />,
};

/**
 * With more pages than fit, the middle collapses into gaps. The first and last page
 * always stay reachable in one click.
 */
export const ManyPages: Story = {
  args: { pageCount: 42 },
  render: (args) => <Interactive {...args} initialPage={20} />,
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const NextAdvances: Story = {
  tags: ["!autodocs"],
  render: (args) => <Interactive {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("button", { name: "Page 1" }),
    ).toHaveAttribute("aria-current", "page");

    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));

    await expect(
      canvas.getByRole("button", { name: "Page 2" }),
    ).toHaveAttribute("aria-current", "page");
    // Exactly one page is current at a time.
    await expect(
      canvas.getAllByRole("button", { current: "page" }),
    ).toHaveLength(1);
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * The edge controls stay focusable while inert, which is the reason they carry
 * `aria-disabled` instead of `disabled`.
 */
export const EdgesAreInertNotRemoved: Story = {
  tags: ["!autodocs"],
  render: (args) => <Interactive {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previous = canvas.getByRole("button", { name: "Previous page" });

    await expect(previous).toHaveAttribute("aria-disabled", "true");
    await expect(previous).not.toBeDisabled();

    // Still reachable by keyboard, unlike a `disabled` button.
    previous.focus();
    await expect(previous).toHaveFocus();

    // And activating it changes nothing.
    await userEvent.click(previous, { pointerEventsCheck: 0 });
    await expect(
      canvas.getByRole("button", { name: "Page 1" }),
    ).toHaveAttribute("aria-current", "page");
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const WidthStaysConstant: Story = {
  tags: ["!autodocs"],
  args: { pageCount: 42 },
  render: (args) => <Interactive {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countPages = () =>
      canvas.getAllByRole("button", { name: /^Page \d+$/ }).length;

    const atStart = countPages();
    await userEvent.click(canvas.getByRole("button", { name: "Page 42" }));
    const atEnd = countPages();

    // A control that resizes as you page through it is hard to click twice in a row.
    await expect(atEnd).toBe(atStart);
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
          'import { Pagination } from "@galarap/ui";',
          "",
          "<Pagination page={page} pageCount={10} onPageChange={setPage} />",
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
            className="flex flex-wrap items-center gap-4 rounded-lg bg-canvas p-4"
          >
            {BRANDS.map((brand) => (
              <div key={brand} data-theme={brand}>
                {/* Each landmark needs its own name, or six identical "Pagination"
                    navigations land on the page and axe flags the duplication. */}
                <Pagination
                  label={`${scheme} ${brand}`}
                  page={2}
                  pageCount={5}
                  onPageChange={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The active page is a solid button, so it carries the brand accent.
    const accents = BRANDS.map(
      (brand) =>
        getComputedStyle(
          within(
            canvas.getByRole("navigation", { name: `light ${brand}` }),
          ).getByRole("button", { name: "Page 2" }),
        ).backgroundColor,
    );
    await expect(new Set(accents).size).toBe(BRANDS.length);

    // Neutrals must flip with the scheme too, not only the accents.
    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
