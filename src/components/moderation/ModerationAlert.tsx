/**
 * Moderation Alert Component
 * Displays moderation warnings and blocks
 */

"use client";

import type { ContentAnalysis, ModerationAction } from "@/lib/ai/moderator/types";
import {
  getSeverityBadge,
  getActionLabel,
  formatViolationType,
} from "@/lib/ai/moderator/utils";

interface ModerationAlertProps {
  analysis: ContentAnalysis;
  action: ModerationAction;
  onAppeal?: () => void;
  appealable?: boolean;
}

export function ModerationAlert({
  analysis,
  action,
  onAppeal,
  appealable = false,
}: ModerationAlertProps) {
  if (action === "allow") {
    return null;
  }

  const isBlocked = action === "block";
  const isWarning = action === "warn";

  return (
    <div
      className={`border rounded-lg p-4 ${
        isBlocked
          ? "bg-red-50 border-red-300"
          : isWarning
          ? "bg-yellow-50 border-yellow-300"
          : "bg-orange-50 border-orange-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{isBlocked ? "🚫" : "⚠️"}</span>
          <div>
            <h3 className="font-bold">
              {isBlocked ? "Content Blocked" : "Content Warning"}
            </h3>
            <p className="text-sm text-gray-600">{getActionLabel(action)}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${getSeverityBadge(analysis.severity)}`}>
          {analysis.severity.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3">{analysis.explanation}</p>

      {analysis.violations.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Violations Detected:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.violations.map((violation, i) => (
              <span
                key={i}
                className="text-xs bg-white px-2 py-1 rounded border"
              >
                {formatViolationType(violation)}
              </span>
            ))}
          </div>
        </div>
      )}

      {appealable && onAppeal && (
        <button
          onClick={onAppeal}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Appeal this decision
        </button>
      )}

      {!isBlocked && (
        <p className="text-xs text-gray-500 mt-2">
          Repeated violations may result in content being blocked
        </p>
      )}
    </div>
  );
}
