interface VotingEligibilityProps {
  canVote: boolean;
  reason?: string;
}

export function VotingEligibility({ canVote, reason }: VotingEligibilityProps) {
  if (canVote) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              You're Eligible to Vote
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Cast your vote below to help determine the winner
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">ℹ️</span>
        <div>
          <p className="font-semibold text-yellow-900 dark:text-yellow-100">
            Cannot Vote
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {reason || "You are not eligible to vote on this debate"}
          </p>
        </div>
      </div>
    </div>
  );
}
