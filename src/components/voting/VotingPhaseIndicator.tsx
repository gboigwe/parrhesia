import { getVotingTimeRemaining } from "@/lib/voting/utils";

interface VotingPhaseIndicatorProps {
  votingEndsAt: Date | null | undefined;
  totalVotes: number;
}

export function VotingPhaseIndicator({ votingEndsAt, totalVotes }: VotingPhaseIndicatorProps) {
  const timeRemaining = getVotingTimeRemaining(votingEndsAt);
  const isEnded = timeRemaining === "Ended";

  if (isEnded) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⏱️</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Voting Period Ended
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalVotes} vote{totalVotes !== 1 ? "s" : ""} received
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🗳️</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
            Voting Open
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {timeRemaining} • {totalVotes} vote{totalVotes !== 1 ? "s" : ""} so far
          </p>
        </div>
      </div>
    </div>
  );
}
