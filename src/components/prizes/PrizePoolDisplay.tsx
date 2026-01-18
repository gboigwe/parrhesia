/**
 * Prize Pool Display Component
 * Shows prize pool breakdown and distribution
 */

"use client";

import { useEffect, useState } from "react";
import { useConfig } from "wagmi";
import { getPoolState } from "@/lib/prizes/verification";
import type { PrizePoolState } from "@/lib/prizes/types";

interface PrizePoolDisplayProps {
  contractAddress: string;
  debateStatus: "pending" | "active" | "finalized";
}

export function PrizePoolDisplay({
  contractAddress,
  debateStatus,
}: PrizePoolDisplayProps) {
  const config = useConfig();
  const [poolState, setPoolState] = useState<PrizePoolState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoolState() {
      try {
        if (!contractAddress) return;
        const state = await getPoolState(contractAddress, config);
        setPoolState(state);
      } catch (error) {
        console.error("Failed to fetch pool state:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoolState();
  }, [contractAddress, config]);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!poolState) {
    return null;
  }

  const totalUSDC = parseFloat(poolState.totalStaked) / 1e6;
  const platformFeeUSDC = parseFloat(poolState.platformFee) / 1e6;
  const winnerPrize = totalUSDC - platformFeeUSDC;

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <h3 className="text-lg font-bold mb-4">Prize Pool</h3>

      <div className="space-y-4">
        <div className="text-center py-4 bg-white rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Pool</p>
          <p className="text-4xl font-bold text-purple-700">
            {totalUSDC.toFixed(2)} USDC
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PoolDetailCard
            label="Winner Gets"
            value={`${winnerPrize.toFixed(2)} USDC`}
            highlight
          />
          <PoolDetailCard
            label="Platform Fee"
            value={`${platformFeeUSDC.toFixed(2)} USDC`}
          />
        </div>

        {poolState.isFinalized && poolState.winner && (
          <div className="pt-4 border-t">
            <div className="bg-green-100 border border-green-300 rounded p-3">
              <p className="text-sm font-semibold text-green-800">
                Winner Determined
              </p>
              <p className="text-xs text-gray-700 mt-1 font-mono break-all">
                {poolState.winner}
              </p>
            </div>
          </div>
        )}

        {poolState.prizeClaimed && (
          <div className="bg-blue-100 border border-blue-300 rounded p-3">
            <p className="text-sm font-semibold text-blue-800 flex items-center gap-2">
              <span>✓</span>
              <span>Prize Claimed</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface PoolDetailCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function PoolDetailCard({ label, value, highlight }: PoolDetailCardProps) {
  return (
    <div
      className={`p-3 rounded-lg ${
        highlight ? "bg-purple-100 border border-purple-300" : "bg-white"
      }`}
    >
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p
        className={`font-bold ${
          highlight ? "text-purple-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
