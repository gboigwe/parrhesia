import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StakeDisplayProps {
  creatorStake: number;
  challengerStake?: number;
  totalPrizePool: number;
  platformFee?: number;
  className?: string;
}

export function StakeDisplay({
  creatorStake,
  challengerStake,
  totalPrizePool,
  platformFee = 5,
  className,
}: StakeDisplayProps) {
  const winnerPrize = totalPrizePool * (1 - platformFee / 100);
  const platformCut = totalPrizePool * (platformFee / 100);

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Prize Pool
            </h3>
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {totalPrizePool.toFixed(2)} USDC
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                Creator Stake
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {creatorStake.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">USDC</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4">
              <div className="text-xs text-purple-700 dark:text-purple-300 mb-1">
                Challenger Stake
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {challengerStake ? challengerStake.toFixed(2) : ""}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                {challengerStake ? "USDC" : "Not joined"}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Winner receives</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {winnerPrize.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-500">
                Platform fee ({platformFee}%)
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {platformCut.toFixed(2)} USDC
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
            <p className="flex items-start gap-2">
              <span className="text-base">9</span>
              <span>
                Winner takes {(100 - platformFee)}% of the total prize pool. Platform fee supports development and moderation.
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
