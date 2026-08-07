"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type AvatarProps = ComponentProps<typeof BaseAvatar.Root>;

/**
 * Person or entity image with a fallback. The fallback appears while the image loads
 * and stays if it fails, so a broken URL never leaves a hole in the layout.
 *
 * The image is decorative here: put the person's name in the surrounding text, not in
 * an `alt`, so a screen reader reads it once rather than twice.
 *
 * @example
 * <Avatar>
 *   <AvatarImage src={user.avatarUrl} />
 *   <AvatarFallback>AL</AvatarFallback>
 * </Avatar>
 */
export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <BaseAvatar.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full bg-muted select-none",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof BaseAvatar.Image>) {
  return (
    <BaseAvatar.Image
      data-slot="avatar-image"
      className={cn("size-full object-cover", className)}
      {...props}
    />
  );
}

/** Usually initials. Keep it to two characters so it fits at every size. */
export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center text-sm font-medium text-muted-fg",
        className,
      )}
      {...props}
    />
  );
}
