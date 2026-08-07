"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

export const inputVariants = tv({
  base: [
    "flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg",
    "placeholder:text-muted-fg",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    /* Base UI drives these from the surrounding Field's validation state. */
    "data-invalid:border-danger data-invalid:focus-visible:outline-danger",
  ],
});

export type InputProps = ComponentProps<typeof BaseInput>;

/**
 * Wraps Base UI's Input, which wires itself to a surrounding `Field` automatically
 * (id/label association, `aria-describedby`, `aria-invalid`) with no extra props.
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      data-slot="input"
      /* Base UI allows `className` to be a function of the input's state; resolving it
         here keeps that API instead of silently downgrading it to a plain string. */
      className={(state) =>
        inputVariants({
          className:
            typeof className === "function" ? className(state) : className,
        })
      }
      {...props}
    />
  );
}
