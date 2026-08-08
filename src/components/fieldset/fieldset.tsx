"use client";

import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type FieldsetProps = ComponentProps<typeof BaseFieldset.Root>;

/**
 * Groups related fields under one shared legend. Use it when several controls answer the
 * same question — a billing address, a set of permissions — so a screen reader announces
 * the group's name before each control inside it.
 *
 * A radio group already carries its own grouping; do not wrap one in a `Fieldset` unless
 * it needs a heading of its own.
 *
 * @example
 * <Fieldset>
 *   <FieldsetLegend>Billing address</FieldsetLegend>
 *   <Field name="street">
 *     <FieldLabel>Street</FieldLabel>
 *     <Input />
 *   </Field>
 * </Fieldset>
 */
export function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <BaseFieldset.Root
      data-slot="fieldset"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

/** The group's accessible name. */
export function FieldsetLegend({
  className,
  ...props
}: ComponentProps<typeof BaseFieldset.Legend>) {
  return (
    <BaseFieldset.Legend
      data-slot="fieldset-legend"
      className={cn(
        "text-sm font-medium text-fg data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
