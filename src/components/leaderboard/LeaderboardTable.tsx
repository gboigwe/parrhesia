"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  basename: string;
  address: string;
  reputation: number;
  wins?: number;
  losses?: number;
  totalDebates?: number;
  winRate?: number;
  totalVotes?: number;
  correctVotes?: number;
  accuracy?: number;
  reputationChange?: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  type: "debaters" | "voters";
  category?: string;
}

export function LeaderboardTable({
  entries,
  type,
  category,
}: LeaderboardTableProps) {
  const getRankBadgeColor = (rank: number): string => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-orange-600 text-white";
    return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return null;
  };

  const getReputationColor = (reputation: number): string => {
    if (reputation >= 90) return "text-purple-600 dark:text-purple-400";
    if (reputation >= 75) return "text-blue-600 dark:text-blue-400";
    if (reputation >= 60) return "text-green-600 dark:text-green-400";
    if (reputation >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              No {type} found{category ? ` in ${category}` : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "debaters" ? "Top Debaters" : "Top Voters"}
          {category && ` - ${category}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Rank
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  User
                </th>
                <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reputation
                </th>
                {type === "debaters" ? (
                  <>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      W/L
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Win Rate
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Votes
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Accuracy
                    </th>
                  </>
                )}
                <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.userId}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Rank */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${getRankBadgeColor(entry.rank)} min-w-[2.5rem] justify-center`}
                      >
                        {entry.rank <= 3 && getRankIcon(entry.rank)}
                        {entry.rank <= 3 ? "" : `#${entry.rank}`}
                      </Badge>
                    </div>
                  </td>

                  {/* User */}
                  <td className="p-3">
                    <Link
                      href={`/profile/${entry.address}`}
                      className="hover:underline"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {entry.basename.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.basename}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Reputation */}
                  <td className="p-3 text-right">
                    <span
                      className={`text-lg font-bold ${getReputationColor(entry.reputation)}`}
                    >
                      {entry.reputation.toFixed(1)}
                    </span>
                  </td>

                  {/* Type-specific stats */}
                  {type === "debaters" ? (
                    <>
                      <td className="p-3 text-right">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.wins || 0}/{entry.losses || 0}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Badge variant="outline">
                          {entry.winRate?.toFixed(1) || 0}%
                        </Badge>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 text-right">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.totalVotes || 0}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Badge variant="outline">
                          {entry.accuracy?.toFixed(1) || 0}%
                        </Badge>
                      </td>
                    </>
                  )}

                  {/* Reputation Change */}
                  <td className="p-3 text-right">
                    {entry.reputationChange !== undefined &&
                    entry.reputationChange !== 0 ? (
                      <div
                        className={`flex items-center justify-end gap-1 text-sm ${
                          entry.reputationChange > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {entry.reputationChange > 0 ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        )}
                        <span>{Math.abs(entry.reputationChange).toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-600">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
