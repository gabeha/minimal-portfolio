import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTitle = (text: string) => {
  // Separate letters from numbers
  const match = text.match(/([a-zA-Z]+)(\d+)/);
  if (!match) return text;

  // Capitalize and format
  const [, city, year] = match; // Ignore the first item with a comma
  return `${city.charAt(0).toUpperCase() + city.slice(1)} ${year}`;
};
