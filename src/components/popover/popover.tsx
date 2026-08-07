"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type PopoverProps = ComponentProps<typeof BasePopover.Root>;

/**
 * Floating panel anchored to a trigger, for content you can interact with — a form, a
 * set of links, a colour picker.
 *
 * Unlike a `Dialog` it does not trap focus or block the page, so use it when the rest
 * of the interface should stay reachable. For a plain hint, use a `Tooltip`.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger render={<Button variant="outline">Share</Button>} />
 *   <PopoverContent>
 *     <PopoverTitle>Share this project</PopoverTitle>
 *     <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
 *   </PopoverContent>
 * </Popover>
 */
export function Popover(props: PopoverProps) {
  return <BasePopover.Root {...props} />;
}

export function PopoverTrigger(
  props: ComponentProps<typeof BasePopover.Trigger>,
) {
  return <BasePopover.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverClose(props: ComponentProps<typeof BasePopover.Close>) {
  return <BasePopover.Close data-slot="popover-close" {...props} />;
}

export type PopoverContentProps = ComponentProps<typeof BasePopover.Popup>;

export function PopoverContent({
  className,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        data-slot="popover-positioner"
        sideOffset={6}
        className="z-50"
      >
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "flex w-72 flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-fg shadow-lg",
            "transition-[opacity,transform] duration-150",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({
  className,
  ...props
}: ComponentProps<typeof BasePopover.Title>) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      className={cn("text-sm leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: ComponentProps<typeof BasePopover.Description>) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}
