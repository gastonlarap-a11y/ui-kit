import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Joins conditional class names and resolves conflicting Tailwind utilities, so a
 * consumer's `className` always beats the component's own defaults instead of
 * depending on stylesheet order.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
