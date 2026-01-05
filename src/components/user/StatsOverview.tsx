import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

interface StatsOverviewProps {
  stats: {
    totalDebates: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    totalEarnings: number;
    totalStaked: number;
    averageScore: number;
    votesGiven: number;
    reputation: number;
    rank?: number;
    percentile?: number;
    streak?: number;
    favoriteCategory?: string;
  };
  timeframe?: "all" | "month" | "week";
  className?: string;
}

export function StatsOverview({
  stats,
  timeframe = "all",
  className,
}: StatsOverviewProps) {
  const primaryStats: StatItem[] = [
    {
      label: "Total Debates",
      value: stats.totalDebates,
      icon: "=¬",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Win Rate",
      value: `${stats.winRate.toFixed(1)}%`,
      icon: "<¯",
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: "=°",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Reputation",
      value: stats.reputation,
      icon: "P",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  const detailedStats: StatItem[] = [
    {
      label: "Wins",
      value: stats.wins,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Losses",
      value: stats.losses,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Draws",
      value: stats.draws,
      color: "text-gray-600 dark:text-gray-400",
    },
    {
      label: "Avg Score",
      value: stats.averageScore.toFixed(1),
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Staked",
      value: `$${stats.totalStaked.toFixed(2)}`,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Votes Given",
      value: stats.votesGiven,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  const additionalStats: StatItem[] = [];

  if (stats.rank) {
    additionalStats.push({
      label: "Global Rank",
      value: `#${stats.rank}`,
      icon: "<Æ",
      color: "text-yellow-600 dark:text-yellow-400",
    });
  }

  if (stats.percentile) {
    additionalStats.push({
      label: "Top Percentile",
      value: `${stats.percentile}%`,
      icon: "=Ê",
      color: "text-blue-600 dark:text-blue-400",
    });
  }

  if (stats.streak !== undefined && stats.streak > 0) {
    additionalStats.push({
      label: "Win Streak",
      value: stats.streak,
      icon: "=%",
      color: "text-red-600 dark:text-red-400",
    });
  }

  if (stats.favoriteCategory) {
    additionalStats.push({
      label: "Favorite Topic",
      value: stats.favoriteCategory,
      icon: "=Ú",
      color: "text-purple-600 dark:text-purple-400",
    });
  }

  const timeframeLabels = {
    all: "All Time",
    month: "This Month",
    week: "This Week",
  };

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Statistics</CardTitle>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {timeframeLabels[timeframe]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {primaryStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              {stat.icon && <div className="text-3xl mb-2">{stat.icon}</div>}
              <div className={cn("text-2xl font-bold mb-1", stat.color)}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Stats */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Detailed Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {detailedStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </span>
                <span className={cn("text-xl font-bold", stat.color)}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        {additionalStats.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Achievements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {additionalStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                >
                  {stat.icon && <span className="text-2xl">{stat.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-bold truncate", stat.color)}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Win/Loss Chart (Visual Representation) */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Performance Overview
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-8 rounded-lg overflow-hidden flex">
              {stats.wins > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
                  style={{
                    width: `${
                      (stats.wins / stats.totalDebates) * 100
                    }%`,
                  }}
                >
                  {stats.wins > 0 && stats.wins}
                </div>
              )}
              {stats.draws > 0 && (
                <div
                  className="bg-gray-400 flex items-center justify-center text-white text-xs font-semibold"
                  style={{
                    width: `${
                      (stats.draws / stats.totalDebates) * 100
                    }%`,
                  }}
                >
                  {stats.draws > 0 && stats.draws}
                </div>
              )}
              {stats.losses > 0 && (
                <div
                  className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
                  style={{
                    width: `${
                      (stats.losses / stats.totalDebates) * 100
                    }%`,
                  }}
                >
                  {stats.losses > 0 && stats.losses}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">
                Wins ({stats.wins})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-400 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">
                Draws ({stats.draws})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">
                Losses ({stats.losses})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
