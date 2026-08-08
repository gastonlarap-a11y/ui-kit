"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";
import { CheckIcon, ChevronDownIcon, XIcon } from "../../lib/icons.js";
import {
  emptyClasses,
  groupLabelClasses,
  iconButtonClasses,
  inputGroupClasses,
  itemClasses,
  popupClasses,
  textInputClasses,
} from "../../lib/popup-classes.js";

export type ComboboxProps = ComponentProps<typeof BaseCombobox.Root>;

/**
 * A `Select` you can type into. Base UI filters the list as you type, keeps the listbox
 * semantics and the keyboard navigation, and restricts the answer to the items you
 * supplied — free text is never a valid value.
 *
 * Reach for `Autocomplete` instead when the typed text is itself the answer and the
 * suggestions are only a shortcut.
 *
 * Pass `items` and render each one from `ComboboxContent`'s render function, so filtering
 * and rendering stay in agreement. `multiple` switches the input to chips.
 *
 * @example
 * const fruits = [{ value: "apple", label: "Apple" }];
 *
 * <Field name="fruit">
 *   <FieldLabel>Choose a fruit</FieldLabel>
 *   <Combobox items={fruits}>
 *     <ComboboxInput placeholder="e.g. Apple" />
 *     <ComboboxContent empty="No fruits found.">
 *       {(fruit: Fruit) => (
 *         <ComboboxItem key={fruit.value} value={fruit}>
 *           {fruit.label}
 *         </ComboboxItem>
 *       )}
 *     </ComboboxContent>
 *   </Combobox>
 * </Field>
 */
export function Combobox(props: ComboboxProps) {
  return <BaseCombobox.Root {...props} />;
}

export interface ComboboxInputProps extends ComponentProps<
  typeof BaseCombobox.Input
> {
  /** Accessible name of the clear button. Defaults to `"Clear selection"`. */
  clearLabel?: string;
  /** Accessible name of the open button. Defaults to `"Open list"`. */
  triggerLabel?: string;
}

/**
 * Bundles the input with its clear and open controls, so consumers compose the list
 * rather than the plumbing.
 */
export function ComboboxInput({
  className,
  clearLabel = "Clear selection",
  triggerLabel = "Open list",
  ...props
}: ComboboxInputProps) {
  return (
    <BaseCombobox.InputGroup
      data-slot="combobox-input-group"
      className={cn(inputGroupClasses, className)}
    >
      <BaseCombobox.Input
        data-slot="combobox-input"
        className={textInputClasses}
        {...props}
      />
      <BaseCombobox.Clear
        data-slot="combobox-clear"
        aria-label={clearLabel}
        className={cn(iconButtonClasses)}
      >
        <XIcon className="size-4" />
      </BaseCombobox.Clear>
      <BaseCombobox.Trigger
        data-slot="combobox-trigger"
        aria-label={triggerLabel}
        className={cn(iconButtonClasses)}
      >
        <ChevronDownIcon className="size-4" />
      </BaseCombobox.Trigger>
    </BaseCombobox.InputGroup>
  );
}

export interface ComboboxChipsProps<TItem = unknown> {
  /**
   * Renders one `ComboboxChip` per selected item. Receives the current value array —
   * the chips are yours to render because only you know the shape of an item.
   *
   * Annotate the item type on the component — `<ComboboxChips<Fruit>>`. It cannot be
   * inferred from the callback's own parameter, but annotating it is what removes the
   * cast the call site would otherwise need.
   */
  children: (value: TItem[]) => ReactNode;
  placeholder?: string;
  className?: string;
}

/**
 * The `multiple` layout: selected items sit inside the input as removable chips, with
 * the text cursor after them. The input is placed for you, after the chips.
 *
 * @example
 * <Combobox items={langs} multiple>
 *   <ComboboxChips<Language> placeholder="e.g. TypeScript">
 *     {(value) =>
 *       value.map((lang) => (
 *         <ComboboxChip key={lang.id} removeLabel={`Remove ${lang.value}`}>
 *           {lang.value}
 *         </ComboboxChip>
 *       ))
 *     }
 *   </ComboboxChips>
 *   <ComboboxContent>…</ComboboxContent>
 * </Combobox>
 */
export function ComboboxChips<TItem = unknown>({
  children,
  placeholder,
  className,
}: ComboboxChipsProps<TItem>) {
  return (
    <BaseCombobox.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        inputGroupClasses,
        "h-auto flex-wrap gap-1 py-1",
        className,
      )}
    >
      <BaseCombobox.Chips data-slot="combobox-chips" className="contents">
        <BaseCombobox.Value>
          {(value) => (
            <>
              {/* Base UI hands back the raw selection; the generic is what gives the
                  caller a typed array instead of a cast at the call site. */}
              {children(value as TItem[])}
              <BaseCombobox.Input
                data-slot="combobox-input"
                placeholder={placeholder}
                className="h-7 min-w-24 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted-fg"
              />
            </>
          )}
        </BaseCombobox.Value>
      </BaseCombobox.Chips>
    </BaseCombobox.InputGroup>
  );
}

export interface ComboboxChipProps extends ComponentProps<
  typeof BaseCombobox.Chip
> {
  /** Accessible name of the remove button. Say what it removes, not just "Remove". */
  removeLabel: string;
}

/** One selected item, with its own remove control. */
export function ComboboxChip({
  className,
  children,
  removeLabel,
  ...props
}: ComboboxChipProps) {
  return (
    <BaseCombobox.Chip
      data-slot="combobox-chip"
      className={cn(
        "inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-0.5 text-xs font-medium text-muted-fg",
        "data-highlighted:bg-accent data-highlighted:text-accent-fg",
        className,
      )}
      {...props}
    >
      {children}
      <BaseCombobox.ChipRemove
        data-slot="combobox-chip-remove"
        aria-label={removeLabel}
        className="rounded-sm opacity-60 outline-none hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
      >
        <XIcon className="size-3" />
      </BaseCombobox.ChipRemove>
    </BaseCombobox.Chip>
  );
}

export interface ComboboxContentProps extends Omit<
  ComponentProps<typeof BaseCombobox.Popup>,
  "children"
> {
  /**
   * Either plain nodes, or a render function called once per item that survived the
   * filter. The function form is the usual one.
   *
   * Annotate the item yourself — `{(fruit: Fruit) => …}`. The parameter is typed `never`
   * rather than Base UI's `any`, which accepts any annotation you give it while keeping
   * `any` out of the kit's public types.
   */
  children?: ReactNode | ((item: never, index: number) => ReactNode);
  /**
   * Shown when the filter matches nothing. Without it the popup just goes blank.
   *
   * It is a prop rather than a child because Base UI renders the empty state as a
   * *sibling* of the list — passing it as a second child would put it inside, where it
   * would be treated as an item.
   */
  empty?: ReactNode;
}

/** Bundles the portal, positioner and list so consumers only compose the items. */
export function ComboboxContent({
  className,
  children,
  empty,
  ...props
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        data-slot="combobox-positioner"
        sideOffset={4}
        className="z-50 outline-none"
      >
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={cn(popupClasses, className)}
          {...props}
        >
          {empty === undefined ? null : (
            <BaseCombobox.Empty
              data-slot="combobox-empty"
              className={emptyClasses}
            >
              {empty}
            </BaseCombobox.Empty>
          )}
          <BaseCombobox.List data-slot="combobox-list">
            {/* Base UI types the render item as `any`. The cast keeps that `any` at
                this internal boundary instead of letting it into the kit's public
                types, where every consumer would inherit it. */}
            {children as ComponentProps<typeof BaseCombobox.List>["children"]}
          </BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export type ComboboxItemProps = ComponentProps<typeof BaseCombobox.Item>;

export function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxItemProps) {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      className={cn(itemClasses, className)}
      {...props}
    >
      <BaseCombobox.ItemIndicator
        data-slot="combobox-item-indicator"
        className="text-accent"
      >
        <CheckIcon className="size-4" />
      </BaseCombobox.ItemIndicator>
      <span className="flex-1">{children}</span>
    </BaseCombobox.Item>
  );
}

export function ComboboxGroup(
  props: ComponentProps<typeof BaseCombobox.Group>,
) {
  return <BaseCombobox.Group data-slot="combobox-group" {...props} />;
}

export function ComboboxGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.GroupLabel>) {
  return (
    <BaseCombobox.GroupLabel
      data-slot="combobox-group-label"
      className={cn(groupLabelClasses, className)}
      {...props}
    />
  );
}
