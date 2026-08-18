"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";
import { CheckIcon } from "../../lib/icons.js";
import {
  itemClasses,
  popupScrollClasses,
  popupSurfaceClasses,
} from "../../lib/popup-classes.js";

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
          /* Scrolls like the other popups now: a menu long enough to run past the
             viewport used to have no way to reach its last item. */
          className={cn(
            popupSurfaceClasses,
            popupScrollClasses,
            "min-w-44",
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
