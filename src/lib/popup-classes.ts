/**
 * Class strings shared by the two typeahead controls, `Combobox` and `Autocomplete`.
 *
 * They render the same anatomy — an input group that opens a filtered popup — and a user
 * has no way of telling which one a given field is. Letting each component keep its own
 * copy is how two controls that should look identical slowly stop being identical.
 *
 * Internal: never exported from `src/index.ts`.
 */

export const inputGroupClasses = [
  "flex h-9 w-full items-center gap-1 rounded-md border border-border bg-surface px-3 shadow-sm",
  "transition-[border-color,box-shadow] duration-150 ease-out",
  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  "data-invalid:border-danger",
];

export const textInputClasses =
  "h-full min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted-fg";

export const iconButtonClasses = [
  "flex size-6 shrink-0 items-center justify-center rounded-sm text-fg-muted",
  "transition-colors outline-none hover:text-fg",
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
];

export const popupClasses = [
  "max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto",
  "rounded-md border border-border bg-surface p-1 text-fg shadow-lg",
  "transition-[opacity,transform] duration-150",
  "data-ending-style:scale-95 data-ending-style:opacity-0",
  "data-starting-style:scale-95 data-starting-style:opacity-0",
];

export const itemClasses = [
  "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
  "data-highlighted:bg-muted data-highlighted:text-fg",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
];

export const emptyClasses = "px-2 py-3 text-center text-sm text-fg-muted";

export const groupLabelClasses =
  "px-2 py-1.5 text-xs font-medium text-fg-muted";
