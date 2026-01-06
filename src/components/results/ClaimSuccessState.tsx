"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ClaimSuccessStateProps {
  prizeAmount: string;
  transactionHash?: string;
  reputationEarned: number;
  debateId: string;
  type: "winner" | "voter";
}

export function ClaimSuccessState({
  prizeAmount,
  transactionHash,
  reputationEarned,
  debateId,
  type,
}: ClaimSuccessStateProps) {
  return (
    <Card className="border-2 border-green-500 dark:border-green-400">
      <CardContent className="p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
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
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {type === "winner" ? "Prize Claimed Successfully!" : "Reward Claimed Successfully!"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your {type === "winner" ? "prize" : "reward"} has been transferred to your wallet
          </p>

          {/* Prize Details */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Amount Received
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {prizeAmount} USDC
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Reputation Earned
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                +{reputationEarned} Points
              </p>
            </div>

            {transactionHash && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Transaction Hash
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xs bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 font-mono">
                    {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                  </code>
                  <a
                    href={`https://basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-6 text-left">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  What's Next?
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Your reputation has been updated onchain</li>
                  <li>• Check your profile to see your new stats</li>
                  <li>
                    • Continue debating to earn more rewards and climb the
                    leaderboard
                  </li>
                  {type === "winner" && <li>• Your win has been recorded in your debate history</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/debates/${debateId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Debate
              </Button>
            </Link>
            <Link href="/profile" className="flex-1">
              <Button variant="secondary" className="w-full">
                View Profile
              </Button>
            </Link>
            <Link href="/debates" className="flex-1">
              <Button variant="primary" className="w-full">
                Browse More Debates
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
