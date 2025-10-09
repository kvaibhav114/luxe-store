import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceINR(value: number, options?: Intl.NumberFormatOptions) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      ...options,
    }).format(value)
  } catch {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`
  }
}
