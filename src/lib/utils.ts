import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as USD currency
 * @param amount - Amount in USDC (6 decimals)
 * @returns Formatted USD string
 */
export function formatUSDC(amount: bigint | number): string {
  const value = typeof amount === "bigint" ? Number(amount) / 1e6 : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Truncates an Ethereum address for display
 * @param address - Full Ethereum address
 * @param chars - Number of characters to show on each side
 * @returns Truncated address (e.g., "0x1234...5678")
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Formats a Basename for display
 * @param basename - Basename string
 * @returns Formatted basename
 */
export function formatBasename(basename: string): string {
  if (!basename) return "";
  return basename.endsWith(".base.eth") ? basename : `${basename}.base.eth`;
}

/**
 * Calculates time remaining until a timestamp
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted time remaining string
 */
export function getTimeRemaining(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Validates if a string is a valid Ethereum address
 * @param address - Address to validate
 * @returns True if valid address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
