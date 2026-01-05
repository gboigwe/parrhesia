interface DebateStatusProps {
  status: string;
  className?: string;
}

export function DebateStatus({ status, className = "" }: DebateStatusProps) {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      icon: "⏳",
      label: "Waiting for Opponent",
    },
    active: {
      color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
      icon: "🔥",
      label: "Debate Active",
    },
    voting: {
      color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      icon: "🗳️",
      label: "Voting Open",
    },
    completed: {
      color: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600",
      icon: "✅",
      label: "Completed",
    },
    cancelled: {
      color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
      icon: "❌",
      label: "Cancelled",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color} ${className}`}>
      <span className="text-lg">{config.icon}</span>
      <span className="font-medium text-sm">{config.label}</span>
    </div>
  );
}
