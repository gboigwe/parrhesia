"use client";

import { CheckCircle } from "lucide-react";
import { formatBasename } from "@/lib/auth/utils";

interface BasenameDisplayProps {
  basename: string;
  showFullName?: boolean;
  showVerifiedBadge?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BasenameDisplay({
  basename,
  showFullName = false,
  showVerifiedBadge = true,
  size = "md",
}: BasenameDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const badgeSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`font-medium text-gray-900 dark:text-white ${sizeClasses[size]}`}>
        {formatBasename(basename, showFullName)}
      </span>
      {showVerifiedBadge && (
        <CheckCircle
          className={`${badgeSizeClasses[size]} text-green-600 dark:text-green-400`}
          fill="currentColor"
        />
      )}
    </div>
  );
}
