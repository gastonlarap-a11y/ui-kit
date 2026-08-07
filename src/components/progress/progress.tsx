"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";

export interface ProgressProps extends ComponentProps<
  typeof BaseProgress.Root
> {
  /** Shown above the bar. Also becomes the accessible name. */
  label?: ReactNode;
  /** Renders the current percentage next to the label. */
  showValue?: boolean;
}

/**
 * Determinate progress towards a known total. Pass `value={null}` for work whose length
 * is unknown, which Base UI exposes as indeterminate rather than faking a percentage.
 *
 * Always give it a `label`: a bar with no name tells a screen reader nothing about what
 * is progressing.
 *
 * @example
 * <Progress label="Uploading" value={62} />
 * <Progress label="Deploying" value={null} />
 */
export function Progress({
  className,
  label,
  showValue,
  ...props
}: ProgressProps) {
  return (
    <BaseProgress.Root
      data-slot="progress"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2 text-sm">
          {label ? (
            <BaseProgress.Label
              data-slot="progress-label"
              className="font-medium text-fg"
            >
              {label}
            </BaseProgress.Label>
          ) : null}
          {showValue ? (
            <BaseProgress.Value
              data-slot="progress-value"
              className="text-fg-muted tabular-nums"
            />
          ) : null}
        </div>
      )}
      <BaseProgress.Track
        data-slot="progress-track"
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className="h-full bg-accent transition-[width] duration-300"
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
