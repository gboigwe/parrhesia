interface EmptyArgumentsProps {
  isParticipant: boolean;
  debateTopic: string;
}

export function EmptyArguments({ isParticipant, debateTopic }: EmptyArgumentsProps) {
  return (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="text-6xl mb-4">💬</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        No Arguments Yet
      </h3>
      {isParticipant ? (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to present your case on:
          </p>
          <p className="text-lg font-medium text-gray-900 dark:text-white italic">
            "{debateTopic}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Use the form below to submit your opening argument
          </p>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          The participants haven't submitted any arguments yet. Check back soon!
        </p>
      )}
    </div>
  );
}
