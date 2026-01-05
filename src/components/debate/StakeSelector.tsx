"use client";

import { Badge } from "@/components/ui/badge";
import { DEBATE_TIMING } from "@/lib/debate/constants";
import { cn } from "@/lib/utils";

interface StakeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  usdcBalance?: number;
  className?: string;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100, 250, 500, 1000];

export function StakeSelector({
  value,
  onChange,
  usdcBalance = 0,
  className,
}: StakeSelectorProps) {
  const isCustomAmount = !PRESET_AMOUNTS.includes(value);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Stake Amount (USDC)
        </label>
        <Badge variant="outline" className="text-xs">
          Balance: {usdcBalance.toFixed(2)} USDC
        </Badge>
      </div>

      {/* Preset Amounts */}
      <div className="grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(amount)}
            disabled={amount > usdcBalance}
            className={cn(
              "px-3 py-2 border-2 rounded-lg text-sm font-semibold transition-all",
              value === amount
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400",
              amount > usdcBalance &&
                "opacity-50 cursor-not-allowed hover:border-gray-300"
            )}
          >
            {amount}
          </button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
          Or enter custom amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={isCustomAmount ? value : ""}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={`${DEBATE_TIMING.MIN_STAKE_AMOUNT} - ${DEBATE_TIMING.MAX_STAKE_AMOUNT}`}
            min={DEBATE_TIMING.MIN_STAKE_AMOUNT}
            max={Math.min(
              DEBATE_TIMING.MAX_STAKE_AMOUNT,
              usdcBalance
            )}
            step={1}
            className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
            USDC
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Min: {DEBATE_TIMING.MIN_STAKE_AMOUNT} " Max:{" "}
          {DEBATE_TIMING.MAX_STAKE_AMOUNT}
        </p>
      </div>

      {/* Insufficient Balance Warning */}
      {value > usdcBalance && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Insufficient USDC balance. You need {value} USDC but only have{" "}
            {usdcBalance.toFixed(2)} USDC.
          </p>
        </div>
      )}

      {/* Prize Pool Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Your stake</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {value} USDC
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Challenger stake
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {value} USDC
          </span>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Total prize pool
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {(value * 2).toFixed(2)} USDC
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Winner receives 85% (platform fee: 5%, voters: 10%)
          </p>
        </div>
      </div>
    </div>
  );
}
