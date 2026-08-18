import type { Ref, TextareaHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../../lib/cn.js";

export const textareaVariants = tv({
  base: [
    "flex w-full rounded-md border border-border-strong bg-surface text-fg",
    "placeholder:text-muted-fg",
    "transition-[border-color,box-shadow] duration-(--ui-duration-fast) ease-out",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
  ],
  variants: {
    /**
     * A textarea has no fixed height to align with, so `size` sets its type and its
     * minimum box — matching the single-line controls it sits above in a form.
     */
    size: {
      sm: "min-h-16 px-3 py-1.5 text-sm",
      md: "min-h-20 px-3 py-2 text-sm",
      lg: "min-h-24 px-4 py-2.5 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface TextareaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /**
   * Grows with its content instead of scrolling inside a fixed box.
   *
   * Done with CSS `field-sizing`, so there is no measuring, no ref and no layout thrash
   * on every keystroke. It is a 2026 baseline feature: where it is missing the textarea
   * simply stays fixed-height and `rows` applies as usual — worth knowing, because where
   * it *is* supported `rows` is ignored.
   */
  autosize?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Multi-line text input. A plain `<textarea>` — no Base UI primitive is needed, since
 * the platform already gives the behaviour and the accessibility.
 *
 * Inside a `Field` it picks up the label and error wiring like any native control.
 *
 * @example
 * <Field name="summary">
 *   <FieldLabel>Summary</FieldLabel>
 *   <Textarea rows={4} placeholder="What changed?" />
 * </Field>
 *
 * @example
 * <Textarea autosize placeholder="Grows as you type" />
 */
export function Textarea({
  className,
  size,
  autosize,
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-autosize={autosize || undefined}
      className={textareaVariants({
        size,
        className: cn(
          autosize && "field-sizing-content resize-none",
          className,
        ),
      })}
      {...props}
    />
  );
}
