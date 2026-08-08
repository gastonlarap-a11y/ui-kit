import type { HTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../../lib/cn.js";
import { XIcon } from "../../lib/icons.js";

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
  /**
   * Shows a close button and calls this when it is pressed.
   *
   * The Alert does not remove itself: whoever rendered it decides whether it goes away,
   * gets replaced, or is remembered as dismissed. A component that unmounts itself is
   * impossible to keep dismissed across a re-render.
   */
  onDismiss?: () => void;
  /** Accessible name of the close button. Defaults to `"Dismiss"`. */
  dismissLabel?: string;
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
 *
 * @example
 * // Dismissible: the Alert reports the intent, you decide what happens.
 * {showBanner && (
 *   <Alert onDismiss={() => setShowBanner(false)}>
 *     <AlertTitle>Trial ends in 3 days</AlertTitle>
 *   </Alert>
 * )}
 */
export function Alert({
  className,
  variant = "info",
  onDismiss,
  dismissLabel = "Dismiss",
  children,
  ...props
}: AlertProps) {
  const interrupts = variant === "warning" || variant === "danger";

  return (
    <div
      data-slot="alert"
      role={interrupts ? "alert" : "status"}
      className={alertVariants({
        variant,
        className: cn(onDismiss && "relative pr-10", className),
      })}
      {...props}
    >
      {children}
      {onDismiss ? (
        <button
          type="button"
          data-slot="alert-dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(
            "absolute top-3 right-3 rounded-sm p-1 text-fg-muted",
            "transition-colors outline-none hover:text-fg",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
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
