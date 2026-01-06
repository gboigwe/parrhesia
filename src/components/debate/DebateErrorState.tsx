import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DebateErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function DebateErrorState({ error, onRetry }: DebateErrorStateProps) {
  const isNotFound = error.toLowerCase().includes("not found");

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="max-w-md mx-auto">
          {/* Error Icon */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isNotFound
                ? "bg-yellow-100 dark:bg-yellow-900"
                : "bg-red-100 dark:bg-red-900"
            }`}
          >
            {isNotFound ? (
              <svg
                className="w-10 h-10 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* Error Message */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {isNotFound ? "Debate Not Found" : "Something Went Wrong"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onRetry && !isNotFound && (
              <Button onClick={onRetry} variant="primary" size="lg">
                Try Again
              </Button>
            )}
            <Link href="/debates">
              <Button variant="outline" size="lg">
                Browse Debates
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
