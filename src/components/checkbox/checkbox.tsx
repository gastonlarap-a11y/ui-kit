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
        "flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-surface",
        "transition-colors outline-none",
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
