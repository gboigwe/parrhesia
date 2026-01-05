"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VotingCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface VotingPanelProps {
  debateId: string;
  creatorName: string;
  challengerName: string;
  votingCriteria: VotingCriterion[];
  onSubmitVote: (vote: VoteData) => Promise<void>;
  canVote: boolean;
  hasVoted: boolean;
  className?: string;
}

export interface VoteData {
  winnerId: string;
  scores: Record<string, number>;
  feedback?: string;
}

export function VotingPanel({
  debateId,
  creatorName,
  challengerName,
  votingCriteria,
  onSubmitVote,
  canVote,
  hasVoted,
  className,
}: VotingPanelProps) {
  const [selectedWinner, setSelectedWinner] = useState<"creator" | "challenger" | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (criterionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [criterionId]: score }));
  };

  const calculateTotalScore = () => {
    let total = 0;
    votingCriteria.forEach((criterion) => {
      const score = scores[criterion.id] || 0;
      total += (score * criterion.weight) / 100;
    });
    return total.toFixed(2);
  };

  const isFormValid = () => {
    if (!selectedWinner) return false;
    return votingCriteria.every((criterion) => scores[criterion.id] >= 1 && scores[criterion.id] <= 10);
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !selectedWinner) return;

    setIsSubmitting(true);
    try {
      await onSubmitVote({
        winnerId: selectedWinner,
        scores,
        feedback: feedback.trim() || undefined,
      });
    } catch (error) {
      console.error("Failed to submit vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasVoted) {
    return (
      <Card variant="elevated" className={cn("", className)}>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Vote Submitted
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for participating! Your vote has been recorded.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!canVote) {
    return (
      <Card variant="elevated" className={cn("", className)}>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">9</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cannot Vote
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You are not eligible to vote on this debate.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Evaluate both participants and select the winner
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Winner Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Who won the debate?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedWinner("creator")}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                selectedWinner === "creator"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-300"
              )}
            >
              <div className="font-semibold text-gray-900 dark:text-white">{creatorName}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Creator</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedWinner("challenger")}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                selectedWinner === "challenger"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                  : "border-gray-300 dark:border-gray-700 hover:border-purple-300"
              )}
            >
              <div className="font-semibold text-gray-900 dark:text-white">{challengerName}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Challenger</div>
            </button>
          </div>
        </div>

        {/* Voting Criteria */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Score the debate (1-10 for each criterion)
          </label>
          {votingCriteria.map((criterion) => (
            <div key={criterion.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {criterion.name}
                  </span>
                  <Badge variant="outline" size="sm" className="ml-2">
                    {criterion.weight}%
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {scores[criterion.id] || 0}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scores[criterion.id] || 0}
                onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {criterion.description}
              </p>
            </div>
          ))}
        </div>

        {/* Weighted Score Preview */}
        {Object.keys(scores).length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Weighted Total Score</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateTotalScore()} / 10
              </span>
            </div>
          </div>
        )}

        {/* Feedback (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts on the debate..."
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
            {feedback.length}/500
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          isLoading={isSubmitting}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isSubmitting ? "Submitting Vote..." : "Submit Vote"}
        </Button>
      </CardFooter>
    </Card>
  );
}
