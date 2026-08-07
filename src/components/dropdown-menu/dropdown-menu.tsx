"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";
import { CheckIcon } from "../../lib/icons.js";

export type DropdownMenuProps = ComponentProps<typeof BaseMenu.Root>;

/**
 * A list of actions triggered by a button. Base UI supplies the menu semantics,
 * typeahead and arrow-key navigation.
 *
 * Menus are for *actions*. To choose a value that gets submitted with a form, use a
 * `Select` — it exposes listbox semantics instead.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
 *   <DropdownMenuContent>
 *     <DropdownMenuItem onClick={rename}>Rename</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem onClick={remove}>Delete</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
export function DropdownMenu(props: DropdownMenuProps) {
  return <BaseMenu.Root {...props} />;
}

export function DropdownMenuTrigger(
  props: ComponentProps<typeof BaseMenu.Trigger>,
) {
  return <BaseMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export type DropdownMenuContentProps = ComponentProps<typeof BaseMenu.Popup>;

export function DropdownMenuContent({
  className,
  children,
  ...props
}: DropdownMenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        data-slot="dropdown-menu-positioner"
        sideOffset={6}
        className="z-50"
      >
        <BaseMenu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "min-w-44 rounded-md border border-border bg-surface p-1 text-fg shadow-lg",
            "transition-[opacity,transform] duration-150",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

const itemClasses = [
  "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
  "data-highlighted:bg-muted data-highlighted:text-fg",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
];

export function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      data-slot="dropdown-menu-item"
      className={cn(itemClasses, className)}
      {...props}
    />
  );
}

/** An item that carries its own on/off state, such as "Show archived". */
export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemClasses, "justify-between", className)}
      {...props}
    >
      {children}
      <BaseMenu.CheckboxItemIndicator className="text-accent">
        <CheckIcon className="size-4" />
      </BaseMenu.CheckboxItemIndicator>
    </BaseMenu.CheckboxItem>
  );
}

export function DropdownMenuGroup(
  props: ComponentProps<typeof BaseMenu.Group>,
) {
  return <BaseMenu.Group data-slot="dropdown-menu-group" {...props} />;
}

export function DropdownMenuGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      data-slot="dropdown-menu-group-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-fg-muted", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-border", className)}
    />
  );
}
