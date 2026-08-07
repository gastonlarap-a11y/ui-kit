import type {
  HTMLAttributes,
  Ref,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "../../lib/cn.js";

type SectionProps = HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement>;
};

/**
 * Styled wrappers around the native table elements. They add no behaviour — no sorting,
 * no virtualisation — because a real `<table>` already gives screen readers the row and
 * column relationships that a grid of divs throws away.
 *
 * Always write a `TableCaption`: it is the table's accessible name.
 *
 * @example
 * <Table>
 *   <TableCaption>Invoices from the last quarter</TableCaption>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Invoice</TableHead>
 *       <TableHead>Amount</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>INV-001</TableCell>
 *       <TableCell>€49.00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { ref?: Ref<HTMLTableElement> }) {
  return (
    <div data-slot="table-container" className="w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom border-collapse text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: SectionProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: SectionProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: SectionProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border font-medium", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { ref?: Ref<HTMLTableRowElement> }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>;
}) {
  return (
    <th
      data-slot="table-head"
      className={cn("px-3 py-2 text-left font-medium text-fg-muted", className)}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>;
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-3 py-2 text-fg", className)}
      {...props}
    />
  );
}

/** The table's accessible name. Keep it, and hide it visually if the design needs to. */
export function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement> & {
  ref?: Ref<HTMLTableCaptionElement>;
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-sm text-fg-muted", className)}
      {...props}
    />
  );
}
