"use client";

import { useCallback, useState } from "react";

export interface ControllableStateOptions<T> {
  /** When defined, the caller owns the value and this hook only reports changes. */
  value: T | undefined;
  /** Starting value while uncontrolled. Read once; later changes are ignored. */
  defaultValue: T;
  /** Called on every change, controlled or not. */
  onChange: ((value: T) => void) | undefined;
}

/**
 * One state that works both ways: uncontrolled from `defaultValue`, or controlled by
 * whoever passes `value`. Internal to the kit.
 *
 * The setter accepts an updater function even while controlled, which a bare
 * `onChange(next)` cannot do — that is what lets a caller write `setPage(p => p + 1)`
 * without holding the current value at the call site.
 *
 * The updater sees the value as of the last render, not as of the last call: two updates
 * to the *same* state within one event would both read the same starting point. That is
 * how a controlled component behaves in React anyway, and reaching for a ref to work
 * around it would mean writing to it during render.
 *
 * Switching a component between controlled and uncontrolled mid-life is a caller bug
 * React itself warns about; this hook does not try to rescue it.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (next: T | ((current: T) => T)) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;

  const setValue = useCallback(
    (next: T | ((c: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (c: T) => T)(current) : next;

      /* No-op changes must not reach `onChange`: a caller that re-sorts by the column
         already sorted would otherwise get an event and re-render for nothing. */
      if (Object.is(resolved, current)) return;

      /* Set state outside the updater form on purpose. Calling `onChange` from inside
         one would make it a side effect of a function React may run twice. */
      if (!isControlled) setUncontrolled(resolved);
      onChange?.(resolved);
    },
    [current, isControlled, onChange],
  );

  return [current, setValue];
}
