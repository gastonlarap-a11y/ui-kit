"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import {
  createContext,
  useContext,
  type ComponentProps,
  type HTMLAttributes,
  type Ref,
} from "react";

import { cn } from "../../lib/cn.js";

export type DrawerSide = "bottom" | "top" | "left" | "right";

export interface DrawerProps extends Omit<
  ComponentProps<typeof BaseDrawer.Root>,
  "swipeDirection"
> {
  /**
   * Which edge it enters from. Defaults to `"bottom"`.
   *
   * The swipe direction is derived from it, so a side panel is always dismissed sideways
   * and a sheet downwards. Override `swipeDirection` only if you want them to disagree.
   */
  side?: DrawerSide;
  swipeDirection?: ComponentProps<typeof BaseDrawer.Root>["swipeDirection"];
}

/**
 * The side lives here rather than on `DrawerContent` so that one value drives both the
 * edge it enters from and the direction it is dismissed in. Two independent props were
 * free to disagree, which is how a right-hand panel ends up swiping downwards.
 */
const DrawerSideContext = createContext<DrawerSide>("bottom");

const swipeBySide = {
  bottom: "down",
  top: "up",
  left: "left",
  right: "right",
} as const;

/**
 * A panel that slides in from an edge and can be swiped away. It is `Dialog` plus
 * gestures, so focus trapping, scroll locking and Escape all behave the same.
 *
 * Use it where a dialog would feel wrong: filters and detail panels on a phone, anything
 * the user should be able to flick shut. On a desktop-only surface, a `Dialog` is usually
 * the better fit.
 *
 * `side` sets the edge it enters from and the direction it is swiped away in, from one
 * value — they cannot drift apart.
 *
 * Always give it a `DrawerTitle`; it becomes the accessible name.
 *
 * @example
 * <Drawer>
 *   <DrawerTrigger render={<Button variant="outline">Filters</Button>} />
 *   <DrawerContent>
 *     <DrawerTitle>Filters</DrawerTitle>
 *     <DrawerDescription>Narrow the results.</DrawerDescription>
 *     …
 *   </DrawerContent>
 * </Drawer>
 */
export function Drawer({
  side = "bottom",
  swipeDirection,
  ...props
}: DrawerProps) {
  return (
    <DrawerSideContext.Provider value={side}>
      <BaseDrawer.Root
        swipeDirection={swipeDirection ?? swipeBySide[side]}
        {...props}
      />
    </DrawerSideContext.Provider>
  );
}

export function DrawerTrigger(
  props: ComponentProps<typeof BaseDrawer.Trigger>,
) {
  return <BaseDrawer.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerClose(props: ComponentProps<typeof BaseDrawer.Close>) {
  return <BaseDrawer.Close data-slot="drawer-close" {...props} />;
}

export type DrawerContentProps = ComponentProps<typeof BaseDrawer.Popup>;

/** Bundles the portal, backdrop and viewport so consumers compose only the contents. */
export function DrawerContent({
  className,
  children,
  ...props
}: DrawerContentProps) {
  const side = useContext(DrawerSideContext);

  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop
        data-slot="drawer-backdrop"
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-200",
          "data-ending-style:opacity-0 data-starting-style:opacity-0",
        )}
      />
      <BaseDrawer.Viewport
        data-slot="drawer-viewport"
        className={cn("fixed inset-0 flex", viewportBySide[side])}
      >
        <BaseDrawer.Popup
          data-slot="drawer-content"
          className={cn(
            "flex flex-col gap-4 border-border bg-surface p-6 text-fg shadow-lg",
            "transition-transform duration-200",
            popupBySide[side],
            className,
          )}
          {...props}
        >
          {/* The grab handle is decorative: the swipe gesture is an enhancement, and
              the close control is what a keyboard or screen reader user reaches for. */}
          {side === "bottom" ? (
            <div
              aria-hidden
              className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border"
            />
          ) : null}
          <BaseDrawer.Content data-slot="drawer-body" className="contents">
            {children}
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

const viewportBySide = {
  bottom: "items-end",
  top: "items-start",
  left: "justify-start",
  right: "justify-end",
} as const;

const popupBySide = {
  bottom: "max-h-[85vh] w-full rounded-t-lg border-t",
  top: "max-h-[85vh] w-full rounded-b-lg border-b",
  left: "h-full w-80 max-w-[85vw] rounded-r-lg border-r",
  right: "h-full w-80 max-w-[85vw] rounded-l-lg border-l",
} as const;

export function DrawerTitle({
  className,
  ...props
}: ComponentProps<typeof BaseDrawer.Title>) {
  return (
    <BaseDrawer.Title
      data-slot="drawer-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDrawer.Description>) {
  return (
    <BaseDrawer.Description
      data-slot="drawer-description"
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

export function DrawerFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("flex justify-end gap-2", className)}
      {...props}
    />
  );
}
