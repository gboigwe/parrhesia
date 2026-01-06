import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VoteSuccessStateProps {
  debateId: string;
  winnerName: string;
  weightedScore: number;
  transactionHash?: string;
}

export function VoteSuccessState({
  debateId,
  winnerName,
  weightedScore,
  transactionHash,
}: VoteSuccessStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="max-w-md mx-auto">
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

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Vote Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for participating in this debate. Your vote has been recorded
            on-chain.
          </p>

          {/* Vote Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Your Vote:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {winnerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Weighted Score:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {weightedScore.toFixed(1)}/10
                </span>
              </div>
              {transactionHash && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Transaction Hash:
                  </p>
                  <code className="text-xs text-gray-700 dark:text-gray-300 break-all">
                    {transactionHash}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 mb-8 text-left">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
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
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Results will be available once voting closes and all votes are tallied
                </p>
              </div>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex gap-2">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0"
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
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  You've earned reputation points for voting! Check your profile to see
                  your updated score.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/debates/${debateId}`}>
              <Button variant="outline" size="lg">
                Back to Debate
              </Button>
            </Link>
            <Link href="/debates">
              <Button variant="primary" size="lg">
                Browse More Debates
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
