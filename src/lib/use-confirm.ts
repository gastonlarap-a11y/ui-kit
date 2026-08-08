"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Label of the confirming button. Name the action: "Delete project", not "OK". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirming button as destructive. Defaults to `true`. */
  destructive?: boolean;
}

/** Asks the question and resolves once the user answers. Never rejects. */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

export interface ConfirmState {
  confirm: ConfirmFn;
  pending: PendingConfirm | null;
  /** Answers the open question. Closing without choosing counts as `false`. */
  answer: (confirmed: boolean) => void;
}

const ConfirmContext = createContext<ConfirmState | null>(null);

/**
 * The behaviour behind `ConfirmProvider`: one queued question at a time, and a promise
 * that settles when it is answered.
 *
 * Split out with no JSX so a consumer can build a different confirmation dialog on the
 * same semantics.
 */
export function useConfirmState(): ConfirmState {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      /* Replacing an unanswered question would leave its promise pending forever, so
         the previous one resolves as declined first. */
      setPending((current) => {
        current?.resolve(false);
        return { options, resolve };
      });
    });
  }, []);

  const answer = useCallback((confirmed: boolean) => {
    setPending((current) => {
      current?.resolve(confirmed);
      return null;
    });
  }, []);

  return useMemo(
    () => ({ confirm, pending, answer }),
    [confirm, pending, answer],
  );
}

/**
 * The confirmation handle. Only valid below a `ConfirmProvider`.
 *
 * @example
 * const confirm = useConfirm();
 *
 * async function remove() {
 *   const ok = await confirm({
 *     title: "Delete this project?",
 *     description: "This cannot be undone.",
 *     confirmLabel: "Delete project",
 *   });
 *   if (ok) await deleteProject();
 * }
 */
export function useConfirm(): ConfirmFn {
  const context = useContext(ConfirmContext);

  if (context === null) {
    throw new Error(
      "useConfirm() requires a <ConfirmProvider> above it in the tree.",
    );
  }

  return context.confirm;
}

/** Internal: lets the provider read the state it created. */
export function useConfirmContext(): ConfirmState | null {
  return useContext(ConfirmContext);
}

export { ConfirmContext };
