"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { VotingInterface, type VoteData } from "@/components/voting/VotingInterface";
import { VoteSuccessState } from "@/components/voting/VoteSuccessState";
import { DebateDetailSkeleton } from "@/components/debate/DebateDetailSkeleton";
import { DebateErrorState } from "@/components/debate/DebateErrorState";
import { useVoteSubmission } from "@/hooks/useVoteSubmission";
import { VOTING_CRITERIA } from "@/lib/voting/constants";

export default function VotingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const debateId = params.id as string;
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [submittedVote, setSubmittedVote] = useState<VoteData | null>(null);

  const { submitVote, isSubmitting, isSuccess, error: voteError, data: voteData } = useVoteSubmission();

  // Fetch debate details
  const {
    data: debateData,
    isLoading: isLoadingDebate,
    error: debateError,
  } = useQuery({
    queryKey: ["debate", debateId],
    queryFn: async () => {
      const response = await fetch(`/api/debates/${debateId}`);
      if (!response.ok) {
        throw new Error("Debate not found");
      }
      return response.json();
    },
    enabled: !!debateId,
  });

  const debate = debateData?.debate;

  // Check if user is eligible to vote
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/debates/${debateId}`);
      return;
    }

    if (debate) {
      // Check if user is a participant
      if (
        user &&
        (debate.creator.id === user.id ||
          (debate.challenger && debate.challenger.id === user.id))
      ) {
        alert("Debate participants cannot vote on their own debate");
        router.push(`/debates/${debateId}`);
        return;
      }

      // Check if debate is in voting phase
      if (debate.status !== "voting") {
        alert("This debate is not in the voting phase");
        router.push(`/debates/${debateId}`);
        return;
      }
    }
  }, [debate, user, isAuthenticated, debateId, router]);

  const handleSubmitVote = async (vote: VoteData) => {
    if (!user) return;

    setSubmittedVote(vote);

    submitVote({
      ...vote,
      userId: user.id,
    });
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setVoteSubmitted(true);
    }
  }, [isSuccess]);

  // Calculate weighted score for success state
  const calculateWeightedScore = (): number => {
    if (!submittedVote) return 0;
    let totalScore = 0;
    VOTING_CRITERIA.forEach((criterion) => {
      const score = submittedVote.scores[criterion.key] || 0;
      const weightedScore = (score * criterion.weight) / 100;
      totalScore += weightedScore;
    });
    return Number(totalScore.toFixed(2));
  };

  // Loading state
  if (isLoadingDebate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DebateDetailSkeleton />
      </div>
    );
  }

  // Error state
  if (debateError || !debate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DebateErrorState
          error={
            debateError instanceof Error
              ? debateError.message
              : "Failed to load debate"
          }
        />
      </div>
    );
  }

  // Success state
  if (voteSubmitted && submittedVote) {
    const winnerName =
      submittedVote.winner === "creator"
        ? debate.creator.basename
        : debate.challenger?.basename || "Unknown";

    return (
      <div className="container mx-auto px-4 py-8">
        <VoteSuccessState
          debateId={debateId}
          winnerName={winnerName}
          weightedScore={calculateWeightedScore()}
          transactionHash={voteData?.transactionHash}
        />
      </div>
    );
  }

  // Voting interface
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Cast Your Vote
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {debate.topic}
        </p>
      </div>

      {/* Error Display */}
      {voteError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{voteError}</p>
        </div>
      )}

      {/* Voting Interface */}
      <VotingInterface
        debateId={debateId}
        creatorName={debate.creator.basename}
        challengerName={debate.challenger?.basename || "Unknown"}
        onSubmitVote={handleSubmitVote}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
