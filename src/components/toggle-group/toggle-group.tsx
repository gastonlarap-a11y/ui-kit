"use client";

import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type ToggleGroupProps = ComponentProps<typeof BaseToggleGroup>;

/**
 * A set of related `Toggle`s sharing one value. Arrow keys move between them and only the
 * active one is a tab stop, so the whole group costs a single tab.
 *
 * Single-choice by default — pass `multiple` for the cases where several can be on at
 * once, such as text formatting. The value is always an array either way.
 *
 * Name the group with `aria-label`: the toggles inside describe themselves, not the set.
 *
 * @example
 * <ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
 *   <Toggle value="left" aria-label="Align left">…</Toggle>
 *   <Toggle value="center" aria-label="Align center">…</Toggle>
 * </ToggleGroup>
 */
export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1",
        "data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}
