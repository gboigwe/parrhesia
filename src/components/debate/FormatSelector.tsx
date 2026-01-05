"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type DebateFormat = "timed" | "async";

interface FormatOption {
  id: DebateFormat;
  title: string;
  emoji: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const FORMATS: FormatOption[] = [
  {
    id: "timed",
    title: "Live Debate",
    emoji: "¡",
    description: "Real-time synchronous debate session",
    features: [
      "Scheduled start time",
      "15-120 minute duration",
      "Immediate back-and-forth",
      "High intensity",
    ],
  },
  {
    id: "async",
    title: "Async Debate",
    emoji: "=Ý",
    description: "Extended debate with flexible response times",
    features: [
      "12-72 hour response windows",
      "3-10 rounds maximum",
      "Time to research",
      "More thoughtful arguments",
    ],
    recommended: true,
  },
];

interface FormatSelectorProps {
  value: DebateFormat;
  onChange: (format: DebateFormat) => void;
  className?: string;
}

export function FormatSelector({
  value,
  onChange,
  className,
}: FormatSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Debate Format
      </label>

      <div className="grid md:grid-cols-2 gap-4">
        {FORMATS.map((format) => (
          <button
            key={format.id}
            type="button"
            onClick={() => onChange(format.id)}
            className={cn(
              "relative p-5 border-2 rounded-lg text-left transition-all hover:shadow-md",
              value === format.id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            )}
          >
            {format.recommended && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded">
                  Recommended
                </span>
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{format.emoji}</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {format.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {format.description}
                </p>
              </div>
            </div>

            <ul className="space-y-1.5 mt-4">
              {format.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      value === format.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Selection Indicator */}
            {value === format.id && (
              <div className="absolute top-3 left-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
