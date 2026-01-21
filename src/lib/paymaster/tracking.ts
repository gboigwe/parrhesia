/**
 * Gas Sponsorship Tracking
 * Records and monitors paymaster-sponsored transactions
 */

import { type Hash, type TransactionReceipt } from "viem";
import { SponsorshipType } from "./config";

/**
 * Transaction sponsorship data
 */
export interface SponsorshipData {
  transactionHash: Hash;
  userOperationHash?: Hash;
  userId: string;
  debateId?: string;
  operationType: SponsorshipType;
  gasUsed: bigint;
  gasPrice?: bigint;
  totalGasCost: bigint;
  paymasterAddress?: string;
  entryPoint: string;
  blockNumber: bigint;
  chainId: bigint;
  metadata?: Record<string, unknown>;
}

/**
 * Track a sponsored transaction
 */
export async function trackSponsoredTransaction(
  data: SponsorshipData
): Promise<void> {
  try {
    const response = await fetch("/api/paymaster/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionHash: data.transactionHash,
        userOperationHash: data.userOperationHash,
        userId: data.userId,
        debateId: data.debateId,
        operationType: data.operationType,
        gasUsed: data.gasUsed.toString(),
        gasPrice: data.gasPrice?.toString(),
        totalGasCost: data.totalGasCost.toString(),
        paymasterAddress: data.paymasterAddress,
        entryPoint: data.entryPoint,
        blockNumber: data.blockNumber.toString(),
        chainId: data.chainId.toString(),
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      }),
    });

    if (!response.ok) {
      console.error("Failed to track sponsored transaction:", await response.text());
    }
  } catch (error) {
    console.error("Error tracking sponsored transaction:", error);
  }
}

/**
 * Create sponsorship data from transaction receipt
 */
export function createSponsorshipData(
  receipt: TransactionReceipt,
  userId: string,
  operationType: SponsorshipType,
  options?: {
    debateId?: string;
    userOperationHash?: Hash;
    paymasterAddress?: string;
    metadata?: Record<string, unknown>;
  }
): SponsorshipData {
  const effectiveGasPrice = receipt.effectiveGasPrice || 0n;
  const totalGasCost = receipt.gasUsed * effectiveGasPrice;

  return {
    transactionHash: receipt.transactionHash,
    userOperationHash: options?.userOperationHash,
    userId,
    debateId: options?.debateId,
    operationType,
    gasUsed: receipt.gasUsed,
    gasPrice: effectiveGasPrice,
    totalGasCost,
    paymasterAddress: options?.paymasterAddress,
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    blockNumber: receipt.blockNumber,
    chainId: BigInt(receipt.chainId || 8453),
    metadata: options?.metadata,
  };
}

/**
 * Get gas sponsorship statistics for a user
 */
export async function getUserGasStats(userId: string): Promise<{
  totalTransactions: number;
  totalGasSponsored: string;
  byOperationType: Record<string, { count: number; totalGas: string }>;
}> {
  try {
    const response = await fetch(`/api/paymaster/stats/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user gas stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user gas stats:", error);
    return {
      totalTransactions: 0,
      totalGasSponsored: "0",
      byOperationType: {},
    };
  }
}

/**
 * Get gas sponsorship statistics for a debate
 */
export async function getDebateGasStats(debateId: string): Promise<{
  totalTransactions: number;
  totalGasSponsored: string;
  byOperationType: Record<string, { count: number; totalGas: string }>;
}> {
  try {
    const response = await fetch(`/api/paymaster/stats/debate/${debateId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch debate gas stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching debate gas stats:", error);
    return {
      totalTransactions: 0,
      totalGasSponsored: "0",
      byOperationType: {},
    };
  }
}
