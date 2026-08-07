"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";
import { ChevronDownIcon } from "../../lib/icons.js";

export type AccordionProps = ComponentProps<typeof BaseAccordion.Root>;

/**
 * Collapsible sections. Several can be open at once by default; pass `multiple={false}`
 * to keep it to one.
 *
 * Do not use it to hide content people need in order to decide something — a reader
 * cannot search or scan what is collapsed.
 *
 * @example
 * <Accordion>
 *   <AccordionItem value="billing">
 *     <AccordionTrigger>How is billing calculated?</AccordionTrigger>
 *     <AccordionPanel>Per seat, charged monthly.</AccordionPanel>
 *   </AccordionItem>
 * </Accordion>
 */
export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header data-slot="accordion-header" className="flex">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 cursor-default items-center justify-between gap-4 py-4 text-left text-sm font-medium text-fg",
          "outline-none hover:underline",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 shrink-0 text-fg-muted transition-transform duration-200 data-panel-open:rotate-180" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-panel"
      className={cn(
        "overflow-hidden text-sm text-fg-muted",
        "h-[var(--accordion-panel-height)] transition-[height] duration-200",
        "data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </BaseAccordion.Panel>
  );
}
