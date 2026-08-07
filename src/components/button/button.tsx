import type { ButtonHTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-colors",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      solid: "bg-accent text-accent-fg hover:bg-accent-hover",
      outline: "border border-border bg-surface text-fg hover:bg-muted",
      ghost: "text-fg hover:bg-muted",
      danger: "bg-danger text-danger-fg hover:opacity-90",
    },
    size: {
      sm: "h-8 rounded-sm px-3 text-sm",
      md: "h-10 rounded-md px-4 text-sm",
      lg: "h-11 rounded-md px-6 text-base",
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
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Defaults to `type="button"` so it never submits a surrounding form by accident;
 * pass `type="submit"` explicitly when that is what you want.
 */
export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
