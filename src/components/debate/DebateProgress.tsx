import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DebateProgressProps {
  status: string;
  startTime?: Date | null;
  endTime?: Date | null;
  votingEndsAt?: Date | null;
  currentPhase?: string;
}

export function DebateProgress({
  status,
  startTime,
  endTime,
  votingEndsAt,
  currentPhase,
}: DebateProgressProps) {
  const phases = [
    {
      id: "pending",
      label: "Pending",
      icon: "⏳",
      active: status === "pending",
      completed: status !== "pending",
    },
    {
      id: "active",
      label: "Active",
      icon: "🔥",
      active: status === "active",
      completed:
        status === "voting" || status === "completed" || status === "disputed",
    },
    {
      id: "voting",
      label: "Voting",
      icon: "🗳️",
      active: status === "voting",
      completed: status === "completed" || status === "disputed",
    },
    {
      id: "completed",
      label: "Completed",
      icon: "🏆",
      active: status === "completed" || status === "disputed",
      completed: false,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Debate Progress
        </h3>

        {/* Progress Bar */}
        <div className="relative">
          {/* Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-500"
            style={{
              width: `${(phases.filter((p) => p.completed).length / phases.length) * 100}%`,
            }}
          />

          {/* Phases */}
          <div className="relative flex justify-between">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                    phase.active
                      ? "bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900"
                      : phase.completed
                      ? "bg-blue-600 dark:bg-blue-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {phase.completed || phase.active ? (
                    <span>{phase.icon}</span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">
                      {phase.icon}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    phase.active
                      ? "text-blue-600 dark:text-blue-400"
                      : phase.completed
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {phase.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Info */}
        <div className="mt-6 space-y-2 text-sm">
          {startTime && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Started:</span>
              <span className="font-medium">
                {new Date(startTime).toLocaleDateString()}
              </span>
            </div>
          )}
          {endTime && status === "active" && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Debate ends:</span>
              <span className="font-medium">
                {new Date(endTime).toLocaleDateString()}
              </span>
            </div>
          )}
          {votingEndsAt && status === "voting" && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Voting ends:</span>
              <span className="font-medium">
                {new Date(votingEndsAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Current Phase Info */}
        {currentPhase && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {currentPhase}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
