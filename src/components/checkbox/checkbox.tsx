"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps } from "react";

import { CheckIcon } from "../../lib/icons.js";
import { cn } from "../../lib/cn.js";

export type CheckboxProps = ComponentProps<typeof BaseCheckbox.Root>;

/**
 * Binary choice. Renders a real focusable control with the checked state exposed to
 * assistive technology, and participates in form submission through `name`.
 *
 * Uncontrolled by default — pass `checked` with `onCheckedChange` to drive it. Set
 * `indeterminate` for the "some but not all" state of a parent checkbox.
 *
 * It has no built-in label: put it inside a `Field` with a `FieldLabel`, or wrap both
 * in a `<label>`.
 *
 * @example
 * <label className="flex items-center gap-2">
 *   <Checkbox name="terms" />
 *   <span>I accept the terms</span>
 * </label>
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cn(
        "relative flex size-5 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface",
        /* The box stays 20px because that is what reads right next to 14px text, but the
           pointer target is grown to the 24px WCAG 2.2 SC 2.5.8 asks for, with a
           pseudo-element that moves nothing around it.
           Sized outright rather than as a negative inset: an absolutely positioned
           pseudo-element is placed against the *padding* box, so an inset would silently
           lose the border width and land at 22px.
           axe cannot check this — `target-size` measures the element, not its
           pseudo-elements — so the guarantee is `PointerTargetReachesTwentyFourPixels`. */
        "before:absolute before:top-1/2 before:left-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2",
        "transition-colors duration-(--ui-duration-fast) ease-out outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-checked:border-accent data-checked:bg-accent data-checked:text-accent-fg",
        "data-indeterminate:border-accent data-indeterminate:bg-accent data-indeterminate:text-accent-fg",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator
        data-slot="checkbox-indicator"
        className="flex data-unchecked:hidden"
      >
        <CheckIcon className="size-3.5" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
