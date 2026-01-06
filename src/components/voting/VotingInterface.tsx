"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VotingScoreSlider } from "./VotingScoreSlider";
import { VoteSummaryPanel } from "./VoteSummaryPanel";
import { VOTING_CRITERIA, VOTING_CONSTRAINTS } from "@/lib/voting/constants";

interface VotingInterfaceProps {
  debateId: string;
  creatorName: string;
  challengerName: string;
  onSubmitVote: (vote: VoteData) => Promise<void>;
  isSubmitting?: boolean;
}

export interface VoteData {
  debateId: string;
  winner: "creator" | "challenger";
  scores: Record<string, number>;
  feedback?: string;
}

export function VotingInterface({
  debateId,
  creatorName,
  challengerName,
  onSubmitVote,
  isSubmitting = false,
}: VotingInterfaceProps) {
  const [winner, setWinner] = useState<"creator" | "challenger" | null>(null);
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initialScores: Record<string, number> = {};
    VOTING_CRITERIA.forEach((criterion) => {
      initialScores[criterion.key] = 5; // Default to middle score
    });
    return initialScores;
  });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleScoreChange = (criterionKey: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criterionKey]: value,
    }));
  };

  const validateVote = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!winner) {
      errors.push("Please select who you think won the debate");
    }

    VOTING_CRITERIA.forEach((criterion) => {
      const score = scores[criterion.key];
      if (
        score < VOTING_CONSTRAINTS.MIN_SCORE ||
        score > VOTING_CONSTRAINTS.MAX_SCORE
      ) {
        errors.push(
          `${criterion.name} score must be between ${VOTING_CONSTRAINTS.MIN_SCORE} and ${VOTING_CONSTRAINTS.MAX_SCORE}`
        );
      }
    });

    if (feedback.length > VOTING_CONSTRAINTS.MAX_FEEDBACK_LENGTH) {
      errors.push(
        `Feedback must be less than ${VOTING_CONSTRAINTS.MAX_FEEDBACK_LENGTH} characters`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async () => {
    setError(null);

    const validation = validateVote();
    if (!validation.valid) {
      setError(validation.errors.join(". "));
      return;
    }

    if (!winner) {
      setError("Please select a winner");
      return;
    }

    try {
      await onSubmitVote({
        debateId,
        winner,
        scores,
        feedback: feedback.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    }
  };

  const canSubmit = winner !== null && !isSubmitting;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Voting Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Winner Selection */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              1. Who Won This Debate?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select the participant you believe made the stronger case
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Creator */}
              <button
                onClick={() => setWinner("creator")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  winner === "creator"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
                type="button"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {creatorName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Proposition
                    </p>
                  </div>
                  {winner === "creator" && (
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Challenger */}
              <button
                onClick={() => setWinner("challenger")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  winner === "challenger"
                    ? "border-red-600 bg-red-50 dark:bg-red-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-red-400"
                }`}
                type="button"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {challengerName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Opposition
                    </p>
                  </div>
                  {winner === "challenger" && (
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Criteria Scoring */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            2. Rate Each Criterion
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Score your chosen winner on each criterion (1-10). These scores will be
            weighted to calculate the final score.
          </p>

          <div className="space-y-4">
            {VOTING_CRITERIA.map((criterion) => (
              <VotingScoreSlider
                key={criterion.key}
                criterion={criterion}
                value={scores[criterion.key]}
                onChange={(value) => handleScoreChange(criterion.key, value)}
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              3. Feedback (Optional)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share your thoughts on the debate. This will be visible to both
              participants.
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What stood out to you? What could be improved?"
              maxLength={VOTING_CONSTRAINTS.MAX_FEEDBACK_LENGTH}
              className="w-full min-h-[120px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {feedback.length}/{VOTING_CONSTRAINTS.MAX_FEEDBACK_LENGTH}{" "}
                characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full"
          variant="primary"
          size="lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
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
              Submitting Vote...
            </span>
          ) : (
            "Submit Vote"
          )}
        </Button>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-1">
        {winner && (
          <VoteSummaryPanel
            scores={scores}
            winner={winner}
            creatorName={creatorName}
            challengerName={challengerName}
          />
        )}
      </div>
    </div>
  );
}
