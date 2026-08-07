import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { classNameArgType } from "../../../.storybook/arg-types.js";
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
