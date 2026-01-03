import { isValidBasename } from "@/hooks/useBasename";

/**
 * Validate if an Ethereum address is properly formatted
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shorten an Ethereum address for display
 * @param address - Full Ethereum address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 */
export function shortenAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return "";
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Check if user meets all requirements to participate
 */
export interface ParticipationRequirements {
  hasWallet: boolean;
  hasBasename: boolean;
  isRegistered: boolean;
  canParticipate: boolean;
  missingRequirements: string[];
}

export function checkParticipationRequirements(
  walletAddress: string | undefined,
  basename: string | null,
  isAuthenticated: boolean
): ParticipationRequirements {
  const requirements: ParticipationRequirements = {
    hasWallet: !!walletAddress,
    hasBasename: !!basename && isValidBasename(basename),
    isRegistered: isAuthenticated,
    canParticipate: false,
    missingRequirements: [],
  };

  if (!requirements.hasWallet) {
    requirements.missingRequirements.push("Connect your Smart Wallet");
  }

  if (!requirements.hasBasename) {
    requirements.missingRequirements.push("Register a Basename");
  }

  if (!requirements.isRegistered && requirements.hasWallet && requirements.hasBasename) {
    requirements.missingRequirements.push("Complete user registration");
  }

  requirements.canParticipate =
    requirements.hasWallet && requirements.hasBasename && requirements.isRegistered;

  return requirements;
}

/**
 * Format basename for display
 * Removes .base.eth or .basetest.eth suffix for cleaner UI
 */
export function formatBasename(basename: string | null, showFullName: boolean = false): string {
  if (!basename) return "";
  if (showFullName) return basename;

  // Remove domain suffix for cleaner display
  return basename.replace(/\.(base\.eth|basetest\.eth)$/i, "");
}
