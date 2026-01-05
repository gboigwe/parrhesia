"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESSES } from "@/lib/constants";
import { baseSepolia, base } from "wagmi/chains";

const USDC_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface USDCBalanceProps {
  showLabel?: boolean;
  className?: string;
}

export function USDCBalance({ showLabel = true, className = "" }: USDCBalanceProps) {
  const { address } = useAccount();
  const chainId = useChainId();

  const usdcAddress =
    chainId === baseSepolia.id
      ? USDC_ADDRESSES.BASE_SEPOLIA
      : USDC_ADDRESSES.BASE_MAINNET;

  const { data: balance, isLoading } = useReadContract({
    address: usdcAddress as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={className}>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading balance...</span>
      </div>
    );
  }

  const formattedBalance = balance ? formatUnits(balance, 6) : "0";

  return (
    <div className={className}>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">USDC Balance:</span>
      )}
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {parseFloat(formattedBalance).toFixed(2)} USDC
      </span>
    </div>
  );
}

/**
 * Hook to get USDC balance
 */
export function useUSDCBalance() {
  const { address } = useAccount();
  const chainId = useChainId();

  const usdcAddress =
    chainId === baseSepolia.id
      ? USDC_ADDRESSES.BASE_SEPOLIA
      : USDC_ADDRESSES.BASE_MAINNET;

  const { data: balance, isLoading } = useReadContract({
    address: usdcAddress as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const formattedBalance = balance ? parseFloat(formatUnits(balance, 6)) : 0;

  return {
    balance: formattedBalance,
    rawBalance: balance,
    isLoading,
    hasBalance: formattedBalance > 0,
  };
}
