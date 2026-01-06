import { Badge } from "@/components/ui/badge";

interface ArgumentSourcesProps {
  sources: string[];
}

export function ArgumentSources({ sources }: ArgumentSourcesProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sources ({sources.length})
        </span>
      </div>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group"
          >
            <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
              [{index + 1}]
            </span>
            <span className="break-all group-hover:text-blue-700 dark:group-hover:text-blue-300">
              {formatUrl(source)}
            </span>
            <svg
              className="w-3 h-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    const path = urlObj.pathname;

    // Show domain + path, truncate if too long
    const formatted = domain + path;
    if (formatted.length > 50) {
      return formatted.substring(0, 47) + "...";
    }
    return formatted;
  } catch {
    // If URL parsing fails, return truncated original
    if (url.length > 50) {
      return url.substring(0, 47) + "...";
    }
    return url;
  }
}
