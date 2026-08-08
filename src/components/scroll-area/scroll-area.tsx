"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export interface ScrollAreaProps extends ComponentProps<
  typeof BaseScrollArea.Root
> {
  /** Adds the horizontal scrollbar too. Off by default. */
  horizontal?: boolean;
}

/**
 * A scrollable region with scrollbars that look the same on every platform, instead of
 * macOS overlay bars in one place and thick Windows bars in another.
 *
 * It does not replace the platform's scrolling — wheel, touch, keyboard and the browser's
 * own scroll anchoring all keep working; only the bar is drawn by the component.
 *
 * Give the root a height, or there is nothing to scroll.
 *
 * @example
 * <ScrollArea className="h-64">
 *   <div className="flex flex-col gap-2 p-4">…</div>
 * </ScrollArea>
 */
export function ScrollArea({
  className,
  children,
  horizontal = false,
  ...props
}: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className="size-full overscroll-contain rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <BaseScrollArea.Content data-slot="scroll-area-content">
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>

      <ScrollAreaScrollbar orientation="vertical" />
      {horizontal ? <ScrollAreaScrollbar orientation="horizontal" /> : null}
      {horizontal ? (
        <BaseScrollArea.Corner
          data-slot="scroll-area-corner"
          className="bg-muted"
        />
      ) : null}
    </BaseScrollArea.Root>
  );
}

function ScrollAreaScrollbar({
  orientation,
}: {
  orientation: "vertical" | "horizontal";
}) {
  return (
    <BaseScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none rounded-full bg-muted/60 p-0.5 select-none",
        "opacity-0 transition-opacity delay-300 duration-150",
        /* Visible while scrolling or hovering, invisible otherwise — a permanent bar
           is chrome the reader did not ask for. */
        "data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:opacity-100 data-scrolling:delay-0",
        orientation === "vertical" ? "w-2" : "h-2 flex-col",
      )}
    >
      <BaseScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className="flex-1 rounded-full bg-fg-muted/50"
      />
    </BaseScrollArea.Scrollbar>
  );
}
