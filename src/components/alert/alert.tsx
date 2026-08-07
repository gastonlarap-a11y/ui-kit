import type { HTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../../lib/cn.js";

export const alertVariants = tv({
  base: "flex flex-col gap-1 rounded-lg border p-4 text-sm",
  variants: {
    variant: {
      info: "border-border bg-muted text-fg",
      success: "border-success/30 bg-success/10 text-fg",
      warning: "border-warning/40 bg-warning/10 text-fg",
      danger: "border-danger/30 bg-danger/10 text-fg",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * A persistent message about the state of the page or a form.
 *
 * Renders `role="alert"` only for the `warning` and `danger` variants, which interrupts
 * a screen reader; informational messages stay silent so they do not talk over the user.
 * Colour alone never carries the meaning — write it in the text.
 *
 * For something transient, use a `Toast` instead.
 *
 * @example
 * <Alert variant="danger">
 *   <AlertTitle>Payment failed</AlertTitle>
 *   <AlertDescription>Your card was declined. Try another one.</AlertDescription>
 * </Alert>
 */
export function Alert({ className, variant = "info", ...props }: AlertProps) {
  const interrupts = variant === "warning" || variant === "danger";

  return (
    <div
      data-slot="alert"
      role={interrupts ? "alert" : "status"}
      className={alertVariants({ variant, className })}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { ref?: Ref<HTMLParagraphElement> }) {
  return (
    <p
      data-slot="alert-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { ref?: Ref<HTMLParagraphElement> }) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-fg-muted", className)}
      {...props}
    />
  );
}
