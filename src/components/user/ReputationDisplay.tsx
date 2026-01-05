import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReputationDisplayProps {
  reputation: number;
  rank?: string;
  percentile?: number;
  history?: Array<{
    amount: number;
    reason: string;
    date: Date;
  }>;
  className?: string;
}

const getReputationTier = (reputation: number) => {
  if (reputation >= 5000) return { name: "Legendary", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950" };
  if (reputation >= 2500) return { name: "Master", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" };
  if (reputation >= 1000) return { name: "Expert", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950" };
  if (reputation >= 500) return { name: "Advanced", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950" };
  if (reputation >= 100) return { name: "Intermediate", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950" };
  return { name: "Beginner", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-950" };
};

export function ReputationDisplay({
  reputation,
  rank,
  percentile,
  history = [],
  className,
}: ReputationDisplayProps) {
  const tier = getReputationTier(reputation);
  const nextTier = reputation < 100 ? 100 : reputation < 500 ? 500 : reputation < 1000 ? 1000 : reputation < 2500 ? 2500 : 5000;
  const progress = ((reputation % nextTier) / nextTier) * 100;

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <CardTitle>Reputation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Reputation */}
        <div className={cn("text-center p-6 rounded-lg", tier.bg)}>
          <div className={cn("text-5xl font-bold mb-2", tier.color)}>
            {reputation}
          </div>
          <Badge variant="outline" className="mb-2">
            {tier.name}
          </Badge>
          {rank && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Rank #{rank}
            </div>
          )}
          {percentile && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Top {percentile}% of debaters
            </div>
          )}
        </div>

        {/* Progress to Next Tier */}
        {reputation < 5000 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Next tier: {getReputationTier(nextTier).name}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {reputation} / {nextTier}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Reputation Breakdown */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            How to Earn Reputation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Win Debate</span>
              <span className="font-semibold text-green-600 dark:text-green-400">+50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lose Debate</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">+10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cast Vote</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">+2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Create Debate</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">+5</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {history.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Recent Changes
            </h4>
            <div className="space-y-2">
              {history.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-white">{item.reason}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-semibold",
                      item.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
