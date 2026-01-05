"use client";

import { useState } from "react";
import { DEBATE_CONFIG } from "@/lib/constants";

interface ArgumentFormProps {
  debateId: string;
  roundNumber: number;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function ArgumentForm({
  debateId,
  roundNumber,
  onSubmit,
  isSubmitting = false,
}: ArgumentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const wordCount = content.trim().split(/\s+/).filter((word) => word.length > 0).length;
  const isValidLength =
    wordCount >= DEBATE_CONFIG.MIN_ARGUMENT_LENGTH &&
    wordCount <= DEBATE_CONFIG.MAX_ARGUMENT_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!content.trim()) {
      setError("Argument content is required");
      return;
    }

    if (wordCount < DEBATE_CONFIG.MIN_ARGUMENT_LENGTH) {
      setError(`Argument must be at least ${DEBATE_CONFIG.MIN_ARGUMENT_LENGTH} words`);
      return;
    }

    if (wordCount > DEBATE_CONFIG.MAX_ARGUMENT_LENGTH) {
      setError(`Argument must not exceed ${DEBATE_CONFIG.MAX_ARGUMENT_LENGTH} words`);
      return;
    }

    try {
      await onSubmit(content);
      setContent(""); // Clear form on success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit argument");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="argument" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Round {roundNumber} Argument
          </label>
          <div className="text-sm">
            <span
              className={`font-medium ${
                !isValidLength
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {wordCount}
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              {" "}
              / {DEBATE_CONFIG.MIN_ARGUMENT_LENGTH}-{DEBATE_CONFIG.MAX_ARGUMENT_LENGTH} words
            </span>
          </div>
        </div>

        <textarea
          id="argument"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          placeholder="Present your argument with evidence and clear reasoning..."
          rows={12}
          disabled={isSubmitting}
          required
        />

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Include evidence, cite sources, and structure your argument clearly for maximum
          impact.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isValidLength}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Argument"}
        </button>
      </div>
    </form>
  );
}
