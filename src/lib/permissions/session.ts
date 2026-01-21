/**
 * Session Keys & Spend Permissions (EIP-7715)
 * Enable pre-approved transactions and batch operations
 */

import { type Address, type Hex } from "viem";

/**
 * Permission types for session keys
 */
export enum PermissionType {
  CONTRACT_CALL = "contract-call",
  NATIVE_TRANSFER = "native-token-transfer",
  ERC20_TRANSFER = "erc20-transfer",
}

/**
 * Rate limit policy
 */
export interface RateLimitPolicy {
  type: "rate-limit";
  count: number; // Max operations
  interval: number; // Time window in seconds
}

/**
 * Spending limit policy
 */
export interface SpendingLimitPolicy {
  type: "spending-limit";
  limit: string; // Max amount (wei or token units)
  period: number; // Time period in seconds
}

/**
 * Contract call permission
 */
export interface ContractCallPermission {
  type: PermissionType.CONTRACT_CALL;
  data: {
    address: Address;
    abi: readonly unknown[];
    functionName: string;
    args?: {
      operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte";
      value: unknown;
    }[];
  };
  policies?: (RateLimitPolicy | SpendingLimitPolicy)[];
}

/**
 * Permission request
 */
export interface PermissionRequest {
  permissions: ContractCallPermission[];
  expiry: number; // Unix timestamp
  signer?: Address;
}

/**
 * Create a voting session permission
 * Allows users to vote multiple times without repeated signatures
 */
export function createVotingSession(
  debatePoolAddress: Address,
  maxVotes: number = 10,
  durationHours: number = 24
): PermissionRequest {
  const expiry = Date.now() + durationHours * 60 * 60 * 1000;

  return {
    permissions: [
      {
        type: PermissionType.CONTRACT_CALL,
        data: {
          address: debatePoolAddress,
          abi: [], // Add DebatePoolABI
          functionName: "vote",
        },
        policies: [
          {
            type: "rate-limit",
            count: maxVotes,
            interval: durationHours * 3600,
          },
        ],
      },
    ],
    expiry,
  };
}

/**
 * Create argument submission session
 * Pre-approve multiple argument submissions
 */
export function createArgumentSession(
  debatePoolAddress: Address,
  maxArguments: number = 5,
  durationHours: number = 48
): PermissionRequest {
  const expiry = Date.now() + durationHours * 60 * 60 * 1000;

  return {
    permissions: [
      {
        type: PermissionType.CONTRACT_CALL,
        data: {
          address: debatePoolAddress,
          abi: [], // Add DebatePoolABI
          functionName: "submitArgument",
        },
        policies: [
          {
            type: "rate-limit",
            count: maxArguments,
            interval: durationHours * 3600,
          },
        ],
      },
    ],
    expiry,
  };
}

/**
 * Create batch operation session
 * Allow multiple contract calls in one session
 */
export function createBatchSession(
  permissions: ContractCallPermission[],
  durationHours: number = 12
): PermissionRequest {
  const expiry = Date.now() + durationHours * 60 * 60 * 1000;

  return {
    permissions,
    expiry,
  };
}

/**
 * Check if permission is expired
 */
export function isPermissionExpired(expiry: number): boolean {
  return Date.now() > expiry;
}

/**
 * Get remaining time for permission
 */
export function getRemainingTime(expiry: number): {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = Date.now();
  const remaining = expiry - now;

  if (remaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: false };
}

/**
 * Session key storage (localStorage)
 */
export const SessionKeyStorage = {
  save(address: Address, sessionKey: string, expiry: number) {
    if (typeof window === "undefined") return;

    const data = {
      sessionKey,
      expiry,
      createdAt: Date.now(),
    };

    localStorage.setItem(`session_key_${address}`, JSON.stringify(data));
  },

  get(address: Address): { sessionKey: string; expiry: number } | null {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(`session_key_${address}`);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);

      // Check if expired
      if (isPermissionExpired(parsed.expiry)) {
        this.remove(address);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  },

  remove(address: Address) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`session_key_${address}`);
  },

  clear() {
    if (typeof window === "undefined") return;

    // Remove all session keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("session_key_")) {
        localStorage.removeItem(key);
      }
    });
  },
};
