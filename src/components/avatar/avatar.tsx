"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import {
  Children,
  type ComponentProps,
  type HTMLAttributes,
  type Ref,
} from "react";

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

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How many avatars to show before collapsing the rest into a count. Everything beyond
   * this is replaced by a `+N` badge.
   */
  max?: number;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A row of overlapping avatars with the overflow collapsed into a count.
 *
 * The stack is decorative: it is announced as a single "N people" label rather than as a
 * list of images, because a screen reader reading eight avatars in a row tells you
 * nothing useful. Give it an `aria-label` naming the group.
 *
 * @example
 * <AvatarGroup max={3} aria-label="Project members">
 *   {members.map((m) => (
 *     <Avatar key={m.id}>
 *       <AvatarImage src={m.avatarUrl} />
 *       <AvatarFallback>{m.initials}</AvatarFallback>
 *     </Avatar>
 *   ))}
 * </AvatarGroup>
 */
export function AvatarGroup({
  className,
  children,
  max = 4,
  ...props
}: AvatarGroupProps) {
  const avatars = Children.toArray(children);
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;

  return (
    <div
      data-slot="avatar-group"
      className={cn(
        /* The ring is what separates one avatar from the one it overlaps; without it
           the stack reads as a single blob at small sizes. */
        "flex items-center -space-x-2 [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-surface",
        className,
      )}
      {...props}
    >
      {visible}
      {overflow > 0 ? (
        <span
          data-slot="avatar-group-overflow"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-fg ring-2 ring-surface"
        >
          +{overflow}
        </span>
      ) : null}
    </div>
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
