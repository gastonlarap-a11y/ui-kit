"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type SwitchProps = ComponentProps<typeof BaseSwitch.Root>;

/**
 * Toggles a setting that takes effect immediately. If the change only applies after
 * the user submits a form, use a `Checkbox` instead — a switch implies it already
 * happened.
 *
 * Uncontrolled by default; pass `checked` with `onCheckedChange` to drive it.
 *
 * @example
 * <label className="flex items-center gap-2">
 *   <Switch name="notifications" defaultChecked />
 *   <span>Email notifications</span>
 * </label>
 */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-border bg-muted p-0.5",
        "transition-colors outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-checked:border-accent data-checked:bg-accent",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          "size-4.5 rounded-full bg-surface shadow-sm transition-transform",
          "data-checked:translate-x-4",
        )}
      />
    </BaseSwitch.Root>
  );
}
