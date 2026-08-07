"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type RadioGroupProps = ComponentProps<typeof BaseRadioGroup>;
export type RadioProps = ComponentProps<typeof BaseRadio.Root>;

/**
 * Groups radios into one choice. The group owns the value and the `name`, and gives
 * the radios their roving focus, so arrow keys move between options the way the
 * platform expects.
 *
 * Radios only make sense inside a group — a lone radio cannot be unchecked.
 *
 * @example
 * <RadioGroup name="plan" defaultValue="pro">
 *   <label className="flex items-center gap-2">
 *     <Radio value="free" /> <span>Free</span>
 *   </label>
 *   <label className="flex items-center gap-2">
 *     <Radio value="pro" /> <span>Pro</span>
 *   </label>
 * </RadioGroup>
 */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/** A single option. Requires `value`, which is what the group reports when selected. */
export function Radio({ className, ...props }: RadioProps) {
  return (
    <BaseRadio.Root
      data-slot="radio"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface",
        "transition-colors outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-checked:border-accent data-checked:bg-accent",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseRadio.Indicator
        data-slot="radio-indicator"
        className="size-2 rounded-full bg-accent-fg data-unchecked:hidden"
      />
    </BaseRadio.Root>
  );
}
