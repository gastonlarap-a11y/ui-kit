import type { HTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
  base: "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  variants: {
    variant: {
      neutral: "bg-muted text-muted-fg",
      accent: "bg-accent text-accent-fg",
      success: "bg-success text-success-fg",
      warning: "bg-warning text-warning-fg",
      danger: "bg-danger text-danger-fg",
      outline: "border border-border text-fg",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Short, non-interactive status label. Renders a `<span>`, so it can sit inline
 * inside a sentence, a table cell or a card footer.
 *
 * It carries no ARIA role: the text itself is the meaning. If the badge conveys a
 * state that changes at runtime, announce that change from the surrounding live
 * region rather than from here.
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={badgeVariants({ variant, className })}
      {...props}
    />
  );
}
