"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type ToggleProps = ComponentProps<typeof BaseToggle>;

/**
 * A button that stays pressed. Base UI exposes the state as `aria-pressed`, which is what
 * separates it from a `Checkbox`: this is an action you keep switched on, not a value you
 * submit with a form.
 *
 * It has no visible label of its own when it holds only an icon — give it an `aria-label`
 * or the control is nameless.
 *
 * @example
 * <Toggle aria-label="Bold" defaultPressed>
 *   <BoldIcon />
 * </Toggle>
 */
export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <BaseToggle
      data-slot="toggle"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-medium text-fg",
        "transition-colors duration-150 ease-out outline-none",
        "hover:bg-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-pressed:bg-accent data-pressed:text-accent-fg",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
