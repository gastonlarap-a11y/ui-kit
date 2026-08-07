"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type TabsProps = ComponentProps<typeof BaseTabs.Root>;

/**
 * Switches between panels of related content. Arrow keys move between tabs and only
 * the active tab is a tab stop, which is what the pattern requires.
 *
 * Tabs are for alternative views of the same thing. If the sections should be readable
 * at once, or linkable separately, use headings or an `Accordion` instead.
 *
 * Arrow keys move focus and Enter or Space selects. Pass `activateOnFocus` to `TabsList`
 * when the panels are cheap to render and you want selection to follow focus.
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTab value="overview">Overview</TabsTab>
 *     <TabsTab value="usage">Usage</TabsTab>
 *   </TabsList>
 *   <TabsPanel value="overview">…</TabsPanel>
 *   <TabsPanel value="usage">…</TabsPanel>
 * </Tabs>
 */
export function Tabs({ className, ...props }: TabsProps) {
  return (
    <BaseTabs.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        "relative flex items-center gap-1 border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTab({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={cn(
        "-mb-px cursor-default border-b-2 border-transparent px-3 py-2 text-sm font-medium text-fg-muted",
        "transition-colors outline-none hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-selected:border-accent data-selected:text-fg",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      className={cn("text-sm text-fg outline-none", className)}
      {...props}
    />
  );
}
