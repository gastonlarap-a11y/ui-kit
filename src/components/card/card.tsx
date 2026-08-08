import type { HTMLAttributes, Ref } from "react";

import { cn } from "../../lib/cn.js";

type DivProps = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };

/**
 * Surface container for a single unit of content. Compose it with `CardHeader`,
 * `CardTitle`, `CardDescription`, `CardContent` and `CardFooter`; every part is a
 * plain element with a `data-slot`, so nothing here traps you into one layout.
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Monthly report</CardTitle>
 *     <CardDescription>Generated on the first day of every month.</CardDescription>
 *   </CardHeader>
 *   <CardContent>…</CardContent>
 *   <CardFooter><Button size="sm">Download</Button></CardFooter>
 * </Card>
 */
export function Card({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 text-fg shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { ref?: Ref<HTMLHeadingElement> }) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-base leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { ref?: Ref<HTMLParagraphElement> }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("text-sm", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}
