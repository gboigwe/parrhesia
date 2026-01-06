import { Badge } from "@/components/ui/badge";

interface ArgumentMetadataProps {
  wordCount: number;
  roundNumber: number;
  createdAt: Date;
  sources?: string[];
}

export function ArgumentMetadata({
  wordCount,
  roundNumber,
  createdAt,
  sources,
}: ArgumentMetadataProps) {
  const timeAgo = getTimeAgo(createdAt);

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
      {/* Word Count */}
      <div className="flex items-center gap-1.5">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>{wordCount} words</span>
      </div>

      {/* Time Ago */}
      <div className="flex items-center gap-1.5">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{timeAgo}</span>
      </div>

      {/* Sources Count */}
      {sources && sources.length > 0 && (
        <Badge variant="outline" className="text-xs">
          {sources.length} {sources.length === 1 ? "source" : "sources"}
        </Badge>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
