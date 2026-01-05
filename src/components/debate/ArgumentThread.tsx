"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Argument {
  id: string;
  content: string;
  submittedAt: Date;
  roundNumber: number;
  author: {
    id: string;
    basename: string;
    avatar?: string;
    role: "creator" | "challenger";
  };
}

interface ArgumentThreadProps {
  arguments: Argument[];
  creatorName: string;
  challengerName: string;
  className?: string;
}

export function ArgumentThread({
  arguments: args,
  creatorName,
  challengerName,
  className,
}: ArgumentThreadProps) {
  const sortedArgs = [...args].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  return (
    <div className={cn("space-y-6", className)}>
      {sortedArgs.map((arg, index) => {
        const isCreator = arg.author.role === "creator";

        return (
          <div
            key={arg.id}
            className={cn(
              "flex gap-4",
              isCreator ? "flex-row" : "flex-row-reverse"
            )}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                src={arg.author.avatar}
                alt={arg.author.basename}
                fallback={arg.author.basename[0].toUpperCase()}
                size="default"
              />
            </div>

            {/* Argument Content */}
            <div className={cn("flex-1 max-w-3xl")}>
              <div
                className={cn(
                  "rounded-lg p-4 shadow-sm border",
                  isCreator
                    ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                    : "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        isCreator
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-purple-900 dark:text-purple-100"
                      )}
                    >
                      {arg.author.basename}
                    </span>
                    <Badge
                      variant={isCreator ? "primary" : "secondary"}
                      size="sm"
                    >
                      {isCreator ? "Creator" : "Challenger"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" size="sm">
                      Round {arg.roundNumber}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(arg.submittedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "prose dark:prose-invert max-w-none",
                    isCreator
                      ? "prose-blue dark:prose-blue"
                      : "prose-purple dark:prose-purple"
                  )}
                >
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {arg.content}
                  </p>
                </div>
              </div>

              {/* Argument Number Indicator */}
              <div
                className={cn(
                  "mt-2 text-xs text-gray-500 dark:text-gray-400",
                  isCreator ? "text-left" : "text-right"
                )}
              >
                Argument #{index + 1}
              </div>
            </div>
          </div>
        );
      })}

      {args.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">=¬</div>
          <p className="text-gray-600 dark:text-gray-400">
            No arguments yet. Be the first to make your case!
          </p>
        </div>
      )}
    </div>
  );
}
