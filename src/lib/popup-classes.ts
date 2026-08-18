/**
 * The shared vocabulary of floating surfaces: the popup a control opens, and the rows
 * inside it.
 *
 * `Combobox`, `Autocomplete`, `Select` and `DropdownMenu` all render the same anatomy —
 * a list of rows on a raised surface — and a user has no way of telling which one a
 * given field is. Letting each keep its own copy is how four things that should look
 * identical slowly stop being identical; `Select` and `DropdownMenu` had already drifted
 * into byte-for-byte duplicates of the strings below.
 *
 * `Dialog`, `Drawer`, `Popover`, `Toast` and `Tooltip` deliberately do **not** use these.
 * Their radius, padding, width and exit animation differ for real reasons, and forcing
 * them through one string would mean overriding more than it shares.
 *
 * Internal: never exported from `src/index.ts`.
 */

export const inputGroupClasses = [
  "flex h-9 w-full items-center gap-1 rounded-md border border-border-strong bg-surface px-3 shadow-sm",
  "transition-[border-color,box-shadow] duration-(--ui-duration-fast) ease-out",
  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  "data-invalid:border-danger",
];

export const textInputClasses =
  "h-full min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted-fg";

export const iconButtonClasses = [
  "flex size-6 shrink-0 items-center justify-center rounded-sm text-fg-muted",
  "transition-colors duration-(--ui-duration-fast) ease-out outline-none hover:text-fg",
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
];

/** What a popup is made of, with no opinion about how big it is. */
export const popupSurfaceClasses = [
  "rounded-md border border-border bg-surface-overlay p-1 text-fg shadow-lg",
  "transition-[opacity,transform] duration-(--ui-duration-fast) ease-out",
  "data-ending-style:scale-95 data-ending-style:opacity-0",
  "data-starting-style:scale-95 data-starting-style:opacity-0",
];

/**
 * Caps the height against the space the positioner reports and scrolls the rest.
 *
 * The platform's own scrollbar is a thick grey slab in the middle of an otherwise
 * considered popup, so it is drawn thin and in the kit's neutrals instead.
 */
export const popupScrollClasses = [
  "max-h-[min(24rem,var(--available-height))] overflow-y-auto",
  "scrollbar-thin scrollbar-thumb-border-strong scrollbar-track-transparent",
];

/** A list anchored to the control that opened it: never narrower than its trigger. */
export const popupClasses = [
  "min-w-[var(--anchor-width)]",
  ...popupScrollClasses,
  ...popupSurfaceClasses,
];

export const itemClasses = [
  "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
  "data-highlighted:bg-muted data-highlighted:text-fg",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
];

export const emptyClasses = "px-2 py-3 text-center text-sm text-fg-muted";

export const groupLabelClasses =
  "px-2 py-1.5 text-xs font-medium text-fg-muted";
