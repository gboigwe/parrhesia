import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DebateHistoryEntry {
  id: string;
  title: string;
  opponentBasename: string;
  opponentAvatar?: string;
  role: "creator" | "challenger";
  result: "won" | "lost" | "draw" | "ongoing";
  category: string;
  stakeAmount: number;
  earnedAmount?: number;
  votingScore?: number;
  completedAt?: Date;
  createdAt: Date;
}

interface DebateHistoryProps {
  debates: DebateHistoryEntry[];
  showAll?: boolean;
  maxItems?: number;
  className?: string;
}

const resultConfig = {
  won: {
    label: "Won",
    variant: "success" as const,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
  },
  lost: {
    label: "Lost",
    variant: "destructive" as const,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
  },
  draw: {
    label: "Draw",
    variant: "outline" as const,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
  },
  ongoing: {
    label: "Ongoing",
    variant: "primary" as const,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
};

export function DebateHistory({
  debates,
  showAll = false,
  maxItems = 10,
  className,
}: DebateHistoryProps) {
  const displayDebates = showAll ? debates : debates.slice(0, maxItems);

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Debate History</CardTitle>
          <Badge variant="outline">{debates.length} total</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {displayDebates.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No debates yet. Start your first debate!
          </div>
        ) : (
          <div className="space-y-3">
            {displayDebates.map((debate) => {
              const config = resultConfig[debate.result];

              return (
                <Link
                  key={debate.id}
                  href={`/debates/${debate.id}`}
                  className={cn(
                    "block p-4 rounded-lg border transition-all hover:shadow-md",
                    config.bg,
                    "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Opponent Avatar */}
                    <Avatar
                      src={debate.opponentAvatar}
                      alt={debate.opponentBasename}
                      fallback={debate.opponentBasename[0].toUpperCase()}
                      size="default"
                    />

                    {/* Debate Info */}
                    <div className="flex-1 min-w-0">
                      {/* Title & Result */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {debate.title}
                        </h4>
                        <Badge variant={config.variant} size="sm">
                          {config.label}
                        </Badge>
                      </div>

                      {/* Opponent & Role */}
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          vs {debate.opponentBasename}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">"</span>
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {debate.role}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-500">
                            Category
                          </span>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {debate.category}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-500">
                            Stake
                          </span>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ${debate.stakeAmount}
                          </div>
                        </div>
                        {debate.earnedAmount !== undefined && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">
                              Earned
                            </span>
                            <div
                              className={cn(
                                "font-semibold",
                                debate.earnedAmount > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-900 dark:text-white"
                              )}
                            >
                              ${debate.earnedAmount.toFixed(2)}
                            </div>
                          </div>
                        )}
                        {debate.votingScore !== undefined && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">
                              Score
                            </span>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {debate.votingScore.toFixed(1)}/10
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        {debate.completedAt
                          ? `Completed ${new Date(
                              debate.completedAt
                            ).toLocaleDateString()}`
                          : `Created ${new Date(
                              debate.createdAt
                            ).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!showAll && debates.length > maxItems && (
          <div className="mt-4 text-center">
            <Link
              href="/debates"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all {debates.length} debates ’
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
