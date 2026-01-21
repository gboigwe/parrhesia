/**
 * Paymaster Client for Gas Sponsorship
 * Handles user operation sponsorship through Base paymaster
 */

import { type Address, type Chain, type Hash, http, createPublicClient } from "viem";
import { base, baseSepolia } from "viem/chains";
import {
  getPaymasterUrl,
  isPaymasterEnabled,
  getEntryPoint,
  type PaymasterContext,
} from "./config";

/**
 * User operation for ERC-4337 account abstraction
 */
export interface UserOperation {
  sender: Address;
  nonce: bigint;
  initCode: `0x${string}`;
  callData: `0x${string}`;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: `0x${string}`;
  signature: `0x${string}`;
}

/**
 * Paymaster response for sponsorship
 */
export interface PaymasterSponsorshipResponse {
  paymasterAndData: `0x${string}`;
  preVerificationGas: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
}

/**
 * Create public client for chain
 */
function getPublicClient(chainId: number) {
  const chain = chainId === base.id ? base : baseSepolia;
  return createPublicClient({
    chain,
    transport: http(),
  });
}

/**
 * Request paymaster sponsorship for a user operation
 */
export async function requestPaymasterSponsorship(
  userOp: Partial<UserOperation>,
  chainId: number,
  context?: PaymasterContext
): Promise<PaymasterSponsorshipResponse> {
  const paymasterUrl = getPaymasterUrl(chainId);

  if (!paymasterUrl || !isPaymasterEnabled(chainId)) {
    throw new Error(`Paymaster not configured for chain ${chainId}`);
  }

  const entryPoint = getEntryPoint(chainId);

  try {
    const response = await fetch(paymasterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "pm_sponsorUserOperation",
        params: [
          {
            ...userOp,
            entryPoint,
          },
          entryPoint,
          context,
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Paymaster request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Paymaster error: ${data.error.message}`);
    }

    return {
      paymasterAndData: data.result.paymasterAndData,
      preVerificationGas: BigInt(data.result.preVerificationGas),
      verificationGasLimit: BigInt(data.result.verificationGasLimit),
      callGasLimit: BigInt(data.result.callGasLimit),
    };
  } catch (error) {
    console.error("Paymaster sponsorship failed:", error);
    throw error;
  }
}

/**
 * Check if paymaster is available for a chain
 */
export function checkPaymasterAvailability(chainId: number): {
  available: boolean;
  url?: string;
  reason?: string;
} {
  const url = getPaymasterUrl(chainId);
  const enabled = isPaymasterEnabled(chainId);

  if (!url) {
    return {
      available: false,
      reason: "Paymaster URL not configured",
    };
  }

  if (!enabled) {
    return {
      available: false,
      url,
      reason: "Paymaster is disabled",
    };
  }

  return {
    available: true,
    url,
  };
}

/**
 * Estimate gas for sponsored user operation
 */
export async function estimateSponsoredGas(
  userOp: Partial<UserOperation>,
  chainId: number
): Promise<{
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
}> {
  const paymasterUrl = getPaymasterUrl(chainId);

  if (!paymasterUrl) {
    throw new Error(`Paymaster not configured for chain ${chainId}`);
  }

  const entryPoint = getEntryPoint(chainId);

  try {
    const response = await fetch(paymasterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_estimateUserOperationGas",
        params: [userOp, entryPoint],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Gas estimation failed: ${data.error.message}`);
    }

    return {
      callGasLimit: BigInt(data.result.callGasLimit),
      verificationGasLimit: BigInt(data.result.verificationGasLimit),
      preVerificationGas: BigInt(data.result.preVerificationGas),
    };
  } catch (error) {
    console.error("Gas estimation failed:", error);
    throw error;
  }
}
