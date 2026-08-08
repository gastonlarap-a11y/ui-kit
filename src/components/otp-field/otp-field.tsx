"use client";

import { OTPField as BaseOtpField } from "@base-ui/react/otp-field";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export interface OtpFieldProps extends ComponentProps<
  typeof BaseOtpField.Root
> {
  /** Where to draw a separator, as a 0-based index of the slot it precedes. */
  separatorAfter?: readonly number[];
}

/**
 * One-time code entry: one box per character, with paste, backspace and arrow keys
 * behaving the way people expect from a code field rather than from six inputs in a row.
 *
 * `length` is required and drives how many boxes are rendered. `validationType` restricts
 * what can be typed (`"numeric"` by default here, since that is what most codes are), and
 * `autoSubmit` submits the surrounding form once the last box is filled.
 *
 * Only the first box carries the field's name for a screen reader; the rest announce
 * their position, so the code is not read out as six unrelated inputs.
 *
 * @example
 * <Field name="code">
 *   <FieldLabel>Verification code</FieldLabel>
 *   <OtpField length={6} autoSubmit />
 * </Field>
 *
 * @example
 * // Grouped as 3 + 3.
 * <OtpField length={6} separatorAfter={[2]} />
 */
export function OtpField({
  className,
  length,
  separatorAfter,
  validationType = "numeric",
  ...props
}: OtpFieldProps) {
  const separators = new Set(separatorAfter);

  return (
    <BaseOtpField.Root
      data-slot="otp-field"
      length={length}
      validationType={validationType}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length }, (_, index) => (
        <OtpSlot
          key={index}
          index={index}
          length={length}
          withSeparator={separators.has(index)}
        />
      ))}
    </BaseOtpField.Root>
  );
}

function OtpSlot({
  index,
  length,
  withSeparator,
}: {
  index: number;
  length: number;
  withSeparator: boolean;
}) {
  return (
    <>
      <BaseOtpField.Input
        data-slot="otp-field-input"
        /* The first box inherits the field's own label; the rest would otherwise be
           announced as unnamed inputs. */
        aria-label={
          index === 0 ? undefined : `Character ${index + 1} of ${length}`
        }
        className={cn(
          "size-10 rounded-md border border-border bg-surface text-center text-base text-fg tabular-nums shadow-sm",
          "transition-[border-color,box-shadow] duration-150 ease-out outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-invalid:border-danger",
        )}
      />
      {withSeparator ? (
        <BaseOtpField.Separator
          data-slot="otp-field-separator"
          className="h-px w-2 bg-border"
        />
      ) : null}
    </>
  );
}
