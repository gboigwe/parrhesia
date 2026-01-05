interface Vote {
  id: string;
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  totalScore: string;
  voter: {
    basename: string;
    voterReputation: string;
  };
}

interface VoteResultsProps {
  votes: Vote[];
  creatorId: string;
  challengerId: string;
  creatorName: string;
  challengerName: string;
}

export function VoteResults({
  votes,
  creatorId,
  challengerId,
  creatorName,
  challengerName,
}: VoteResultsProps) {
  const creatorVotes = votes.filter((v) => v.winnerId === creatorId);
  const challengerVotes = votes.filter((v) => v.winnerId === challengerId);

  const creatorScore =
    creatorVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
    (creatorVotes.length || 1);
  const challengerScore =
    challengerVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
    (challengerVotes.length || 1);

  const creatorPercentage = votes.length > 0 ? (creatorVotes.length / votes.length) * 100 : 0;
  const challengerPercentage = votes.length > 0 ? (challengerVotes.length / votes.length) * 100 : 0;

  const winner =
    creatorVotes.length > challengerVotes.length
      ? "creator"
      : creatorVotes.length < challengerVotes.length
        ? "challenger"
        : "tie";

  return (
    <div className="space-y-6">
      {/* Vote Count */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {votes.length}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">Total Votes Cast</div>
        </div>
      </div>

      {/* Vote Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creator */}
        <div
          className={`border-2 rounded-lg p-6 ${
            winner === "creator"
              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
              : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950"
          }`}
        >
          {winner === "creator" && (
            <div className="text-3xl mb-2 text-center">🏆</div>
          )}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {creatorName}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">Creator</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Votes</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {creatorVotes.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${creatorPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {creatorPercentage.toFixed(1)}%
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Score</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {creatorScore.toFixed(2)} / 10
              </div>
            </div>
          </div>
        </div>

        {/* Challenger */}
        <div
          className={`border-2 rounded-lg p-6 ${
            winner === "challenger"
              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
              : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950"
          }`}
        >
          {winner === "challenger" && (
            <div className="text-3xl mb-2 text-center">🏆</div>
          )}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {challengerName}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">Challenger</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Votes</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {challengerVotes.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${challengerPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {challengerPercentage.toFixed(1)}%
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Score</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {challengerScore.toFixed(2)} / 10
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tie */}
      {winner === "tie" && votes.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            🤝 It's a tie! Both debaters received equal votes.
          </p>
        </div>
      )}
    </div>
  );
}
