"use client";

import { useCallback, useMemo, type ReactNode } from "react";

import { useControllableState } from "./use-controllable-state.js";

/** What a cell holds once reduced to something sortable and searchable. */
export type DataTableValue =
  string | number | boolean | Date | null | undefined;

export type DataTableRowId = string | number;

export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableColumn<TRow> {
  /** Stable identity of the column. Used by sorting and as the React key. */
  id: string;
  /** Header content. A plain string is enough; a node lets you add an icon or a tooltip. */
  header: ReactNode;
  /**
   * Reduces a row to one scalar. It drives sorting, searching and — unless `cell` says
   * otherwise — what the cell renders.
   *
   * Returning a scalar rather than arbitrary JSX is what keeps sorting and searching
   * honest: the table compares the same thing the reader sees.
   */
  accessor: (row: TRow) => DataTableValue;
  /**
   * Custom rendering for the cell. Receives the whole row, so a column can render a
   * badge, a link or several fields while `accessor` still decides its order.
   *
   * `index` is absolute across the filtered set, not the position within the page.
   */
  cell?: (row: TRow, index: number) => ReactNode;
  /** Defaults to `true`. */
  sortable?: boolean;
  /** Whether the global search looks at this column. Defaults to `true`. */
  searchable?: boolean;
  /** Numeric columns read better right-aligned. Defaults to `"start"`. */
  align?: "start" | "center" | "end";
  /** Custom ordering when the default comparison is wrong for this column. */
  compare?: (a: DataTableValue, b: DataTableValue) => number;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableRow<TRow> {
  id: DataTableRowId;
  row: TRow;
  /**
   * Position across the whole filtered set, not within the current page: the first row
   * of page 2 at 10 per page is index 10.
   *
   * That is what makes `getRowId={(row, i) => i}` safe when the data has no id of its
   * own, and what lets a row label say which row it actually is.
   */
  index: number;
}

export interface UseDataTableOptions<TRow> {
  data: readonly TRow[];
  /**
   * Memoize this or declare it outside the component — a fresh array literal on every
   * render re-sorts and re-filters on every render.
   */
  columns: readonly DataTableColumn<TRow>[];
  /**
   * Identity of a row. Needed for selection and for stable React keys.
   *
   * `index` is absolute across the filtered set, so falling back to it when the data has
   * no id — `(row, i) => i` — stays unique across pages.
   */
  getRowId: (row: TRow, index: number) => DataTableRowId;

  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  /** The caller sorts (usually the server). The hook only reports the change. */
  manualSorting?: boolean;

  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** The caller filters. `data` is expected to arrive already filtered. */
  manualFiltering?: boolean;

  /** 1-based, like the page numbers a reader sees. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  /** The caller paginates. `data` holds one page and `rowCount` the full total. */
  manualPagination?: boolean;
  /** Total rows across all pages. Required with `manualPagination`. */
  rowCount?: number;

  selection?: readonly DataTableRowId[];
  defaultSelection?: readonly DataTableRowId[];
  onSelectionChange?: (selection: DataTableRowId[]) => void;
}

export interface DataTableInstance<TRow> {
  /** Rows of the current page, already sorted and filtered. */
  rows: DataTableRow<TRow>[];
  columns: readonly DataTableColumn<TRow>[];

  sort: DataTableSort | null;
  /** Cycles ascending → descending → unsorted. */
  toggleSort: (columnId: string) => void;
  /** `null` when the column is not the active one. */
  getSortDirection: (columnId: string) => SortDirection | null;

  search: string;
  setSearch: (search: string) => void;

  page: number;
  pageSize: number;
  pageCount: number;
  /** Rows that survived the filter, across all pages. */
  rowCount: number;
  /** Rows before filtering. */
  totalRowCount: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  setPageSize: (pageSize: number) => void;

  selection: DataTableRowId[];
  isSelected: (id: DataTableRowId) => boolean;
  toggleRow: (id: DataTableRowId) => void;
  /** Selects or clears every row on the current page. */
  toggleAll: () => void;
  setSelection: (selection: DataTableRowId[]) => void;
  /** Every row on the current page is selected. */
  allSelected: boolean;
  /** Some but not all — the indeterminate state of the header checkbox. */
  someSelected: boolean;

  /** No rows to show. Distinguishes "no data at all" from "nothing matched". */
  isEmpty: boolean;
  isFiltered: boolean;
}

/**
 * The behaviour behind `DataTable`: sorting, searching, pagination and selection over a
 * plain array, with every piece of state controllable from outside.
 *
 * Use it directly when you want the behaviour but not the markup — the returned instance
 * is everything `DataTable` itself renders from.
 *
 * Each `manual*` flag hands one stage back to the caller, which is how a server-paginated
 * endpoint is wired: the hook stops computing that stage and only emits the change.
 *
 * @example
 * const columns = useMemo<DataTableColumn<User>[]>(() => [
 *   { id: "name", header: "Name", accessor: (u) => u.name },
 *   { id: "seats", header: "Seats", accessor: (u) => u.seats, align: "end" },
 * ], []);
 *
 * const table = useDataTable({ data: users, columns, getRowId: (u) => u.id });
 *
 * @example
 * // Server-side: the endpoint sorts and paginates, the hook just reports intent.
 * const table = useDataTable({
 *   data: page.items,
 *   columns,
 *   getRowId: (u) => u.id,
 *   manualPagination: true,
 *   manualSorting: true,
 *   rowCount: page.total,
 *   onPageChange: setPage,
 *   onSortChange: setSort,
 * });
 */
export function useDataTable<TRow>({
  data,
  columns,
  getRowId,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSorting = false,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  manualFiltering = false,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  pageSize: pageSizeProp,
  defaultPageSize = 10,
  onPageSizeChange,
  manualPagination = false,
  rowCount: rowCountProp,
  selection: selectionProp,
  defaultSelection = [],
  onSelectionChange,
}: UseDataTableOptions<TRow>): DataTableInstance<TRow> {
  const [sort, setSort] = useControllableState<DataTableSort | null>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });
  const [search, setSearchState] = useControllableState({
    value: searchProp,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  });
  const [page, setPageState] = useControllableState({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const [pageSize, setPageSizeState] = useControllableState({
    value: pageSizeProp,
    defaultValue: defaultPageSize,
    onChange: onPageSizeChange,
  });
  const [selection, setSelectionState] = useControllableState<
    readonly DataTableRowId[]
  >({
    value: selectionProp,
    defaultValue: defaultSelection,
    onChange: onSelectionChange as
      ((value: readonly DataTableRowId[]) => void) | undefined,
  });

  const columnsById = useMemo(() => {
    const map = new Map<string, DataTableColumn<TRow>>();
    for (const column of columns) map.set(column.id, column);
    return map;
  }, [columns]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (manualFiltering || query === "") return data;

    const searchable = columns.filter((c) => c.searchable !== false);
    return data.filter((row) =>
      searchable.some((column) =>
        toSearchText(column.accessor(row)).includes(query),
      ),
    );
  }, [data, columns, search, manualFiltering]);

  const sorted = useMemo(() => {
    if (manualSorting || sort === null) return filtered;

    const column = columnsById.get(sort.columnId);
    if (!column || column.sortable === false) return filtered;

    const compare = column.compare ?? compareValues;
    const direction = sort.direction === "asc" ? 1 : -1;

    /* Copied before sorting: `data` belongs to the caller and may be frozen. */
    return [...filtered].sort((rowA, rowB) => {
      const a = column.accessor(rowA);
      const b = column.accessor(rowB);

      /* Empty cells sink to the bottom in both directions — a descending sort should
         not bury the rows that actually have a value under a wall of blanks. */
      const nilOrder = compareNil(a, b);
      if (nilOrder !== null) return nilOrder;

      return compare(a, b) * direction;
    });
  }, [filtered, sort, columnsById, manualSorting]);

  const totalRowCount = manualPagination
    ? (rowCountProp ?? data.length)
    : data.length;
  const rowCount = manualPagination
    ? (rowCountProp ?? data.length)
    : sorted.length;
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize));

  /* Clamped rather than corrected through an effect: deleting the last row of the last
     page must not render an empty page for one frame before a state update fixes it. */
  const safePage = Math.min(Math.max(1, page), pageCount);

  const rows = useMemo(() => {
    const offset = (safePage - 1) * pageSize;
    const visible = manualPagination
      ? sorted
      : sorted.slice(offset, offset + pageSize);

    /* The index is absolute, not the position within the page. `getRowId={(row, i) => i}`
       is a normal thing to write when the data has no id of its own, and a per-page index
       would hand page 2 the same ids as page 1 — duplicate React keys, and a selection
       that leaks from one page to the other. */
    return visible.map((row, indexOnPage) => {
      const index = offset + indexOnPage;
      return { id: getRowId(row, index), row, index };
    });
  }, [sorted, safePage, pageSize, manualPagination, getRowId]);

  const setSearch = useCallback(
    (next: string) => {
      setSearchState(next);
      /* A narrower result set makes the current page number meaningless. */
      setPageState(1);
    },
    [setSearchState, setPageState],
  );

  const setPageSize = useCallback(
    (next: number) => {
      setPageSizeState(next);
      setPageState(1);
    },
    [setPageSizeState, setPageState],
  );

  const setPage = useCallback(
    (next: number) => setPageState(Math.max(1, Math.min(next, pageCount))),
    [setPageState, pageCount],
  );

  const toggleSort = useCallback(
    (columnId: string) => {
      const column = columnsById.get(columnId);
      if (!column || column.sortable === false) return;

      setSort((current) => {
        if (current?.columnId !== columnId)
          return { columnId, direction: "asc" };
        if (current.direction === "asc") return { columnId, direction: "desc" };
        return null;
      });
      setPageState(1);
    },
    [columnsById, setSort, setPageState],
  );

  const getSortDirection = useCallback(
    (columnId: string) => (sort?.columnId === columnId ? sort.direction : null),
    [sort],
  );

  const selectionSet = useMemo(() => new Set(selection), [selection]);
  const isSelected = useCallback(
    (id: DataTableRowId) => selectionSet.has(id),
    [selectionSet],
  );

  const toggleRow = useCallback(
    (id: DataTableRowId) => {
      setSelectionState((current) =>
        current.includes(id)
          ? current.filter((selected) => selected !== id)
          : [...current, id],
      );
    },
    [setSelectionState],
  );

  const pageIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const selectedOnPage = pageIds.filter((id) => selectionSet.has(id)).length;
  const allSelected = pageIds.length > 0 && selectedOnPage === pageIds.length;
  const someSelected = selectedOnPage > 0 && !allSelected;

  const toggleAll = useCallback(() => {
    setSelectionState((current) => {
      const onPage = new Set(pageIds);
      const everyOneSelected =
        pageIds.length > 0 && pageIds.every((id) => current.includes(id));

      /* Selection outside the current page is preserved either way: clearing a page
         should not silently drop rows the reader picked on another one. */
      return everyOneSelected
        ? current.filter((id) => !onPage.has(id))
        : [...current, ...pageIds.filter((id) => !current.includes(id))];
    });
  }, [pageIds, setSelectionState]);

  const setSelection = useCallback(
    (next: DataTableRowId[]) => setSelectionState(next),
    [setSelectionState],
  );

  return {
    rows,
    columns,
    sort,
    toggleSort,
    getSortDirection,
    search,
    setSearch,
    page: safePage,
    pageSize,
    pageCount,
    rowCount,
    totalRowCount,
    setPage,
    nextPage: () => setPage(safePage + 1),
    previousPage: () => setPage(safePage - 1),
    canPreviousPage: safePage > 1,
    canNextPage: safePage < pageCount,
    setPageSize,
    selection: [...selection],
    isSelected,
    toggleRow,
    toggleAll,
    setSelection,
    allSelected,
    someSelected,
    isEmpty: rows.length === 0,
    isFiltered: search.trim() !== "",
  };
}

/** Lowercased text used by the global search. */
function toSearchText(value: DataTableValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().toLowerCase();
  return String(value).toLowerCase();
}

/**
 * Orders empty cells last regardless of direction. Returns `null` when both values are
 * present, meaning the column's own comparison decides.
 */
function compareNil(a: DataTableValue, b: DataTableValue): number | null {
  const aEmpty = a === null || a === undefined;
  const bEmpty = b === null || b === undefined;
  if (!aEmpty && !bEmpty) return null;
  if (aEmpty && bEmpty) return 0;
  return aEmpty ? 1 : -1;
}

/**
 * Compares like a reader would: numbers numerically, dates chronologically, and text
 * with `numeric` collation so "item 10" lands after "item 9" rather than after "item 1".
 */
function compareValues(a: DataTableValue, b: DataTableValue): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
