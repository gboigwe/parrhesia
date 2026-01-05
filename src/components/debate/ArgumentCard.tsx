interface Argument {
  id: string;
  content: string;
  wordCount: number;
  roundNumber: number;
  postedAt: Date;
  user: {
    basename: string;
    debaterReputation: string;
  };
}

interface ArgumentCardProps {
  argument: Argument;
  isCreator: boolean;
  showRound?: boolean;
}

export function ArgumentCard({ argument, isCreator, showRound = true }: ArgumentCardProps) {
  const sideColor = isCreator
    ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
    : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";

  const badgeColor = isCreator
    ? "bg-blue-600 text-white"
    : "bg-green-600 text-white";

  return (
    <div className={`border rounded-lg p-6 ${sideColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            {argument.user.basename}
          </span>
          {showRound && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Round {argument.roundNumber}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(argument.postedAt).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {argument.wordCount} words
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
          {argument.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Debater Reputation: {parseFloat(argument.user.debaterReputation).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
