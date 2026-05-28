import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for conditional tailwind class merging
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
