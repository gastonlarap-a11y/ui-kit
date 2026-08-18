"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const toggleVariants = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center rounded-md font-medium text-fg",
    "transition-colors duration-(--ui-duration-fast) ease-out outline-none",
    "hover:bg-muted",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "data-pressed:bg-accent data-pressed:text-accent-fg",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
  ],
  variants: {
    /** Square, and the same 32/36/44px as every other control at that size. */
    size: {
      sm: "size-8 text-sm",
      md: "size-9 text-sm",
      lg: "size-11 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ToggleProps
  extends
    ComponentProps<typeof BaseToggle>,
    VariantProps<typeof toggleVariants> {}

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
export function Toggle({ className, size, ...props }: ToggleProps) {
  return (
    <BaseToggle
      data-slot="toggle"
      /* Base UI lets `className` be a function of the toggle's state; resolving it here
         keeps that API instead of silently downgrading it to a plain string. */
      className={(state) =>
        toggleVariants({
          size,
          className:
            typeof className === "function" ? className(state) : className,
        })
      }
      {...props}
    />
  );
}
