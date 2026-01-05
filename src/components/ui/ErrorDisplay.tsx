import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  showBackButton?: boolean;
  backUrl?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = "Error",
  message,
  showBackButton = false,
  backUrl = "/",
  onRetry,
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <span className="text-4xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
              {title}
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">{message}</p>

            <div className="flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
              {showBackButton && (
                <button
                  onClick={() => router.push(backUrl)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
