"use client";

import { Meter as BaseMeter } from "@base-ui/react/meter";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";

export interface MeterProps extends ComponentProps<typeof BaseMeter.Root> {
  /** Shown above the track. Also becomes the accessible name. */
  label?: ReactNode;
  /** Renders the formatted value next to the label. */
  showValue?: boolean;
}

/**
 * A static measurement inside a known range: disk used, seats taken, budget spent.
 *
 * Not the same as `Progress`, and the difference is not visual. `Progress` says "this
 * task is 60% done and will finish"; `Meter` says "60% of this capacity is in use", which
 * is a fact about right now with no implied ending. A screen reader announces them
 * differently, so picking the wrong one is a real mistake.
 *
 * `format` takes `Intl.NumberFormat` options, which is how you get "12.4 GB" instead
 * of "24".
 *
 * @example
 * <Meter label="Storage used" showValue value={24} />
 *
 * @example
 * <Meter
 *   label="Storage used"
 *   showValue
 *   value={62}
 *   format={{ style: "unit", unit: "gigabyte" }}
 *   max={100}
 * />
 */
export function Meter({ className, label, showValue, ...props }: MeterProps) {
  return (
    <BaseMeter.Root
      data-slot="meter"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {label || showValue ? (
        <div className="flex items-center justify-between gap-2 text-sm">
          {label ? (
            <BaseMeter.Label
              data-slot="meter-label"
              className="font-medium text-fg"
            >
              {label}
            </BaseMeter.Label>
          ) : null}
          {showValue ? (
            <BaseMeter.Value
              data-slot="meter-value"
              className="text-fg-muted tabular-nums"
            />
          ) : null}
        </div>
      ) : null}

      <BaseMeter.Track
        data-slot="meter-track"
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <BaseMeter.Indicator
          data-slot="meter-indicator"
          className="h-full bg-accent transition-[width] duration-300"
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
