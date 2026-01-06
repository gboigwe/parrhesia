import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VotingEligibilityBannerProps {
  debateId: string;
  debateStatus: string;
  isParticipant: boolean;
  hasVoted: boolean;
  votingEndsAt?: Date | null;
}

export function VotingEligibilityBanner({
  debateId,
  debateStatus,
  isParticipant,
  hasVoted,
  votingEndsAt,
}: VotingEligibilityBannerProps) {
  // Not in voting phase
  if (debateStatus !== "voting") {
    return null;
  }

  // User is a participant
  if (isParticipant) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5"
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
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                As a participant in this debate, you cannot vote. Results will be
                available once voting closes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User has already voted
  if (hasVoted) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
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
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                You've already voted!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thank you for participating. Results will be available once voting closes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User can vote
  const timeRemaining = votingEndsAt
    ? getTimeRemaining(votingEndsAt)
    : "Unknown";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Voting is Open!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Cast your vote to help determine the winner of this debate.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ⏰ {timeRemaining}
              </p>
            </div>
          </div>
          <Link href={`/debates/${debateId}/vote`}>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Cast Your Vote
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeRemaining(votingEndsAt: Date): string {
  const now = new Date();
  const end = new Date(votingEndsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Voting has ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} remaining`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes}m remaining`;
}
