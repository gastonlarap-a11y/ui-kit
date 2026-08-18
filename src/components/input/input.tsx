"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../../lib/cn.js";
import { XIcon } from "../../lib/icons.js";

/**
 * The visual box, which is the group rather than the field.
 *
 * `Input` renders a wrapper around its `<input>` the way `Combobox` and `Autocomplete`
 * already do, so that a consumer's `className` reaches the element that actually has a
 * size. It used to land on the field while the wrapper stayed `w-full`, which put
 * `<Input className="w-56" onClear={…} />`'s clear button at the edge of the page instead
 * of the edge of the field.
 *
 * The states are read off the child: Base UI marks `data-invalid` and `disabled` on the
 * `<input>`, so the group asks about its descendant instead of about itself.
 */
export const inputVariants = tv({
  base: [
    "flex w-full items-center gap-1 rounded-md border border-border-strong bg-surface text-fg shadow-sm",
    "transition-[border-color,box-shadow] duration-(--ui-duration-fast) ease-out",
    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
    "has-disabled:cursor-not-allowed has-disabled:opacity-50",
    "has-data-invalid:border-danger has-data-invalid:focus-within:outline-danger",
  ],
  variants: {
    /** 32/36/44px, matching `Button` so a search field and its action line up. */
    size: {
      sm: "h-8 px-3",
      md: "h-9 px-3",
      lg: "h-11 px-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * The field itself: transparent, filling whatever the group is.
 *
 * The type size is set here rather than inherited from the group. An `<input>` does not
 * inherit `font-size` on its own — Tailwind's preflight is what normally fixes that — and
 * this package is also distributed without preflight, so relying on inheritance would make
 * the two installation paths render differently.
 */
function fieldClasses(size: InputSize): string {
  return cn(
    "h-full min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-muted-fg",
    size === "lg" ? "text-base" : "text-sm",
  );
}

type InputSize = NonNullable<VariantProps<typeof inputVariants>["size"]>;

/**
 * `size` is omitted from the native attributes on purpose: `<input size>` is a width in
 * characters, a different thing from the kit's control scale, and leaving both would make
 * `size="sm"` a type error for no reason a consumer could guess. Character width is still
 * reachable with `className="w-*"`, which is the modern way to ask for it anyway.
 */
interface InputOwnProps
  extends
    Omit<ComponentProps<typeof BaseInput>, "size" | "className">,
    VariantProps<typeof inputVariants> {
  /**
   * Styles the group — the bordered box — not the `<input>` inside it, which is
   * transparent and fills whatever the group is. Target the field itself with
   * `[data-slot="input"]` on the rare occasion you need to.
   *
   * A plain string rather than Base UI's state function: the group is a `<div>` and has
   * no input state to react to.
   */
  className?: string;
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
  size = "md",
  onClear,
  clearLabel = "Clear",
  ...props
}: InputProps) {
  /* `value` is guaranteed by the type union whenever `onClear` is present. */
  const showClear = onClear !== undefined && props.value !== "";

  return (
    <div
      data-slot="input-wrapper"
      className={inputVariants({ size, className })}
    >
      <BaseInput
        data-slot="input"
        /* Base UI allows `className` to be a function of the input's state. Nothing is
           forwarded here — the consumer's `className` styles the group — but resolving
           it keeps the prop's own shape intact for anyone reading the types. */
        className={fieldClasses(size)}
        {...props}
      />
      {/* Hidden rather than disabled when empty: a clear button that is present but
          does nothing is a control a screen reader user has to skip for no reason.
          A flex sibling rather than absolutely positioned, so it sits at the field's
          edge whatever width the group has, and follows the writing direction for
          free. */}
      {showClear ? (
        <button
          type="button"
          data-slot="input-clear"
          aria-label={clearLabel}
          onClick={onClear}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-sm text-fg-muted",
            "transition-colors duration-(--ui-duration-fast) ease-out outline-none hover:text-fg",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
          )}
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
