/**
 * Sign-In with Ethereum (SIWE) Utilities
 * Handles message creation and verification for Base authentication
 */

import { SiweMessage, generateNonce } from "siwe";
import type { Address } from "viem";

/**
 * Create SIWE message for signing
 */
export function createSiweMessage(
  address: Address,
  statement: string = "Sign in to Parrhesia"
): SiweMessage {
  const domain = typeof window !== "undefined" ? window.location.host : "parrhesia.app";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://parrhesia.app";

  return new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: 8453, // Base mainnet
    nonce: generateNonce(),
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  });
}

/**
 * Verify SIWE signature
 */
export async function verifySiweSignature(
  message: string,
  signature: string
): Promise<{ success: boolean; address?: Address; error?: string }> {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });

    if (!result.success) {
      return {
        success: false,
        error: "Invalid signature",
      };
    }

    return {
      success: true,
      address: result.data.address as Address,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

/**
 * Check if SIWE message is expired
 */
export function isSiweMessageExpired(message: SiweMessage): boolean {
  if (!message.expirationTime) return false;
  return new Date(message.expirationTime) < new Date();
}

/**
 * Get human-readable expiration time
 */
export function getSiweExpirationTime(message: SiweMessage): string {
  if (!message.expirationTime) return "Never";

  const expiration = new Date(message.expirationTime);
  const now = new Date();
  const diff = expiration.getTime() - now.getTime();

  if (diff < 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}
