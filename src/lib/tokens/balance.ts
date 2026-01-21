/**
 * Token Balance Utilities
 * Check USDC and ETH balances for users
 */

import { type Address, formatUnits } from "viem";
import { readContract } from "wagmi/actions";
import { USDCABI } from "@/lib/contracts/abis/USDCABI";
import { USDC_ADDRESSES } from "@/lib/constants";

/**
 * Get USDC balance for an address
 */
export async function getUSDCBalance(
  address: Address,
  chainId: number,
  config: any
): Promise<{
  raw: bigint;
  formatted: string;
  decimals: number;
}> {
  const usdcAddress =
    chainId === 8453
      ? USDC_ADDRESSES.BASE_MAINNET
      : USDC_ADDRESSES.BASE_SEPOLIA;

  try {
    const balance = (await readContract(config, {
      address: usdcAddress as Address,
      abi: USDCABI,
      functionName: "balanceOf",
      args: [address],
    })) as bigint;

    return {
      raw: balance,
      formatted: formatUnits(balance, 6),
      decimals: 6,
    };
  } catch (error) {
    console.error("Error fetching USDC balance:", error);
    return {
      raw: 0n,
      formatted: "0",
      decimals: 6,
    };
  }
}

/**
 * Check if user has sufficient USDC balance
 */
export function hasSufficientBalance(
  balance: bigint,
  required: bigint
): boolean {
  return balance >= required;
}

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: bigint | string): string {
  const amountBigInt = typeof amount === "string" ? BigInt(amount) : amount;
  return formatUnits(amountBigInt, 6);
}

/**
 * Parse USDC amount from user input
 */
export function parseUSDC(amount: string): bigint {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) {
    throw new Error("Invalid USDC amount");
  }
  return BigInt(Math.floor(num * 1_000_000));
}
