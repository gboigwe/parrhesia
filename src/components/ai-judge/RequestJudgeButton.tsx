/**
 * Request AI Judge Button
 * Trigger button for requesting AI judgment
 */

"use client";

import { useAIJudge } from "@/hooks/useAIJudge";
import type { DebateArgument } from "@/lib/ai/judge/types";

interface RequestJudgeButtonProps {
  debateId: string;
  creatorArguments: DebateArgument[];
  challengerArguments: DebateArgument[];
  debateTopic: string;
  disabled?: boolean;
  onJudgmentComplete?: (verdict: any) => void;
}

export function RequestJudgeButton({
  debateId,
  creatorArguments,
  challengerArguments,
  debateTopic,
  disabled = false,
  onJudgmentComplete,
}: RequestJudgeButtonProps) {
  const { requestJudgmentAsync, isJudging, isSuccess, error } = useAIJudge();

  const handleRequestJudgment = async () => {
    try {
      const result = await requestJudgmentAsync({
        debateId,
        creatorArguments,
        challengerArguments,
        debateTopic,
      });

      if (onJudgmentComplete) {
        onJudgmentComplete(result);
      }
    } catch (err) {
      console.error("Failed to request judgment:", err);
    }
  };

  const canRequest =
    !disabled &&
    !isJudging &&
    creatorArguments.length > 0 &&
    challengerArguments.length > 0;

  return (
    <div className="space-y-2">
      <button
        onClick={handleRequestJudgment}
        disabled={!canRequest}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
          canRequest
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isJudging ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner />
            Analyzing Debate...
          </span>
        ) : isSuccess ? (
          "Judgment Complete"
        ) : (
          "Request AI Judge"
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600 text-center">
          {error instanceof Error ? error.message : "Failed to get judgment"}
        </p>
      )}

      {!canRequest && !isJudging && (
        <p className="text-xs text-gray-500 text-center">
          {creatorArguments.length === 0 || challengerArguments.length === 0
            ? "Both sides must submit arguments"
            : "Judgment request unavailable"}
        </p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
