"use client";

import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type ToolbarProps = ComponentProps<typeof BaseToolbar.Root>;

/**
 * A row of controls that behaves as one tab stop: arrow keys move between the items and
 * focus wraps at the ends. Ten buttons in a toolbar cost one tab, not ten.
 *
 * Give it an `aria-label` — the controls inside name themselves, the set does not.
 *
 * Use `ToolbarButton` for its items rather than a bare `Button`: that is what enrolls
 * them in the roving focus. Composing one through `render` is supported and the composed
 * component keeps its own appearance — the toolbar contributes only the behaviour, so a
 * `danger` button stays red instead of inheriting the toolbar's text color.
 *
 * @example
 * <Toolbar aria-label="Text formatting">
 *   <ToolbarButton render={<Button size="sm" variant="ghost">Bold</Button>} />
 *   <ToolbarSeparator />
 *   <ToolbarButton render={<Button size="sm" variant="ghost">Link</Button>} />
 * </Toolbar>
 */
export function Toolbar({ className, ...props }: ToolbarProps) {
  return (
    <BaseToolbar.Root
      data-slot="toolbar"
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border bg-surface p-1",
        "data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarButton({
  className,
  ...props
}: ComponentProps<typeof BaseToolbar.Button>) {
  return (
    <BaseToolbar.Button
      data-slot="toolbar-button"
      className={composedClassName(props.render, toolbarItemClasses, className)}
      {...props}
    />
  );
}

export function ToolbarLink({
  className,
  ...props
}: ComponentProps<typeof BaseToolbar.Link>) {
  return (
    <BaseToolbar.Link
      data-slot="toolbar-link"
      className={composedClassName(
        props.render,
        [
          "inline-flex h-8 shrink-0 items-center rounded-md px-3 text-sm font-medium text-fg underline-offset-4",
          "transition-colors outline-none hover:underline",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        ],
        className,
      )}
      {...props}
    />
  );
}

const toolbarItemClasses = [
  "inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-fg",
  "transition-colors duration-150 ease-out outline-none hover:bg-muted",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
];

/**
 * Drops the toolbar's own styling when the item is composed with another component
 * through `render`.
 *
 * Base UI merges the two class strings, and `tailwind-merge` never sees the composed
 * component's classes, so a toolbar item rendering a `danger` Button ended up with the
 * toolbar's `text-fg` over the button's red background — a 3.26:1 contrast failure that
 * axe caught. When you compose, the composed component owns its own appearance; the
 * toolbar only contributes the roving-focus behaviour.
 */
function composedClassName(
  render: unknown,
  own: string[],
  className: ComponentProps<typeof BaseToolbar.Button>["className"],
) {
  if (render !== undefined) {
    return typeof className === "string" ? className : undefined;
  }
  return cn(own, typeof className === "string" ? className : undefined);
}

/** Groups related controls so a screen reader hears where one set ends. */
export function ToolbarGroup({
  className,
  ...props
}: ComponentProps<typeof BaseToolbar.Group>) {
  return (
    <BaseToolbar.Group
      data-slot="toolbar-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export function ToolbarSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseToolbar.Separator>) {
  return (
    <BaseToolbar.Separator
      data-slot="toolbar-separator"
      className={cn(
        "mx-1 shrink-0 bg-border",
        "data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:w-px",
        "data-[orientation=vertical]:h-px data-[orientation=vertical]:w-5",
        className,
      )}
      {...props}
    />
  );
}
