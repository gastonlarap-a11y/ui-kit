"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";

export interface SliderProps extends ComponentProps<typeof BaseSlider.Root> {
  /** Shown above the track. Also becomes the accessible name. */
  label?: ReactNode;
  /** Renders the current value next to the label. */
  showValue?: boolean;
}

/**
 * Pick a number from a range by dragging. Base UI supplies the pointer maths, the
 * keyboard stepping and the ARIA state; the thumb is a real focusable control.
 *
 * Pass an array to `defaultValue` for a range, and one `SliderThumb` per entry with its
 * `index`. Uncontrolled by default — pair `value` with `onValueChange` to drive it.
 *
 * A slider is the wrong control when the exact number matters: use a `NumberField`. Use
 * this when the *relative* position is the point, like volume or opacity.
 *
 * @example
 * <Slider label="Volume" showValue defaultValue={40} />
 *
 * @example
 * // Range: two thumbs over one track.
 * <Slider label="Price" defaultValue={[20, 80]}>
 *   <SliderThumb index={0} aria-label="Minimum" />
 *   <SliderThumb index={1} aria-label="Maximum" />
 * </Slider>
 */
export function Slider({
  className,
  label,
  showValue,
  children,
  ...props
}: SliderProps) {
  return (
    <BaseSlider.Root
      data-slot="slider"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {label || showValue ? (
        <div className="flex items-center justify-between gap-2 text-sm">
          {label ? (
            <BaseSlider.Label
              data-slot="slider-label"
              className="font-medium text-fg"
            >
              {label}
            </BaseSlider.Label>
          ) : null}
          {showValue ? (
            <BaseSlider.Value
              data-slot="slider-value"
              className="text-fg-muted tabular-nums"
            />
          ) : null}
        </div>
      ) : null}

      <BaseSlider.Control
        data-slot="slider-control"
        className="flex w-full touch-none items-center py-2 select-none"
      >
        <BaseSlider.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full rounded-full bg-muted"
        >
          <BaseSlider.Indicator
            data-slot="slider-indicator"
            className="absolute rounded-full bg-accent"
          />
          {/* A single default thumb, so the common case needs no children at all.
              Ranges pass their own and this is replaced. */}
          {children ?? <SliderThumb />}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

/** One draggable handle. Ranges need an `index` matching its slot in the value array. */
export function SliderThumb({
  className,
  ...props
}: ComponentProps<typeof BaseSlider.Thumb>) {
  return (
    <BaseSlider.Thumb
      data-slot="slider-thumb"
      className={cn(
        "size-4 rounded-full border-2 border-accent bg-surface shadow-sm",
        "transition-[box-shadow] duration-150 outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
