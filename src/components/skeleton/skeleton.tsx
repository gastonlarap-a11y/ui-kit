import type { HTMLAttributes, Ref } from "react";

import { cn } from "../../lib/cn.js";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * Placeholder for content that is still loading. Give it the shape of what will replace
 * it, so the layout does not jump.
 *
 * It is `aria-hidden`: a screen reader should hear the loading state once, from a live
 * region or an `aria-busy` container, not from every grey rectangle on the page.
 *
 * @example
 * <div className="flex flex-col gap-2" aria-busy>
 *   <Skeleton className="h-4 w-48" />
 *   <Skeleton className="h-4 w-32" />
 * </div>
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-muted",
        /* The pulse is the only part that moves and it says nothing the static block
           does not; a reader who asked for less motion loses no information here.
           `Button`'s spinner is left alone on purpose — its motion is the state. */
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
