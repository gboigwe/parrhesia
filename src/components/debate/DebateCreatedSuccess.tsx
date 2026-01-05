import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface DebateCreatedSuccessProps {
  debateId: string;
  title: string;
  category: string;
  stakeAmount: number;
  transactionHash?: string;
}

export function DebateCreatedSuccess({
  debateId,
  title,
  category,
  stakeAmount,
  transactionHash,
}: DebateCreatedSuccessProps) {
  const shareText = `Check out my new debate on Parrhesia: ${title}`;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/debates/${debateId}`;

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Debate Created Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your debate is now live and waiting for a challenger
            </p>
          </div>

          {/* Debate Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Title
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Category
                </p>
                <Badge variant="outline">{category}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Stake Amount
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {stakeAmount} USDC
                </p>
              </div>
            </div>

            {transactionHash && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Transaction
                </p>
                <a
                  href={`https://basescan.org/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  View on BaseScan ’
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href={`/debates/${debateId}`} className="block">
              <Button variant="primary" className="w-full">
                View Debate
              </Button>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/debates" className="block">
                <Button variant="outline" className="w-full">
                  Browse Debates
                </Button>
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: shareText,
                      url: shareUrl,
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Share
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">1.</span>
                <span>
                  Other users can now challenge your debate by matching your
                  stake
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">2.</span>
                <span>Once accepted, you'll have time to present arguments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">3.</span>
                <span>
                  After arguments conclude, the community votes on the winner
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">4.</span>
                <span>Winner takes the prize pool (minus platform fee)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
