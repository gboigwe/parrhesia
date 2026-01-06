"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VoterRewardsProps {
  userVoted: boolean;
  userVotedCorrectly: boolean;
  rewardAmount: string;
  reputationEarned: number;
  hasClaimed: boolean;
  onClaimReward?: () => Promise<void>;
}

export function VoterRewards({
  userVoted,
  userVotedCorrectly,
  rewardAmount,
  reputationEarned,
  hasClaimed,
  onClaimReward,
}: VoterRewardsProps) {
  if (!userVoted) {
    return null;
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
          Your Voter Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Participation Reward */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Participation Reward
                </span>
              </div>
              <Badge variant="secondary">+{reputationEarned} Rep</Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Thank you for participating in the voting process!
            </p>
          </div>

          {/* USDC Reward */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  USDC Reward
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {rewardAmount} USDC
                </p>
                {userVotedCorrectly && (
                  <div className="flex items-center gap-1 mt-2">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      You voted for the winner!
                    </span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
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

          {/* Claim Button */}
          {onClaimReward && (
            <div className="pt-2">
              {hasClaimed ? (
                <Button variant="outline" disabled className="w-full">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Reward Claimed
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={onClaimReward}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Claim Voter Reward
                </Button>
              )}
            </div>
          )}

          {/* Reward Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <strong>Did you know?</strong> Your reputation points help you
              unlock achievements and climb the leaderboard. Keep voting to earn
              more rewards!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
