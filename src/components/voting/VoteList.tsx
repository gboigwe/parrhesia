import { VOTING_CRITERIA } from "@/lib/voting/constants";

interface Vote {
  id: string;
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  totalScore: string;
  feedback?: string | null;
  submittedAt: Date;
  voter: {
    basename: string;
    voterReputation: string;
  };
}

interface VoteListProps {
  votes: Vote[];
  creatorId: string;
  challengerId: string;
  creatorName: string;
  challengerName: string;
}

export function VoteList({
  votes,
  creatorId,
  challengerId,
  creatorName,
  challengerName,
}: VoteListProps) {
  if (votes.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No votes yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Be the first to vote on this debate
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        All Votes ({votes.length})
      </h3>

      <div className="space-y-3">
        {votes.map((vote) => {
          const winnerName = vote.winnerId === creatorId ? creatorName : challengerName;

          return (
            <div
              key={vote.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              {/* Vote Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {vote.voter.basename}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({vote.voter.voterReputation} rep)
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(vote.submittedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Winner Selection */}
              <div className="mb-3">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1.5">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Voted for:
                  </span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    {winnerName}
                  </span>
                  <span className="text-lg ml-1">
                    {vote.winnerId === creatorId ? "👤" : "⚔️"}
                  </span>
                </div>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {VOTING_CRITERIA.map((criterion) => {
                  const score = vote[criterion.key];
                  const percentage = (score / 10) * 100;

                  return (
                    <div
                      key={criterion.key}
                      className="bg-gray-50 dark:bg-gray-900 rounded p-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {criterion.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {score}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Score */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weighted Total Score
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {parseFloat(vote.totalScore).toFixed(2)} / 10
                </span>
              </div>

              {/* Feedback */}
              {vote.feedback && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Feedback:
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                    &ldquo;{vote.feedback}&rdquo;
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
