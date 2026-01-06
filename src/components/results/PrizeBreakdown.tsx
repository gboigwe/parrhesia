"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRIZE_DISTRIBUTION } from "@/lib/voting/constants";

interface PrizeBreakdownProps {
  prizePool: string;
  totalVotes: number;
  winnerId: string | null;
  winnerName?: string;
  isTie: boolean;
}

export function PrizeBreakdown({
  prizePool,
  totalVotes,
  winnerId,
  winnerName,
  isTie,
}: PrizeBreakdownProps) {
  const pool = parseFloat(prizePool);

  const platformFee = (pool * PRIZE_DISTRIBUTION.PLATFORM_FEE_PERCENT) / 100;
  const voterRewardPool =
    (pool * PRIZE_DISTRIBUTION.VOTER_REWARD_PERCENT) / 100;
  const winnerPrize = pool - platformFee - voterRewardPool;
  const perVoterReward = totalVotes > 0 ? voterRewardPool / totalVotes : 0;

  const formatUSDC = (amount: number): string => {
    return `${amount.toFixed(2)} USDC`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prize Distribution</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Breakdown of the {formatUSDC(pool)} prize pool
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Prize Pool */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Prize Pool
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatUSDC(pool)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Winner Prize */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Winner Prize
              </p>
              <Badge variant="default" className="bg-green-600">
                {PRIZE_DISTRIBUTION.WINNER_PERCENT}%
              </Badge>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatUSDC(winnerPrize)}
            </p>
            {winnerId && !isTie && winnerName && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Awarded to {winnerName}
              </p>
            )}
            {isTie && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Split equally between both debaters
              </p>
            )}
          </div>

          {/* Voter Rewards */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Voter Reward Pool
              </p>
              <Badge variant="secondary">
                {PRIZE_DISTRIBUTION.VOTER_REWARD_PERCENT}%
              </Badge>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatUSDC(voterRewardPool)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {totalVotes} voters • {formatUSDC(perVoterReward)} per voter
            </p>
          </div>

          {/* Platform Fee */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Platform Fee
              </p>
              <Badge variant="outline">
                {PRIZE_DISTRIBUTION.PLATFORM_FEE_PERCENT}%
              </Badge>
            </div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              {formatUSDC(platformFee)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Used for platform maintenance and development
            </p>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Distribution Breakdown
          </p>
          <div className="flex h-8 rounded-full overflow-hidden">
            <div
              className="bg-green-500 flex items-center justify-center text-xs font-semibold text-white"
              style={{ width: `${PRIZE_DISTRIBUTION.WINNER_PERCENT}%` }}
              title="Winner"
            >
              {PRIZE_DISTRIBUTION.WINNER_PERCENT}%
            </div>
            <div
              className="bg-purple-500 flex items-center justify-center text-xs font-semibold text-white"
              style={{ width: `${PRIZE_DISTRIBUTION.VOTER_REWARD_PERCENT}%` }}
              title="Voters"
            >
              {PRIZE_DISTRIBUTION.VOTER_REWARD_PERCENT}%
            </div>
            <div
              className="bg-gray-500 flex items-center justify-center text-xs font-semibold text-white"
              style={{ width: `${PRIZE_DISTRIBUTION.PLATFORM_FEE_PERCENT}%` }}
              title="Platform"
            >
              {PRIZE_DISTRIBUTION.PLATFORM_FEE_PERCENT}%
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Winner</span>
            <span>Voters</span>
            <span>Platform</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
