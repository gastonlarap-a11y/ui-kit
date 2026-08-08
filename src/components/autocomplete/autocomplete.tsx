"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";
import { XIcon } from "../../lib/icons.js";
import {
  emptyClasses,
  groupLabelClasses,
  iconButtonClasses,
  inputGroupClasses,
  itemClasses,
  popupClasses,
  textInputClasses,
} from "../../lib/popup-classes.js";

export type AutocompleteProps = ComponentProps<typeof BaseAutocomplete.Root>;

/**
 * A text input that suggests as you type. The typed text is the answer; picking a
 * suggestion is a shortcut, not a requirement — which is the whole difference from
 * `Combobox`, where free text is never a valid value.
 *
 * Use it for search boxes and for fields that accept anything but usually repeat
 * (a city, a tag, a commit message). Use `Combobox` when the value must come from
 * a known list.
 *
 * `value` and `onValueChange` hold the **input text**, not the selected item.
 *
 * @example
 * const tags = [{ id: "bug", value: "bug" }];
 *
 * <Field name="tag">
 *   <FieldLabel>Search tags</FieldLabel>
 *   <Autocomplete items={tags}>
 *     <AutocompleteInput placeholder="e.g. feature" />
 *     <AutocompleteContent empty="No tags found.">
 *       {(tag: Tag) => (
 *         <AutocompleteItem key={tag.id} value={tag}>
 *           {tag.value}
 *         </AutocompleteItem>
 *       )}
 *     </AutocompleteContent>
 *   </Autocomplete>
 * </Field>
 */
export function Autocomplete(props: AutocompleteProps) {
  return <BaseAutocomplete.Root {...props} />;
}

export interface AutocompleteInputProps extends ComponentProps<
  typeof BaseAutocomplete.Input
> {
  /** Accessible name of the clear button. Defaults to `"Clear"`. */
  clearLabel?: string;
}

/**
 * The input and its clear control. There is no open button on purpose: an autocomplete
 * suggests while you type rather than presenting a list to browse.
 */
export function AutocompleteInput({
  className,
  clearLabel = "Clear",
  ...props
}: AutocompleteInputProps) {
  return (
    <BaseAutocomplete.InputGroup
      data-slot="autocomplete-input-group"
      className={cn(inputGroupClasses, className)}
    >
      <BaseAutocomplete.Input
        data-slot="autocomplete-input"
        className={textInputClasses}
        {...props}
      />
      <BaseAutocomplete.Clear
        data-slot="autocomplete-clear"
        aria-label={clearLabel}
        className={cn(iconButtonClasses)}
      >
        <XIcon className="size-4" />
      </BaseAutocomplete.Clear>
    </BaseAutocomplete.InputGroup>
  );
}

export interface AutocompleteContentProps extends Omit<
  ComponentProps<typeof BaseAutocomplete.Popup>,
  "children"
> {
  /**
   * Either plain nodes, or a render function called once per suggestion that survived
   * the filter. The function form is the usual one.
   *
   * Annotate the item yourself — `{(tag: Tag) => …}`. The parameter is typed `never`
   * rather than Base UI's `any`, which accepts any annotation you give it while keeping
   * `any` out of the kit's public types.
   */
  children?: ReactNode | ((item: never, index: number) => ReactNode);
  /**
   * Shown when nothing matches. Unlike `Combobox` this is not a dead end — whatever is
   * typed remains a valid value.
   *
   * It is a prop rather than a child because Base UI renders the empty state as a
   * *sibling* of the list — passing it as a second child would put it inside, where it
   * would be treated as a suggestion.
   */
  empty?: ReactNode;
}

/** Bundles the portal, positioner and list so consumers only compose the items. */
export function AutocompleteContent({
  className,
  children,
  empty,
  ...props
}: AutocompleteContentProps) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Positioner
        data-slot="autocomplete-positioner"
        sideOffset={4}
        className="z-50 outline-none"
      >
        <BaseAutocomplete.Popup
          data-slot="autocomplete-content"
          className={cn(popupClasses, className)}
          {...props}
        >
          {empty === undefined ? null : (
            <BaseAutocomplete.Empty
              data-slot="autocomplete-empty"
              className={emptyClasses}
            >
              {empty}
            </BaseAutocomplete.Empty>
          )}
          <BaseAutocomplete.List data-slot="autocomplete-list">
            {/* Base UI types the render item as `any`. The cast keeps that `any` at
                this internal boundary instead of letting it into the kit's public
                types, where every consumer would inherit it. */}
            {
              children as ComponentProps<
                typeof BaseAutocomplete.List
              >["children"]
            }
          </BaseAutocomplete.List>
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  );
}

export type AutocompleteItemProps = ComponentProps<
  typeof BaseAutocomplete.Item
>;

export function AutocompleteItem({
  className,
  ...props
}: AutocompleteItemProps) {
  return (
    <BaseAutocomplete.Item
      data-slot="autocomplete-item"
      className={cn(itemClasses, className)}
      {...props}
    />
  );
}

export function AutocompleteGroup(
  props: ComponentProps<typeof BaseAutocomplete.Group>,
) {
  return <BaseAutocomplete.Group data-slot="autocomplete-group" {...props} />;
}

export function AutocompleteGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseAutocomplete.GroupLabel>) {
  return (
    <BaseAutocomplete.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(groupLabelClasses, className)}
      {...props}
    />
  );
}
