import type { HTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "../../lib/cn.js";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../lib/icons.js";
import { Button } from "../button/button.js";

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "onChange"
> {
  /** 1-based, like the numbers the reader sees. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** How many numbers to keep on each side of the current one. Defaults to `1`. */
  siblingCount?: number;
  /** Adds the jump-to-first and jump-to-last controls. */
  showEdges?: boolean;
  /** Accessible name of the navigation landmark. Change it if the page has two. */
  label?: string;
  ref?: Ref<HTMLElement>;
}

/**
 * Page navigation. Fully controlled: it renders the `page` you give it and reports
 * where the reader wants to go.
 *
 * Disabled controls carry `aria-disabled` rather than `disabled`, so they keep their
 * place in the tab order — a reader who tabs to "Next" and reaches the last page does
 * not have focus yanked back to the top of the document.
 *
 * `DataTable` renders this for you; use it directly for lists, grids or anything else
 * that pages.
 *
 * @example
 * <Pagination page={page} pageCount={12} onPageChange={setPage} />
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  showEdges = false,
  label = "Pagination",
  className,
  ...props
}: PaginationProps) {
  const canPrevious = page > 1;
  const canNext = page < pageCount;

  function goTo(target: number) {
    const clamped = Math.max(1, Math.min(target, pageCount));
    if (clamped !== page) onPageChange(clamped);
  }

  return (
    <nav
      data-slot="pagination"
      aria-label={label}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {showEdges ? (
        <PaginationControl
          slot="first"
          label="First page"
          disabled={!canPrevious}
          onActivate={() => goTo(1)}
        >
          <ChevronFirstIcon className="size-4" />
        </PaginationControl>
      ) : null}

      <PaginationControl
        slot="previous"
        label="Previous page"
        disabled={!canPrevious}
        onActivate={() => goTo(page - 1)}
      >
        <ChevronLeftIcon className="size-4" />
      </PaginationControl>

      {buildRange(page, pageCount, siblingCount).map((entry, index) =>
        entry === "gap" ? (
          /* Decorative: the gap says nothing a screen reader needs, and the page
             numbers around it already convey that the list is not contiguous. */
          <span
            key={`gap-${index}`}
            data-slot="pagination-gap"
            aria-hidden
            className="px-1 text-sm text-fg-muted"
          >
            …
          </span>
        ) : (
          <Button
            key={entry}
            data-slot="pagination-page"
            size="sm"
            variant={entry === page ? "solid" : "ghost"}
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            className="min-w-8 tabular-nums"
            onClick={() => goTo(entry)}
          >
            {entry}
          </Button>
        ),
      )}

      <PaginationControl
        slot="next"
        label="Next page"
        disabled={!canNext}
        onActivate={() => goTo(page + 1)}
      >
        <ChevronRightIcon className="size-4" />
      </PaginationControl>

      {showEdges ? (
        <PaginationControl
          slot="last"
          label="Last page"
          disabled={!canNext}
          onActivate={() => goTo(pageCount)}
        >
          <ChevronLastIcon className="size-4" />
        </PaginationControl>
      ) : null}
    </nav>
  );
}

interface PaginationControlProps {
  slot: string;
  label: string;
  disabled: boolean;
  onActivate: () => void;
  children: ReactNode;
}

/** The four arrow controls, identical apart from their glyph and destination. */
function PaginationControl({
  slot,
  label,
  disabled,
  onActivate,
  children,
}: PaginationControlProps) {
  return (
    <Button
      data-slot={`pagination-${slot}`}
      size="sm"
      variant="ghost"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
      onClick={() => {
        if (!disabled) onActivate();
      }}
    >
      {children}
    </Button>
  );
}

/**
 * The page numbers to render, with `"gap"` where the sequence breaks.
 *
 * The window keeps a constant width, so the control does not resize as the reader pages
 * through it — a moving target is hard to click twice in a row.
 */
function buildRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | "gap")[] {
  /* First, last, the current page, its siblings and one slot for each gap. Below that
     total there is nothing to collapse and every page gets a number. */
  const windowSize = siblingCount * 2 + 5;
  if (pageCount <= windowSize) {
    return range(1, pageCount);
  }

  /* Near an edge the window would waste a slot on a gap that hides a single number, so
     it grows inwards instead — which is also what keeps the width constant. */
  const edgeSpan = siblingCount * 2 + 3;

  if (page <= edgeSpan - 1) {
    return [...range(1, edgeSpan), "gap", pageCount];
  }
  if (page >= pageCount - edgeSpan + 2) {
    return [1, "gap", ...range(pageCount - edgeSpan + 1, pageCount)];
  }
  return [
    1,
    "gap",
    ...range(page - siblingCount, page + siblingCount),
    "gap",
    pageCount,
  ];
}

/** Inclusive integer range. */
function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}
