"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../../lib/cn.js";
import { CheckIcon, ChevronDownIcon } from "../../lib/icons.js";
import { itemClasses, popupClasses } from "../../lib/popup-classes.js";

export type SelectProps = ComponentProps<typeof BaseSelect.Root>;

/**
 * Choose one option from a list. Base UI supplies the listbox semantics, typeahead,
 * keyboard navigation and popup positioning.
 *
 * Uncontrolled by default; pass `value` with `onValueChange` to drive it, and `name`
 * to submit it with a form.
 *
 * The trigger shows the raw value, so `value="pro"` displays as `pro`. Pass `items`
 * mapping values to labels whenever the stored value is an id or a code rather than
 * something readable.
 *
 * @example
 * <Select name="plan" defaultValue="pro">
 *   <SelectTrigger placeholder="Choose a plan" />
 *   <SelectContent>
 *     <SelectItem value="free">Free</SelectItem>
 *     <SelectItem value="pro">Pro</SelectItem>
 *   </SelectContent>
 * </Select>
 */
export function Select(props: SelectProps) {
  return <BaseSelect.Root {...props} />;
}

export const selectTriggerVariants = tv({
  base: [
    "flex w-full items-center justify-between gap-2 rounded-md border border-border-strong bg-surface text-fg shadow-sm",
    "transition-colors duration-(--ui-duration-fast) ease-out outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "data-invalid:border-danger",
  ],
  variants: {
    /** The same 32/36/44px as `Input`, so the two line up in a form row. */
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-9 px-3 text-sm",
      lg: "h-11 px-4 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SelectTriggerProps
  extends
    ComponentProps<typeof BaseSelect.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  /** Shown while nothing is selected. */
  placeholder?: string;
}

export function SelectTrigger({
  className,
  size,
  placeholder,
  ...props
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={(state) =>
        selectTriggerVariants({
          size,
          className:
            typeof className === "function" ? className(state) : className,
        })
      }
      {...props}
    >
      {/* Base UI renders the label itself and flags the empty state, so there is no
          need to stringify the value by hand — which would print "[object Object]"
          for the object shapes the `items` prop accepts. */}
      <BaseSelect.Value
        data-slot="select-value"
        className="truncate data-placeholder:text-muted-fg"
        placeholder={placeholder}
      />
      <BaseSelect.Icon
        data-slot="select-icon"
        className="shrink-0 text-fg-muted"
      >
        <ChevronDownIcon className="size-4" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export type SelectContentProps = ComponentProps<typeof BaseSelect.Popup>;

/** Bundles the portal, positioner and list so consumers only compose the items. */
export function SelectContent({
  className,
  children,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        data-slot="select-positioner"
        sideOffset={4}
        className="z-50 outline-none"
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(popupClasses, className)}
          {...props}
        >
          <BaseSelect.List data-slot="select-list">{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type SelectItemProps = ComponentProps<typeof BaseSelect.Item>;

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      /* `justify-between` on top of the shared item classes: a select item puts its
         check on the trailing edge, where a menu item's icon leads. */
      className={cn(itemClasses, "justify-between", className)}
      {...props}
    >
      <BaseSelect.ItemText data-slot="select-item-text">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator
        data-slot="select-item-indicator"
        className="text-accent"
      >
        <CheckIcon className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export function SelectGroup(props: ComponentProps<typeof BaseSelect.Group>) {
  return <BaseSelect.Group data-slot="select-group" {...props} />;
}

export function SelectGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-group-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-fg-muted", className)}
      {...props}
    />
  );
}
