"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type TooltipProps = ComponentProps<typeof BaseTooltip.Root>;

/**
 * A short hint shown on hover or focus. Tooltips are supplementary by definition — a
 * control must still make sense without one, because they never appear on touch.
 *
 * Never put interactive content inside: there is no way to reach it with a keyboard.
 * Use a `Popover` for that.
 *
 * @example
 * <Tooltip>
 *   <TooltipTrigger render={<Button variant="ghost">Archive</Button>} />
 *   <TooltipContent>Moves the project out of your active list</TooltipContent>
 * </Tooltip>
 */
export function Tooltip(props: TooltipProps) {
  return <BaseTooltip.Root {...props} />;
}

export function TooltipTrigger(
  props: ComponentProps<typeof BaseTooltip.Trigger>,
) {
  return <BaseTooltip.Trigger data-slot="tooltip-trigger" {...props} />;
}

export type TooltipContentProps = ComponentProps<typeof BaseTooltip.Popup>;

/** Bundles the portal and positioner so consumers only write the text. */
export function TooltipContent({
  className,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        data-slot="tooltip-positioner"
        sideOffset={6}
        className="z-50"
      >
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            "max-w-64 rounded-md bg-fg px-2.5 py-1.5 text-xs text-canvas shadow-md",
            "transition-[opacity,transform] duration-150",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

/**
 * Optional. Wrap a subtree so that once one tooltip has opened, its neighbours skip the
 * delay — the behaviour you expect from a toolbar.
 */
export function TooltipProvider(
  props: ComponentProps<typeof BaseTooltip.Provider>,
) {
  return <BaseTooltip.Provider {...props} />;
}
