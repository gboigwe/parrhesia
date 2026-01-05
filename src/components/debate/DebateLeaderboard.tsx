import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  basename: string;
  avatar?: string;
  reputation: number;
  totalDebates: number;
  wins: number;
  losses: number;
  winRate: number;
  totalEarnings: number;
}

interface DebateLeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  showTop?: number;
  className?: string;
}

export function DebateLeaderboard({
  entries,
  title = "Top Debaters",
  showTop = 10,
  className,
}: DebateLeaderboardProps) {
  const displayEntries = entries.slice(0, showTop);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return ">G";
      case 2:
        return ">H";
      case 3:
        return ">I";
      default:
        return null;
    }
  };

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayEntries.map((entry) => {
            const rankEmoji = getRankEmoji(entry.rank);

            return (
              <div
                key={entry.userId}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                  entry.rank <= 3 && "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950"
                )}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 text-center">
                  {rankEmoji ? (
                    <span className="text-2xl">{rankEmoji}</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar
                    src={entry.avatar}
                    alt={entry.basename}
                    fallback={entry.basename[0].toUpperCase()}
                    size="default"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {entry.basename}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>{entry.totalDebates} debates</span>
                      <span>"</span>
                      <span className="text-green-600 dark:text-green-400">
                        {entry.winRate.toFixed(0)}% win rate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {entry.reputation}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Reputation
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                      ${entry.totalEarnings.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Earned
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {entries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No debaters yet. Be the first!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
