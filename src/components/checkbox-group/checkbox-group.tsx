"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type CheckboxGroupProps = ComponentProps<typeof BaseCheckboxGroup>;

/**
 * Several checkboxes that submit as one value: an array of the checked names.
 *
 * For the "select all" pattern, make the group controlled, list every child value in
 * `allValues`, and mark the parent `Checkbox` with `parent`. The group then drives the
 * parent's indeterminate state itself — the part that is tedious to get right by hand,
 * because "some but not all" has to survive every individual toggle.
 *
 * Wrap it in a `Fieldset` when the group needs a visible heading.
 *
 * @example
 * const [value, setValue] = useState<string[]>([]);
 *
 * <CheckboxGroup
 *   value={value}
 *   onValueChange={setValue}
 *   allValues={["read", "write", "delete"]}
 * >
 *   <label className="flex items-center gap-2">
 *     <Checkbox parent /> <span>All permissions</span>
 *   </label>
 *   <label className="flex items-center gap-2">
 *     <Checkbox value="read" /> <span>Read</span>
 *   </label>
 * </CheckboxGroup>
 */
export function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
