"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentProps, HTMLAttributes, Ref } from "react";

import { cn } from "../../lib/cn.js";

export type DialogProps = ComponentProps<typeof BaseDialog.Root>;

/**
 * Modal dialog. Focus trapping, scroll locking, Escape handling and returning focus
 * to the trigger all come from Base UI, so none of it is yours to maintain.
 *
 * Uncontrolled by default; pass `open` and `onOpenChange` to drive it yourself.
 * Always give it a `DialogTitle` — it becomes the dialog's accessible name.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger render={<Button variant="outline">Delete project</Button>} />
 *   <DialogContent>
 *     <DialogTitle>Delete project</DialogTitle>
 *     <DialogDescription>This cannot be undone.</DialogDescription>
 *     <DialogFooter>
 *       <DialogClose render={<Button variant="ghost">Cancel</Button>} />
 *       <DialogClose render={<Button variant="danger">Delete</Button>} />
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 */
export function Dialog(props: DialogProps) {
  return <BaseDialog.Root {...props} />;
}

export function DialogTrigger(
  props: ComponentProps<typeof BaseDialog.Trigger>,
) {
  return <BaseDialog.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogClose(props: ComponentProps<typeof BaseDialog.Close>) {
  return <BaseDialog.Close data-slot="dialog-close" {...props} />;
}

export type DialogContentProps = ComponentProps<typeof BaseDialog.Popup>;

/**
 * Bundles the portal, backdrop and viewport so consumers only compose what they
 * care about. Enter/exit animations key off Base UI's `data-starting-style` and
 * `data-ending-style` attributes.
 */
export function DialogContent({
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-backdrop"
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-200",
          "data-ending-style:opacity-0 data-starting-style:opacity-0",
        )}
      />
      <BaseDialog.Viewport
        data-slot="dialog-viewport"
        className="fixed inset-0 grid place-items-center overflow-y-auto p-4"
      >
        <BaseDialog.Popup
          data-slot="dialog-content"
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
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex justify-end gap-2", className)}
      {...props}
    />
  );
}
