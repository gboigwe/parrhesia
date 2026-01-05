import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = "=í",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Predefined empty states
export function NoDebatesFound() {
  return (
    <EmptyState
      icon="="
      title="No Debates Found"
      description="Try adjusting your filters or create a new debate to get started."
    />
  );
}

export function NoActiveDebates({ onCreateDebate }: { onCreateDebate?: () => void }) {
  return (
    <EmptyState
      icon="”"
      title="No Active Debates"
      description="Be the first to start a debate and challenge others on important topics."
      actionLabel="Create Debate"
      onAction={onCreateDebate}
    />
  );
}

export function NoVotesYet() {
  return (
    <EmptyState
      icon="=ó"
      title="No Votes Yet"
      description="This debate hasn't received any votes yet. Be the first to cast your vote!"
    />
  );
}

export function NoArgumentsYet() {
  return (
    <EmptyState
      icon="=¬"
      title="No Arguments Yet"
      description="No arguments have been submitted for this debate yet."
    />
  );
}
