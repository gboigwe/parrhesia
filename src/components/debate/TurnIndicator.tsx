interface TurnIndicatorProps {
  isYourTurn: boolean;
  opponentName: string;
  canSubmit: boolean;
  reason?: string;
}

export function TurnIndicator({ isYourTurn, opponentName, canSubmit, reason }: TurnIndicatorProps) {
  if (canSubmit && isYourTurn) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">Your Turn</p>
            <p className="text-sm text-green-700 dark:text-green-300">
              You can submit your next argument
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!canSubmit) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-yellow-900 dark:text-yellow-100">
              Waiting for {opponentName}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {reason || "Wait for your opponent's response"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
