import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

export const shortenAddress = (address: string): null | string => {
  if (!address) {
    return null;
  }
  const parsed = address;
  return `${parsed.substring(0, 4 + 2)}...${parsed.substring(
    address.length - 4
  )}`;
};
