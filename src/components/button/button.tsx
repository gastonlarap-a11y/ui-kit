import type { ButtonHTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { SpinnerIcon } from "../../lib/icons.js";

export const buttonVariants = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-[color,background-color,box-shadow,translate] duration-150 ease-out",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    /* A button that visibly gives under the pointer feels connected to the click. */
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      solid: "bg-accent text-accent-fg shadow-sm hover:bg-accent-hover",
      outline:
        "border border-border bg-surface text-fg shadow-sm hover:bg-muted",
      ghost: "text-fg hover:bg-muted",
      danger: "bg-danger text-danger-fg shadow-sm hover:opacity-90",
    },
    size: {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-9 rounded-md px-4 text-sm",
      lg: "h-11 rounded-lg px-6 text-base",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Shows a spinner and makes the button inert while an action is in flight.
   *
   * The label stays visible on purpose: replacing it with a spinner alone loses what the
   * button was going to do, and the button would resize under the pointer.
   */
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Trigger for an action. Renders a native `<button>`, so keyboard activation, focus
 * and form participation come from the platform rather than from JavaScript.
 *
 * Defaults to `type="button"` so it never submits a surrounding form by accident;
 * pass `type="submit"` explicitly when that is what you want.
 *
 * To render a link that looks like a button, style an `<a>` with `buttonVariants()`
 * instead of nesting one inside — a button containing a link is invalid markup.
 *
 * @example
 * <Button onClick={save}>Save changes</Button>
 * <Button variant="danger" size="sm">Delete</Button>
 * <Button loading={saving}>Save changes</Button>
 * <a className={buttonVariants({ variant: "outline" })} href="/docs">Docs</a>
 */
export function Button({
  className,
  variant,
  size,
  type = "button",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      /* Inert while loading, so a second click cannot fire the action twice. */
      disabled={disabled || loading}
      /* Announces the wait without stealing focus, unlike a live region would. */
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <SpinnerIcon
          data-slot="button-spinner"
          className="size-4 shrink-0 animate-spin"
        />
      ) : null}
      {children}
    </button>
  );
}
