import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import type { DataTableColumn } from "../../lib/use-data-table.js";
import { Badge } from "../badge/badge.js";
import { DataTable } from "./data-table.js";

interface Element {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  state: "solid" | "gas";
}

const ELEMENTS: Element[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H", state: "gas" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He", state: "gas" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li", state: "solid" },
  {
    position: 4,
    name: "Beryllium",
    weight: 9.0122,
    symbol: "Be",
    state: "solid",
  },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B", state: "solid" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C", state: "solid" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N", state: "gas" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O", state: "gas" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F", state: "gas" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne", state: "gas" },
  {
    position: 11,
    name: "Sodium",
    weight: 22.9897,
    symbol: "Na",
    state: "solid",
  },
  {
    position: 12,
    name: "Magnesium",
    weight: 24.305,
    symbol: "Mg",
    state: "solid",
  },
];

/**
 * Declared once outside the component. A fresh array literal on every render would
 * re-sort and re-filter on every render — the one thing `useDataTable` asks of you.
 */
const columns: DataTableColumn<Element>[] = [
  { id: "position", header: "No.", accessor: (e) => e.position, align: "end" },
  { id: "name", header: "Name", accessor: (e) => e.name },
  { id: "weight", header: "Weight", accessor: (e) => e.weight, align: "end" },
  {
    id: "symbol",
    header: "Symbol",
    accessor: (e) => e.symbol,
    sortable: false,
  },
  {
    id: "state",
    header: "State",
    accessor: (e) => e.state,
    cell: (e) => (
      <Badge variant={e.state === "gas" ? "accent" : "neutral"}>
        {e.state}
      </Badge>
    ),
  },
];

const meta = {
  title: "Molecules/DataTable",
  component: DataTable,
  args: {
    caption: "The first twelve chemical elements",
    data: ELEMENTS,
    columns,
    getRowId: (element: Element) => element.position,
    defaultPageSize: 5,
  },
  argTypes: {
    caption: {
      description:
        "The table's accessible name. Required — pass `captionHidden` to keep it off " +
        "the screen without taking it away from a screen reader.",
    },
    columns: {
      description:
        "Column definitions. `accessor` reduces a row to the scalar the table sorts " +
        "and searches by; `cell` takes over the rendering when a value is not enough.",
    },
    searchable: { description: "Shows the search box." },
    pageSizeOptions: { description: "Shows the rows-per-page picker." },
    selectable: { description: "Adds the selection column." },
    className: classNameArgType,
  },
} satisfies Meta<typeof DataTable<Element>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Everything switched on: search, selection and a rows-per-page picker. */
export const FullyLoaded: Story = {
  args: {
    searchable: true,
    selectable: true,
    pageSizeOptions: [5, 10, 25],
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: "No elements match this filter yet.",
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const SortingCyclesAndMarksOneColumn: Story = {
  tags: ["!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const weight = canvas.getByRole("button", { name: /Weight/ });

    const firstBodyCell = () =>
      canvas.getAllByRole("row")[1]?.querySelectorAll("td")[1]?.textContent;

    // Unsorted: source order.
    await expect(firstBodyCell()).toBe("Hydrogen");
    await expect(
      canvas.getByRole("columnheader", { name: /Weight/ }),
    ).not.toHaveAttribute("aria-sort");

    // Ascending.
    await userEvent.click(weight);
    await expect(
      canvas.getByRole("columnheader", { name: /Weight/ }),
    ).toHaveAttribute("aria-sort", "ascending");
    await expect(firstBodyCell()).toBe("Hydrogen");

    // Descending — the heaviest of the twelve comes first.
    await userEvent.click(weight);
    await expect(
      canvas.getByRole("columnheader", { name: /Weight/ }),
    ).toHaveAttribute("aria-sort", "descending");
    await expect(firstBodyCell()).toBe("Magnesium");

    // Exactly one column is ever marked as sorted.
    await expect(
      canvas
        .getAllByRole("columnheader")
        .filter((header) => header.hasAttribute("aria-sort")),
    ).toHaveLength(1);

    // A third click clears it.
    await userEvent.click(weight);
    await expect(
      canvas.getByRole("columnheader", { name: /Weight/ }),
    ).not.toHaveAttribute("aria-sort");
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const NonSortableColumnHasNoControl: Story = {
  tags: ["!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: /Symbol/ }),
    ).not.toBeInTheDocument();
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const SearchFiltersAndReportsNoResults: Story = {
  tags: ["!autodocs"],
  args: { searchable: true, noResultsMessage: "Nothing matched that search." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Search" });

    await userEvent.type(search, "gen");
    await waitFor(async () => {
      // Hydrogen, Nitrogen, Oxygen — matched on the name column.
      await expect(canvas.getAllByRole("row")).toHaveLength(4);
    });

    await userEvent.clear(search);
    await userEvent.type(search, "unobtainium");
    await waitFor(async () => {
      await expect(
        canvas.getByText("Nothing matched that search."),
      ).toBeInTheDocument();
    });
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const PaginationWalksAndResetsOnPageSize: Story = {
  tags: ["!autodocs"],
  args: { pageSizeOptions: [5, 10] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 12 rows at 5 per page: 5 body rows plus the header.
    await expect(canvas.getAllByRole("row")).toHaveLength(6);
    await expect(
      canvas.getByRole("button", { name: "Previous page" }),
    ).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(
      canvas.getByRole("button", { name: "Page 2" }),
    ).toHaveAttribute("aria-current", "page");

    // Last page holds the remaining two rows and stops there.
    await userEvent.click(canvas.getByRole("button", { name: "Page 3" }));
    await expect(canvas.getAllByRole("row")).toHaveLength(3);
    await expect(
      canvas.getByRole("button", { name: "Next page" }),
    ).toHaveAttribute("aria-disabled", "true");

    // Growing the page size from page 3 must not leave the reader past the end.
    await userEvent.click(canvas.getByRole("combobox"));
    /* The Select popup is portalled to the body, so it is outside the story canvas. */
    await userEvent.click(await screen.findByRole("option", { name: "10" }));
    await waitFor(async () => {
      await expect(
        canvas.getByRole("button", { name: "Page 1" }),
      ).toHaveAttribute("aria-current", "page");
    });
    await expect(canvas.getAllByRole("row")).toHaveLength(11);
  },
};

/** Behaviour check, not a usage example — kept out of the docs page. */
export const SelectionCoversThePageAndGoesIndeterminate: Story = {
  tags: ["!autodocs"],
  args: { selectable: true, onSelectionChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const selectAll = canvas.getByRole("checkbox", {
      name: "Select all rows on this page",
    });

    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Select row 1" }),
    );
    await expect(args.onSelectionChange).toHaveBeenCalledWith([1]);
    // Some but not all.
    await expect(selectAll).toHaveAttribute("aria-checked", "mixed");

    await userEvent.click(selectAll);
    await waitFor(async () => {
      await expect(selectAll).toHaveAttribute("aria-checked", "true");
    });
    await expect(canvas.getByText("5 of 12 selected")).toBeInTheDocument();

    // Clearing the page leaves nothing behind on it.
    await userEvent.click(selectAll);
    await waitFor(async () => {
      await expect(selectAll).toHaveAttribute("aria-checked", "false");
    });
  },
};

/**
 * Behaviour check, not a usage example — kept out of the docs page.
 *
 * Regression: `getRowId` used to receive the row's position within the page, so
 * `(row, i) => i` produced the same ids on every page. Selecting a row on page 1 made
 * the matching row on page 2 look selected too, and React saw duplicate keys.
 */
export const RowIdsDoNotRepeatAcrossPages: Story = {
  tags: ["!autodocs"],
  render: () => (
    <DataTable
      caption="Elements keyed by position in the list"
      data={ELEMENTS}
      columns={columns}
      // The fallback a consumer writes when the data has no id of its own.
      getRowId={(_element, index) => index}
      defaultPageSize={5}
      selectable
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Select row 1" }),
    );
    await expect(
      canvas.getByRole("checkbox", { name: "Select row 1" }),
    ).toHaveAttribute("aria-checked", "true");

    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));

    // Page 2 starts at row 6, and none of its rows inherited page 1's selection.
    const firstOnPageTwo = canvas.getByRole("checkbox", {
      name: "Select row 6",
    });
    await expect(firstOnPageTwo).toHaveAttribute("aria-checked", "false");
    await expect(canvas.getByText("1 of 12 selected")).toBeInTheDocument();
  },
};

/**
 * A server-paginated endpoint: the component renders the page it was handed and only
 * reports where the reader wants to go.
 */
function ServerSide({
  onPageChange,
}: {
  onPageChange: (page: number) => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const slice = ELEMENTS.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DataTable
      caption="Elements, one page at a time"
      data={slice}
      columns={columns}
      getRowId={(element) => element.position}
      manualPagination
      rowCount={ELEMENTS.length}
      page={page}
      pageSize={pageSize}
      onPageChange={(next) => {
        setPage(next);
        onPageChange(next);
      }}
    />
  );
}

/** Behaviour check, not a usage example — kept out of the docs page. */
export const ManualPaginationDoesNotSliceAgain: Story = {
  tags: ["!autodocs"],
  args: { onPageChange: fn() },
  render: (args) => <ServerSide onPageChange={args.onPageChange!} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // The five rows it was handed, not five of five.
    await expect(canvas.getAllByRole("row")).toHaveLength(6);
    // Page count still comes from the server's total.
    await expect(
      canvas.getByRole("button", { name: "Page 3" }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await waitFor(async () => {
      await expect(canvas.getByText("Carbon")).toBeInTheDocument();
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
          'import { DataTable } from "@galarap/ui";',
          "",
          "<DataTable",
          '  caption="The first twelve chemical elements"',
          "  data={elements}",
          "  columns={columns}",
          "  getRowId={(e) => e.position}",
          "  searchable",
          "/>",
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
              <div key={brand} data-theme={brand} className="w-64">
                <DataTable
                  caption={`${scheme} ${brand}`}
                  data={ELEMENTS.slice(0, 3)}
                  columns={columns.slice(0, 2)}
                  getRowId={(element) => element.position}
                  paginated={false}
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

    // The sort indicator on the active column reads from the accent token.
    const accents = BRANDS.map((brand) =>
      getComputedStyle(
        canvas.getByRole("table", { name: `light ${brand}` }),
      ).getPropertyValue("--ui-accent"),
    );
    await expect(new Set(accents).size).toBe(BRANDS.length);

    await expect(
      getComputedStyle(canvas.getByTestId("row-light")).backgroundColor,
    ).not.toBe(
      getComputedStyle(canvas.getByTestId("row-dark")).backgroundColor,
    );
  },
};
