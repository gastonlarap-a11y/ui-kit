"use client";

import type { ReactNode } from "react";

import { ConfirmContext, useConfirmState } from "../../lib/use-confirm.js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../alert-dialog/alert-dialog.js";
import { Button } from "../button/button.js";

export interface ConfirmProviderProps {
  children?: ReactNode;
}

/**
 * Turns "are you sure?" into one `await`.
 *
 * Mount it once near the root of your app, then call `useConfirm()` from anywhere below.
 * It renders an `AlertDialog`, so the question cannot be dismissed by clicking away —
 * the promise only settles on an actual answer, and closing counts as declined.
 *
 * Reach for `AlertDialog` directly when the dialog needs its own layout or more than two
 * choices; this is for the common yes-or-no.
 *
 * @example
 * // app/layout.tsx
 * <ConfirmProvider>{children}</ConfirmProvider>
 *
 * // anywhere below
 * const confirm = useConfirm();
 * if (await confirm({ title: "Delete this project?", confirmLabel: "Delete" })) {
 *   await deleteProject();
 * }
 */
export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const state = useConfirmState();
  const { pending, answer } = state;
  const options = pending?.options;

  return (
    <ConfirmContext.Provider value={state}>
      {children}
      <AlertDialog
        open={pending !== null}
        /* Any close that is not the confirm button is a decline — including Escape. */
        onOpenChange={(open) => {
          if (!open) answer(false);
        }}
      >
        {options ? (
          <AlertDialogContent>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            {options.description ? (
              <AlertDialogDescription>
                {options.description}
              </AlertDialogDescription>
            ) : null}
            <AlertDialogFooter>
              <Button variant="ghost" onClick={() => answer(false)}>
                {options.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                variant={options.destructive === false ? "solid" : "danger"}
                onClick={() => answer(true)}
              >
                {options.confirmLabel ?? "Confirm"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}
