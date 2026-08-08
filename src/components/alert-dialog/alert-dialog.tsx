"use client";

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import type { ComponentProps, HTMLAttributes, Ref } from "react";

import { cn } from "../../lib/cn.js";

export type AlertDialogProps = ComponentProps<typeof BaseAlertDialog.Root>;

/**
 * A dialog that requires an answer before anything else can happen. Use it for the
 * decisions you cannot undo: deleting, discarding, revoking.
 *
 * The difference from `Dialog` is deliberate, not cosmetic: this one cannot be dismissed
 * by clicking the backdrop or pressing Escape into nothing — the user has to pick. Reach
 * for `Dialog` for anything the user may simply want to close.
 *
 * Always give it an `AlertDialogTitle`; it becomes the accessible name. Put the
 * destructive action in a `danger` button and name it after what it does ("Delete
 * project"), not "OK".
 *
 * For the common ask-then-await case, `useConfirm` wraps all of this in one call.
 *
 * @example
 * <AlertDialog>
 *   <AlertDialogTrigger render={<Button variant="danger">Delete project</Button>} />
 *   <AlertDialogContent>
 *     <AlertDialogTitle>Delete this project?</AlertDialogTitle>
 *     <AlertDialogDescription>
 *       Every deployment and environment variable goes with it. This cannot be undone.
 *     </AlertDialogDescription>
 *     <AlertDialogFooter>
 *       <AlertDialogClose render={<Button variant="ghost">Keep it</Button>} />
 *       <AlertDialogClose render={<Button variant="danger">Delete project</Button>} />
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 */
export function AlertDialog(props: AlertDialogProps) {
  return <BaseAlertDialog.Root {...props} />;
}

export function AlertDialogTrigger(
  props: ComponentProps<typeof BaseAlertDialog.Trigger>,
) {
  return (
    <BaseAlertDialog.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

export function AlertDialogClose(
  props: ComponentProps<typeof BaseAlertDialog.Close>,
) {
  return <BaseAlertDialog.Close data-slot="alert-dialog-close" {...props} />;
}

export type AlertDialogContentProps = ComponentProps<
  typeof BaseAlertDialog.Popup
>;

/** Bundles the portal, backdrop and viewport so consumers compose only the contents. */
export function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop
        data-slot="alert-dialog-backdrop"
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-200",
          "data-ending-style:opacity-0 data-starting-style:opacity-0",
        )}
      />
      <BaseAlertDialog.Viewport
        data-slot="alert-dialog-viewport"
        className="fixed inset-0 grid place-items-center overflow-y-auto p-4"
      >
        <BaseAlertDialog.Popup
          data-slot="alert-dialog-content"
          className={cn(
            "flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-surface p-6 text-fg shadow-lg",
            "transition-[opacity,transform] duration-200",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex justify-end gap-2", className)}
      {...props}
    />
  );
}
