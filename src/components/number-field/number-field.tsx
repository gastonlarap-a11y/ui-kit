"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";
import { MinusIcon, PlusIcon } from "../../lib/icons.js";

export type NumberFieldProps = ComponentProps<typeof BaseNumberField.Root>;

/**
 * Numeric input with stepper buttons. Base UI handles the parsing, clamping to
 * `min`/`max`, keyboard stepping with the arrow keys and locale-aware formatting —
 * the parts a bare `<input type="number">` gets wrong.
 *
 * Uncontrolled by default; pass `value` with `onValueChange` to drive it. The value is
 * `null` when the field is empty, not `0`.
 *
 * @example
 * <Field name="seats">
 *   <FieldLabel>Seats</FieldLabel>
 *   <NumberField defaultValue={1} min={1} max={20} />
 * </Field>
 */
export function NumberField({ className, ...props }: NumberFieldProps) {
  return (
    <BaseNumberField.Root
      data-slot="number-field"
      className={cn("w-full", className)}
      {...props}
    >
      <BaseNumberField.Group
        data-slot="number-field-group"
        className={cn(
          "flex h-10 w-full items-center overflow-hidden rounded-md border border-border bg-surface",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        )}
      >
        <BaseNumberField.Decrement
          data-slot="number-field-decrement"
          className={stepperClasses("border-r")}
        >
          <MinusIcon className="size-4" />
        </BaseNumberField.Decrement>

        <BaseNumberField.Input
          data-slot="number-field-input"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-center text-sm text-fg tabular-nums outline-none"
        />

        <BaseNumberField.Increment
          data-slot="number-field-increment"
          className={stepperClasses("border-l")}
        >
          <PlusIcon className="size-4" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}

/** Both steppers are identical apart from which side carries the divider. */
function stepperClasses(side: string): string {
  return cn(
    "flex h-full w-10 shrink-0 items-center justify-center border-border text-fg-muted",
    "transition-colors hover:bg-muted hover:text-fg",
    "disabled:pointer-events-none disabled:opacity-50",
    side,
  );
}
