"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

import { cn } from "../../lib/cn.js";
import { XIcon } from "../../lib/icons.js";

export const inputVariants = tv({
  base: [
    "flex h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg shadow-sm",
    "placeholder:text-muted-fg",
    "transition-[border-color,box-shadow] duration-150 ease-out",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    /* Base UI drives these from the surrounding Field's validation state. */
    "data-invalid:border-danger data-invalid:focus-visible:outline-danger",
  ],
});

interface InputOwnProps extends ComponentProps<typeof BaseInput> {
  /** Accessible name of the clear button. Defaults to `"Clear"`. */
  clearLabel?: string;
}

/**
 * `onClear` requires `value`, enforced by the type rather than by documentation.
 *
 * The component reads `value` to decide whether there is anything to clear, so an
 * uncontrolled input would render a button that never appears — a failure with no
 * symptom to debug. As a union it is a compile error instead.
 */
export type InputProps =
  | (InputOwnProps & { onClear?: undefined })
  | (InputOwnProps & {
      /**
       * Shows a clear button while the field has content, and calls this when it is
       * pressed. Requires `value`: an uncontrolled input would need its own state to
       * know whether it is empty, and two sources of truth for one value is how a form
       * drifts out of sync with itself.
       */
      onClear: () => void;
      value: string;
    });

/**
 * Single-line text input. Wraps Base UI's Input, which wires itself to a surrounding
 * `Field` automatically — id/label association, `aria-describedby` for the description
 * and `aria-invalid` on error — with no extra props on your side.
 *
 * Prefer using it inside a `Field`; standalone it still needs a label of your own.
 *
 * @example
 * <Field name="email">
 *   <FieldLabel>Work email</FieldLabel>
 *   <Input type="email" placeholder="you@company.com" />
 *   <FieldError match="valueMissing">An email address is required.</FieldError>
 * </Field>
 *
 * @example
 * // Clearable, which requires driving the value yourself.
 * <Input value={query} onValueChange={setQuery} onClear={() => setQuery("")} />
 */
export function Input({
  className,
  onClear,
  clearLabel = "Clear",
  ...props
}: InputProps) {
  const input = (
    <BaseInput
      data-slot="input"
      /* Base UI allows `className` to be a function of the input's state; resolving it
         here keeps that API instead of silently downgrading it to a plain string. */
      className={(state) =>
        inputVariants({
          className: cn(
            onClear && "pr-9",
            typeof className === "function" ? className(state) : className,
          ),
        })
      }
      {...props}
    />
  );

  if (!onClear) return input;

  /* `value` is guaranteed by the type union whenever `onClear` is present. */
  const isEmpty = props.value === "";

  return (
    <div
      data-slot="input-wrapper"
      className="relative flex w-full items-center"
    >
      {input}
      {/* Hidden rather than disabled when empty: a clear button that is present but
          does nothing is a control a screen reader user has to skip for no reason. */}
      {isEmpty ? null : (
        <button
          type="button"
          data-slot="input-clear"
          aria-label={clearLabel}
          onClick={onClear}
          className={cn(
            "absolute right-2 flex size-6 items-center justify-center rounded-sm text-fg-muted",
            "transition-colors outline-none hover:text-fg",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
          )}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
