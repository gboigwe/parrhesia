interface ArgumentStatsProps {
  totalArguments: number;
  creatorArgs: number;
  challengerArgs: number;
  creatorName: string;
  challengerName: string;
  currentRound: number;
}

export function ArgumentStats({
  totalArguments,
  creatorArgs,
  challengerArgs,
  creatorName,
  challengerName,
  currentRound,
}: ArgumentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Arguments */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Arguments</div>
        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalArguments}</div>
        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Round {currentRound}</div>
      </div>

      {/* Creator Stats */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">{creatorName}</div>
        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{creatorArgs}</div>
        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">arguments</div>
      </div>

      {/* Challenger Stats */}
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="text-sm text-green-600 dark:text-green-400 mb-1">{challengerName}</div>
        <div className="text-3xl font-bold text-green-900 dark:text-green-100">{challengerArgs}</div>
        <div className="text-xs text-green-700 dark:text-green-300 mt-1">arguments</div>
      </div>
    </div>
  );
}
