"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";

/**
 * Announces something that already happened, without interrupting the user.
 *
 * Mount `<ToastProvider>` once, near the root of your app, and call `useToast()` from
 * anywhere below it. Toasts are announced politely by a live region, so they reach a
 * screen reader without stealing focus.
 *
 * Never put a required action only in a toast: it disappears, and it cannot be reached
 * by keyboard while it is up.
 *
 * The dismiss button stays out of the accessibility tree until the stack is hovered or
 * focused — Base UI's choice, so a screen reader is not read a close control for every
 * toast that passes by.
 *
 * @example
 * // app/layout.tsx
 * <ToastProvider>{children}</ToastProvider>
 *
 * // anywhere below
 * const toast = useToast();
 * toast.add({ title: "Project saved", description: "All changes are live." });
 */
export function ToastProvider({
  children,
  ...props
}: ComponentProps<typeof BaseToast.Provider> & { children?: ReactNode }) {
  return (
    <BaseToast.Provider {...props}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          data-slot="toast-viewport"
          className="fixed inset-e-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

/**
 * Queue handle: `add`, `close`, `update` and `promise`, plus the current `toasts`.
 * Only valid below a `ToastProvider`.
 */
export function useToast() {
  return BaseToast.useToastManager();
}

/** Renders whatever is currently queued. Internal to the provider. */
function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      data-slot="toast"
      className={cn(
        "relative flex flex-col gap-1 rounded-lg border border-border bg-surface-overlay p-4 text-fg shadow-lg",
        "transition-[opacity,transform] duration-(--ui-duration-base) ease-out",
        "data-ending-style:opacity-0 data-starting-style:opacity-0",
        /* Slides in from the edge the viewport is pinned to. `translate-x` is a physical
           transform with no logical form, so the direction is flipped by hand. */
        "data-starting-style:translate-x-full rtl:data-starting-style:-translate-x-full",
      )}
    >
      {/* Content is not decorative: Base UI needs it to wire the title and description
          into the toast's accessible name and description. */}
      <BaseToast.Content
        data-slot="toast-content"
        className="flex flex-col gap-1 pe-6"
      >
        <BaseToast.Title
          data-slot="toast-title"
          className="text-sm font-semibold"
        />
        <BaseToast.Description
          data-slot="toast-description"
          className="text-sm text-fg-muted"
        />
        {/* Inside Content, per Base UI's anatomy — a Close placed as a sibling of
            Content never renders. */}
        <BaseToast.Close
          data-slot="toast-close"
          aria-label="Close"
          className={cn(
            "absolute inset-e-2 top-2 rounded-sm px-1.5 text-lg leading-none text-fg-muted",
            "hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          ×
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
}
