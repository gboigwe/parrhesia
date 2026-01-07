"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankBadge } from "./RankBadge";
import { getReputationTier } from "@/lib/reputation/calculateReputation";
import Link from "next/link";

interface UserReputationCardProps {
  reputation: number;
  rank: number | null;
  totalUsers: number;
  reputationChange: number;
  type: "debater" | "voter";
}

export function UserReputationCard({
  reputation,
  rank,
  totalUsers,
  reputationChange,
  type,
}: UserReputationCardProps) {
  const tier = getReputationTier(reputation);
  const percentile = rank && totalUsers > 0 ?
    ((totalUsers - rank + 1) / totalUsers) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reputation</span>
          <RankBadge reputation={reputation} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Reputation Score */}
          <div className="text-center">
            <p className={`text-5xl font-bold ${tier.color}`}>
              {reputation.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {tier.tier} {type === "debater" ? "Debater" : "Voter"}
            </p>
          </div>

          {/* Rank */}
          {rank && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                #{rank}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Top {percentile.toFixed(0)}% of {totalUsers.toLocaleString()} {type}s
              </p>
            </div>
          )}

          {/* Change Indicator */}
          {reputationChange !== 0 && (
            <div className="flex items-center justify-center gap-2">
              {reputationChange > 0 ? (
                <>
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
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
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    +{reputationChange.toFixed(1)} since last update
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
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
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {reputationChange.toFixed(1)} since last update
                  </span>
                </>
              )}
            </div>
          )}

          {/* Progress to Next Tier */}
          {tier.tier !== "Legendary" && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{tier.tier}</span>
                <span>{tier.maxScore + 1}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${tier.color.replace("text-", "bg-")} h-2 rounded-full transition-all duration-500`}
                  style={{
                    width: `${((reputation - tier.minScore) / (tier.maxScore - tier.minScore + 1)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                {(tier.maxScore + 1 - reputation).toFixed(1)} points to next tier
              </p>
            </div>
          )}

          {/* Link to Leaderboard */}
          <Link
            href="/leaderboard"
            className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Full Leaderboard →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
