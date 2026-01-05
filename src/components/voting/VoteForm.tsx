"use client";

import { useState } from "react";
import { VOTING_WEIGHTS } from "@/lib/constants";

interface VoteFormProps {
  debateId: string;
  creatorId: string;
  challengerId: string;
  creatorName: string;
  challengerName: string;
  onSubmit: (vote: VoteData) => Promise<void>;
  isSubmitting?: boolean;
}

export interface VoteData {
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  feedback?: string;
}

export function VoteForm({
  debateId,
  creatorId,
  challengerId,
  creatorName,
  challengerName,
  onSubmit,
  isSubmitting = false,
}: VoteFormProps) {
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [scores, setScores] = useState({
    argumentQuality: 5,
    rebuttalStrength: 5,
    clarity: 5,
    evidence: 5,
    persuasiveness: 5,
  });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);

  const calculateTotalScore = () => {
    return (
      (scores.argumentQuality * VOTING_WEIGHTS.ARGUMENT_QUALITY +
        scores.rebuttalStrength * VOTING_WEIGHTS.REBUTTAL_STRENGTH +
        scores.clarity * VOTING_WEIGHTS.CLARITY +
        scores.evidence * VOTING_WEIGHTS.EVIDENCE +
        scores.persuasiveness * VOTING_WEIGHTS.PERSUASIVENESS) /
      100
    ).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedWinner) {
      setError("Please select a winner");
      return;
    }

    try {
      await onSubmit({
        winnerId: selectedWinner,
        ...scores,
        feedback: feedback.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    }
  };

  const criteria = [
    { key: "argumentQuality", label: "Argument Quality", weight: VOTING_WEIGHTS.ARGUMENT_QUALITY },
    { key: "rebuttalStrength", label: "Rebuttal Strength", weight: VOTING_WEIGHTS.REBUTTAL_STRENGTH },
    { key: "clarity", label: "Clarity", weight: VOTING_WEIGHTS.CLARITY },
    { key: "evidence", label: "Evidence", weight: VOTING_WEIGHTS.EVIDENCE },
    { key: "persuasiveness", label: "Persuasiveness", weight: VOTING_WEIGHTS.PERSUASIVENESS },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Winner Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Who presented the stronger case? *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedWinner(creatorId)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedWinner === creatorId
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            }`}
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">{creatorName}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Creator</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWinner(challengerId)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedWinner === challengerId
                ? "border-green-600 bg-green-50 dark:bg-green-950 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:border-green-400"
            }`}
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">{challengerName}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Challenger</div>
          </button>
        </div>
      </div>

      {/* Criteria Scoring */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Rate the Debate</h3>
        {criteria.map(({ key, label, weight }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">({weight}% weight)</span>
              </label>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {scores[key as keyof typeof scores]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={scores[key as keyof typeof scores]}
              onChange={(e) => setScores({ ...scores, [key]: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1 - Poor</span>
              <span>10 - Excellent</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weighted Score Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Weighted Score
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {calculateTotalScore()} / 10
          </span>
        </div>
      </div>

      {/* Feedback (Optional) */}
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Feedback (Optional)
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Share your thoughts on the debate..."
          rows={4}
          maxLength={500}
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{feedback.length}/500</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedWinner}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isSubmitting ? "Submitting Vote..." : "Submit Vote"}
      </button>
    </form>
  );
}
