import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "../../stores/useStore";

export enum Category {
  WOMEN = "women",
  MEN = "men",
  KIDS = "kids",
  UNISEX = "unisex",
  FABRICS = "fabrics",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
