"use client";

import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type SeparatorProps = ComponentProps<typeof BaseSeparator>;

/**
 * A visible divider between groups of content, exposed with `role="separator"` so the
 * grouping it implies is not purely visual.
 *
 * If the split is only decorative, a border on the neighbouring element is lighter and
 * says nothing to assistive technology, which is the honest result.
 *
 * @example
 * <Separator />
 * <Separator orientation="vertical" className="h-6" />
 */
export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <BaseSeparator
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
