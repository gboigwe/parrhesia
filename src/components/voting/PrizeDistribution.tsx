import { calculatePrizeDistribution } from "@/lib/voting/utils";

interface PrizeDistributionProps {
  prizePool: number;
  totalVotes: number;
  winnerName?: string;
}

export function PrizeDistribution({ prizePool, totalVotes, winnerName }: PrizeDistributionProps) {
  const distribution = calculatePrizeDistribution(prizePool, totalVotes);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
        <span>💰</span>
        Prize Distribution
      </h3>

      <div className="space-y-4">
        {/* Winner Prize */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {winnerName ? `Winner (${winnerName})` : "Winner"}
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {distribution.winnerPrize.toFixed(2)} USDC
              </div>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
        </div>

        {/* Voter Rewards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Voter Rewards</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {distribution.voterRewardPool.toFixed(2)} USDC
              </div>
            </div>
          </div>
          {totalVotes > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {distribution.perVoterReward.toFixed(4)} USDC per voter ({totalVotes} voters)
            </div>
          )}
        </div>

        {/* Platform Fee */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Platform Fee (5%)</div>
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {distribution.platformFee.toFixed(2)} USDC
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Total Prize Pool
            </span>
            <span className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
              {prizePool.toFixed(2)} USDC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
