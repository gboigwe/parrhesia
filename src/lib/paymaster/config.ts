/**
 * Paymaster Configuration for Base Smart Wallet
 * Enables gasless transactions for all debate interactions
 */

import { http, type Address, type Chain } from "viem";
import { base, baseSepolia } from "viem/chains";

/**
 * Paymaster configuration for gas sponsorship
 */
export const PAYMASTER_CONFIG = {
  // Base Mainnet Paymaster
  mainnet: {
    url: process.env.NEXT_PUBLIC_PAYMASTER_URL || "",
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as Address,
    enabled: !!process.env.NEXT_PUBLIC_PAYMASTER_URL,
  },

  // Base Sepolia Paymaster (testnet)
  sepolia: {
    url: process.env.NEXT_PUBLIC_PAYMASTER_SEPOLIA_URL || "",
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as Address,
    enabled: !!process.env.NEXT_PUBLIC_PAYMASTER_SEPOLIA_URL,
  },
} as const;

/**
 * Get paymaster URL for a given chain
 */
export function getPaymasterUrl(chainId: number): string | undefined {
  if (chainId === base.id) {
    return PAYMASTER_CONFIG.mainnet.url;
  }
  if (chainId === baseSepolia.id) {
    return PAYMASTER_CONFIG.sepolia.url;
  }
  return undefined;
}

/**
 * Check if paymaster is enabled for a chain
 */
export function isPaymasterEnabled(chainId: number): boolean {
  if (chainId === base.id) {
    return PAYMASTER_CONFIG.mainnet.enabled;
  }
  if (chainId === baseSepolia.id) {
    return PAYMASTER_CONFIG.sepolia.enabled;
  }
  return false;
}

/**
 * Get entry point address for a chain
 */
export function getEntryPoint(chainId: number): Address {
  // EntryPoint v0.6 is standard across all chains
  return PAYMASTER_CONFIG.mainnet.entryPoint;
}

/**
 * Sponsorship types for different debate operations
 */
export enum SponsorshipType {
  DEBATE_CREATION = "debate_creation",
  DEBATE_JOIN = "debate_join",
  ARGUMENT_SUBMISSION = "argument_submission",
  VOTE_SUBMISSION = "vote_submission",
  PRIZE_CLAIM = "prize_claim",
  BATCH_OPERATION = "batch_operation",
}

/**
 * Paymaster context for sponsorship
 */
export interface PaymasterContext {
  type: SponsorshipType;
  debateId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create paymaster context for transaction sponsorship
 */
export function createPaymasterContext(
  type: SponsorshipType,
  options?: {
    debateId?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }
): PaymasterContext {
  return {
    type,
    debateId: options?.debateId,
    userId: options?.userId,
    metadata: options?.metadata,
  };
}
