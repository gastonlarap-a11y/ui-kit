import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
import {
  expectBrandsDiffer,
  expectSchemesDiffer,
  readPerBrand,
  ThemeMatrixGrid,
} from "../../../.storybook/theme-matrix.js";
import { Badge } from "../badge/badge.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const meta = {
  title: "Molecules/Table",
  component: Table,
  argTypes: { className: classNameArgType },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { id: "INV-003", amount: "€49.00", status: "Paid" },
  { id: "INV-002", amount: "€49.00", status: "Paid" },
  { id: "INV-001", amount: "€29.00", status: "Refunded" },
];

export const Default: Story = {
  render: (args) => (
    <Table {...args} className="max-w-lg">
      <TableCaption>Invoices from the last quarter</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>
              <Badge
                variant={invoice.status === "Paid" ? "success" : "neutral"}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell />
          <TableCell>€127.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const ExposesRowsAndColumns: Story = {
  tags: ["!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The caption is the table's accessible name, and the header cells are what let a
    // screen reader say "Amount, €49.00" instead of just "€49.00".
    await expect(canvas.getByRole("table")).toHaveAccessibleName(
      "Invoices from the last quarter",
    );
    await expect(canvas.getAllByRole("columnheader")).toHaveLength(3);
    await expect(canvas.getAllByRole("row")).toHaveLength(invoices.length + 2);
  },
};

/**
 * A table is mostly hairlines: every row is separated by `--ui-border` and nothing else.
 * That makes it the component where a border token that loses contrast stops the data
 * being readable as rows at all, which no amount of correct markup compensates for.
 */
export const ThemeMatrix: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '<div className="dark">',
          '  <div data-theme="purple">',
          "    <Table>…</Table>",
          "  </div>",
          "</div>",
        ].join("\n"),
      },
    },
  },
  render: (args) => (
    <ThemeMatrixGrid>
      {(brand, scheme) => (
        <Table {...args} className="w-56">
          <TableCaption>{`${scheme} ${brand}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV-003</TableCell>
              <TableCell>
                <Badge variant="success">Paid</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV-001</TableCell>
              <TableCell>
                <Badge variant="neutral">Refunded</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </ThemeMatrixGrid>
  ),
  play: async ({ canvasElement }) => {
    const bodyRowIn = (cell: HTMLElement) => {
      const row = cell.querySelector('tbody [data-slot="table-row"]');
      if (!row) throw new Error("the matrix cell rendered no table row");
      return row;
    };

    await expectBrandsDiffer(
      readPerBrand(canvasElement, "light", bodyRowIn, "borderBottomColor"),
    );
    await expectBrandsDiffer(
      readPerBrand(canvasElement, "dark", bodyRowIn, "borderBottomColor"),
    );

    // The rule between rows must not resolve to the surface it sits on.
    for (const scheme of ["light", "dark"] as const) {
      const cell = within(canvasElement).getByTestId(`cell-${scheme}-blue`);
      await expect(
        getComputedStyle(bodyRowIn(cell)).borderBottomColor,
      ).not.toBe(getComputedStyle(bodyRowIn(cell)).backgroundColor);
    }

    await expectSchemesDiffer(canvasElement);
  },
};
