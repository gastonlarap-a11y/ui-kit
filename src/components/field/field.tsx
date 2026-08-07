"use client";

import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type FieldProps = ComponentProps<typeof BaseField.Root>;

/**
 * Groups a label, control, description and error message into one accessible unit.
 * Base UI generates the ids and the `aria-describedby` / `aria-invalid` wiring, which
 * is the part hand-rolled form fields almost always get wrong.
 */
export function Field({ className, ...props }: FieldProps) {
  return (
    <BaseField.Root
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

export function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof BaseField.Label>) {
  return (
    <BaseField.Label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium text-fg data-disabled:opacity-50",
        "data-invalid:text-danger",
        className,
      )}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof BaseField.Description>) {
  return (
    <BaseField.Description
      data-slot="field-description"
      className={cn("text-xs text-fg-muted", className)}
      {...props}
    />
  );
}

/**
 * Renders only while the field is invalid. Pass `match` to target a specific
 * `ValidityState` key (for example `match="valueMissing"`).
 */
export function FieldError({
  className,
  ...props
}: ComponentProps<typeof BaseField.Error>) {
  return (
    <BaseField.Error
      data-slot="field-error"
      className={cn("text-xs font-medium text-danger", className)}
      {...props}
    />
  );
}
