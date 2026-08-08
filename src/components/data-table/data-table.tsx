"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn.js";
import { ChevronDownIcon, ChevronUpIcon, SortIcon } from "../../lib/icons.js";
import {
  useDataTable,
  type DataTableColumn,
  type DataTableInstance,
  type DataTableValue,
  type SortDirection,
  type UseDataTableOptions,
} from "../../lib/use-data-table.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Input } from "../input/input.js";
import { Pagination } from "../pagination/pagination.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../select/select.js";
import { Skeleton } from "../skeleton/skeleton.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table.js";

export interface DataTableProps<TRow> extends UseDataTableOptions<TRow> {
  /**
   * The table's accessible name. Required, because a table without one tells a screen
   * reader nothing about what it is listing. Pass `captionHidden` to keep it visually
   * out of the way.
   */
  caption: ReactNode;
  /** Keeps the caption available to assistive technology but off the screen. */
  captionHidden?: boolean;
  /** Shows the search box that filters across every searchable column. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Accessible name of the search box. Defaults to `"Search"`. */
  searchLabel?: string;
  /** Renders the pagination controls. Defaults to `true`. */
  paginated?: boolean;
  /** Shows the rows-per-page picker with these choices. */
  pageSizeOptions?: readonly number[];
  /** Adds the selection column and its header checkbox. */
  selectable?: boolean;
  /** Swaps the body for placeholder rows while the data is on its way. */
  loading?: boolean;
  /** Placeholder row count while `loading`. Defaults to the page size. */
  loadingRowCount?: number;
  /** Shown when there is genuinely no data. */
  emptyMessage?: ReactNode;
  /** Shown when a search matched nothing. Falls back to `emptyMessage`. */
  noResultsMessage?: ReactNode;
  className?: string;
}

/**
 * A table that sorts, searches, paginates and selects, configured by an array of column
 * definitions rather than by hand-written markup.
 *
 * A column is an object, not a component: that is what lets you memoize it, generate it
 * from configuration and keep the sorted value and the rendered value in agreement.
 * `accessor` reduces a row to the scalar the table sorts and searches by; `cell` takes
 * over the rendering when a plain value is not enough.
 *
 * Every piece of state is controllable, and each `manual*` flag hands one stage back to
 * you — which is how you wire a server-paginated endpoint. When the built-in layout is
 * not what you want, call `useDataTable` directly and render your own.
 *
 * @example
 * const columns: DataTableColumn<Invoice>[] = [
 *   { id: "id", header: "Invoice", accessor: (i) => i.id },
 *   { id: "status", header: "Status", accessor: (i) => i.status,
 *     cell: (i) => <Badge>{i.status}</Badge> },
 *   { id: "amount", header: "Amount", accessor: (i) => i.amount, align: "end" },
 * ];
 *
 * <DataTable
 *   caption="Invoices from the last quarter"
 *   data={invoices}
 *   columns={columns}
 *   getRowId={(i) => i.id}
 *   searchable
 *   pageSizeOptions={[5, 10, 25]}
 * />
 */
export function DataTable<TRow>({
  caption,
  captionHidden = false,
  searchable = false,
  searchPlaceholder = "Search…",
  searchLabel = "Search",
  paginated = true,
  pageSizeOptions,
  selectable = false,
  loading = false,
  loadingRowCount,
  emptyMessage = "No data to show.",
  noResultsMessage,
  className,
  ...options
}: DataTableProps<TRow>) {
  const table = useDataTable(options);
  const columnCount = table.columns.length + (selectable ? 1 : 0);

  return (
    <div
      data-slot="data-table"
      className={cn("flex w-full flex-col gap-3", className)}
    >
      {searchable ? (
        <div data-slot="data-table-toolbar" className="flex items-center gap-2">
          <Input
            data-slot="data-table-search"
            type="search"
            aria-label={searchLabel}
            placeholder={searchPlaceholder}
            value={table.search}
            onChange={(event) => table.setSearch(event.target.value)}
            className="max-w-64"
          />
        </div>
      ) : null}

      <Table>
        <TableCaption className={captionHidden ? "sr-only" : undefined}>
          {caption}
        </TableCaption>

        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all rows on this page"
                  checked={table.allSelected}
                  indeterminate={table.someSelected}
                  onCheckedChange={table.toggleAll}
                />
              </TableHead>
            ) : null}

            {table.columns.map((column) => (
              <DataTableHeadCell
                key={column.id}
                column={column}
                direction={table.getSortDirection(column.id)}
                onToggle={() => table.toggleSort(column.id)}
              />
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <LoadingRows
              rowCount={loadingRowCount ?? table.pageSize}
              columnCount={columnCount}
            />
          ) : table.isEmpty ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="py-8 text-center text-fg-muted"
              >
                {table.isFiltered
                  ? (noResultsMessage ?? emptyMessage)
                  : emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.rows.map(({ id, row, index }) => (
              <TableRow
                key={id}
                data-selected={table.isSelected(id) || undefined}
              >
                {selectable ? (
                  <TableCell>
                    <Checkbox
                      aria-label={`Select row ${index + 1}`}
                      checked={table.isSelected(id)}
                      onCheckedChange={() => table.toggleRow(id)}
                    />
                  </TableCell>
                ) : null}

                {table.columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      alignClass(column.align),
                      column.cellClassName,
                    )}
                  >
                    {column.cell
                      ? column.cell(row, index)
                      : renderValue(column.accessor(row))}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {paginated || pageSizeOptions ? (
        <DataTableFooter
          table={table}
          paginated={paginated}
          pageSizeOptions={pageSizeOptions}
          selectable={selectable}
        />
      ) : null}
    </div>
  );
}

interface DataTableHeadCellProps<TRow> {
  column: DataTableColumn<TRow>;
  direction: SortDirection | null;
  onToggle: () => void;
}

function DataTableHeadCell<TRow>({
  column,
  direction,
  onToggle,
}: DataTableHeadCellProps<TRow>) {
  const sortable = column.sortable !== false;

  return (
    <TableHead
      data-slot="data-table-head"
      /* Only the active column carries `aria-sort`. Its absence means "not sorted",
         so there is no `"none"` value to write. */
      aria-sort={
        direction === "asc"
          ? "ascending"
          : direction === "desc"
            ? "descending"
            : undefined
      }
      className={cn(alignClass(column.align), column.headerClassName)}
    >
      {sortable ? (
        <button
          type="button"
          data-slot="data-table-sort"
          onClick={onToggle}
          className={cn(
            "-mx-1 inline-flex items-center gap-1 rounded-sm px-1 py-0.5 font-medium",
            "transition-colors hover:text-fg",
            "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            column.align === "end" && "flex-row-reverse",
          )}
        >
          {column.header}
          <SortIndicator direction={direction} />
        </button>
      ) : (
        column.header
      )}
    </TableHead>
  );
}

/**
 * The arrow is decorative: `aria-sort` on the header already carries the state, and a
 * second announcement would only repeat it.
 */
function SortIndicator({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") return <ChevronUpIcon className="size-3.5" />;
  if (direction === "desc") return <ChevronDownIcon className="size-3.5" />;
  return <SortIcon className="size-3.5 opacity-40" />;
}

function LoadingRows({
  rowCount,
  columnCount,
}: {
  rowCount: number;
  columnCount: number;
}) {
  return Array.from({ length: rowCount }, (_, row) => (
    <TableRow key={row} aria-hidden>
      {Array.from({ length: columnCount }, (_, column) => (
        <TableCell key={column}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

interface DataTableFooterProps<TRow> {
  table: DataTableInstance<TRow>;
  paginated: boolean;
  pageSizeOptions: readonly number[] | undefined;
  selectable: boolean;
}

function DataTableFooter<TRow>({
  table,
  paginated,
  pageSizeOptions,
  selectable,
}: DataTableFooterProps<TRow>) {
  return (
    <div
      data-slot="data-table-footer"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-4 text-sm text-fg-muted">
        {/* A live region: the count changes as a result of typing in the search box,
            which a screen reader would otherwise never hear about. */}
        <p data-slot="data-table-count" aria-live="polite">
          {selectable && table.selection.length > 0
            ? `${table.selection.length} of ${table.rowCount} selected`
            : `${table.rowCount} ${table.rowCount === 1 ? "row" : "rows"}`}
        </p>

        {pageSizeOptions ? (
          <label className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              value={String(table.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-20" />
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        ) : null}
      </div>

      {paginated ? (
        <Pagination
          page={table.page}
          pageCount={table.pageCount}
          onPageChange={table.setPage}
        />
      ) : null}
    </div>
  );
}

function alignClass(align: DataTableColumn<unknown>["align"]): string {
  if (align === "end") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

/** Dates and booleans need a readable form; everything else prints as-is. */
function renderValue(value: DataTableValue): ReactNode {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}
