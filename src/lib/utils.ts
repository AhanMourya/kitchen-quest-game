// --- Recipe Count Helpers ---
export function getRecipeCount() {
  const count = localStorage.getItem("recipeCount");
  return count ? parseInt(count, 10) : 0;
}

export function setRecipeCount(count: number) {
  localStorage.setItem("recipeCount", count.toString());
  window.dispatchEvent(new Event("recipeCountUpdated"));
}

export function incrementRecipeCount() {
  const current = getRecipeCount();
  setRecipeCount(current + 1);
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
