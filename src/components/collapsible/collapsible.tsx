"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type CollapsibleProps = ComponentProps<typeof BaseCollapsible.Root>;

/**
 * One section that shows and hides. It is the `Accordion` without the group: no shared
 * state, no "only one open at a time".
 *
 * Use it for a single "show more"; use `Accordion` when several sections compete for the
 * same space.
 *
 * The panel animates from `--collapsible-panel-height`, which Base UI measures for you —
 * `height: auto` cannot be transitioned.
 *
 * @example
 * <Collapsible>
 *   <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
 *   <CollapsiblePanel>…</CollapsiblePanel>
 * </Collapsible>
 */
export function Collapsible({ className, ...props }: CollapsibleProps) {
  return (
    <BaseCollapsible.Root
      data-slot="collapsible"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

export function CollapsibleTrigger({
  className,
  ...props
}: ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "flex cursor-default items-center gap-2 rounded-md text-sm font-medium text-fg",
        "transition-colors outline-none hover:text-fg-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function CollapsiblePanel({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      className={cn(
        "overflow-hidden text-sm text-fg-muted",
        "h-[var(--collapsible-panel-height)] transition-[height] duration-200",
        "data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="pt-2">{children}</div>
    </BaseCollapsible.Panel>
  );
}
