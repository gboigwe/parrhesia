/**
 * Balance Display Component
 * Shows user's USDC balance
 */

"use client";

import { useEffect, useState } from "react";
import { useAccount, useConfig, useChainId } from "wagmi";
import { getUSDCBalance } from "@/lib/tokens/balance";

export function BalanceDisplay() {
  const { address } = useAccount();
  const config = useConfig();
  const chainId = useChainId();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (!address) return;

      setIsLoading(true);
      try {
        const result = await getUSDCBalance(address, chainId, config);
        setBalance(result.formatted);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [address, chainId, config]);

  if (!address) return null;

  return (
    <div className="bg-gray-50 border rounded-lg p-3">
      <p className="text-sm text-gray-600 mb-1">Your USDC Balance</p>
      <p className="text-lg font-semibold text-gray-900">
        {isLoading ? "Loading..." : `${parseFloat(balance).toFixed(2)} USDC`}
      </p>
    </div>
  );
}
