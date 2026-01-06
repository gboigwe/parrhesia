"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DebateHeader } from "@/components/debate/DebateHeader";
import { ArgumentList } from "@/components/debate/ArgumentList";
import { ArgumentSubmissionForm } from "@/components/debate/ArgumentSubmissionForm";
import { DebateInfoSidebar } from "@/components/debate/DebateInfoSidebar";
import { DebateDetailSkeleton } from "@/components/debate/DebateDetailSkeleton";
import { DebateErrorState } from "@/components/debate/DebateErrorState";
import { useAuth } from "@/contexts/AuthContext";

interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: string;
  format: string;
  status: string;
  stakeAmount: string;
  prizePool?: string;
  createdAt: Date;
  startTime?: Date | null;
  endTime?: Date | null;
  votingEndsAt?: Date | null;
  creator: {
    id: string;
    basename: string;
  };
  challenger?: {
    id: string;
    basename: string;
  } | null;
}

interface Argument {
  id: string;
  content: string;
  wordCount: number;
  roundNumber: number;
  createdAt: Date;
  user: {
    id: string;
    basename: string;
  };
  userId: string;
  sources?: string[];
}

export default function DebateDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const debateId = params.id as string;

  // Fetch debate details
  const {
    data: debateData,
    isLoading: isLoadingDebate,
    error: debateError,
    refetch: refetchDebate,
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

  // Fetch arguments
  const {
    data: argumentsData,
    isLoading: isLoadingArguments,
    refetch: refetchArguments,
  } = useQuery({
    queryKey: ["arguments", debateId],
    queryFn: async () => {
      const response = await fetch(`/api/debates/${debateId}/arguments`);
      if (!response.ok) {
        throw new Error("Failed to fetch arguments");
      }
      return response.json();
    },
    enabled: !!debateId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const debate: Debate | undefined = debateData?.debate;
  const arguments: Argument[] = argumentsData?.arguments || [];

  const handleSubmitArgument = async (content: string, sources?: string[]) => {
    if (!debate || !user) return;

    setIsSubmitting(true);
    try {
      // Calculate next round number
      const userArgs = arguments.filter((arg) => arg.userId === user.id);
      const nextRound = userArgs.length + 1;

      const response = await fetch(`/api/debates/${debate.id}/arguments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          userId: user.id,
          roundNumber: nextRound,
          sources,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit argument");
      }

      // Refresh arguments
      await refetchArguments();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinDebate = async () => {
    // TODO: Implement join debate logic with smart contract
    console.log("Join debate", debateId);
  };

  const isParticipant =
    user &&
    debate &&
    (debate.creator.id === user.id ||
      (debate.challenger && debate.challenger.id === user.id));

  const canJoin =
    user &&
    debate &&
    debate.status === "pending" &&
    debate.creator.id !== user.id &&
    !debate.challenger;

  const userSide = debate && user && debate.creator.id === user.id ? "pro" : "con";

  const userRoundNumber =
    user && arguments.filter((arg) => arg.userId === user.id).length + 1;

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
          onRetry={() => refetchDebate()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <DebateHeader debate={debate} />

          {/* Arguments */}
          {debate.challenger && arguments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Arguments
              </h2>
              <ArgumentList
                arguments={arguments}
                creatorId={debate.creator.id}
                challengerId={debate.challenger?.id}
              />
            </div>
          )}

          {/* Empty state for arguments */}
          {debate.challenger && arguments.length === 0 && (
            <ArgumentList
              arguments={[]}
              creatorId={debate.creator.id}
              challengerId={debate.challenger?.id}
              emptyMessage="The debate has started but no arguments have been submitted yet. Make the first move!"
            />
          )}

          {/* Argument Submission Form */}
          {isParticipant && debate.status === "active" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Submit Your Argument
              </h2>
              <ArgumentSubmissionForm
                debateId={debate.id}
                onSubmit={handleSubmitArgument}
                isSubmitting={isSubmitting}
                roundNumber={userRoundNumber}
                side={userSide as "pro" | "con"}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <DebateInfoSidebar
            debate={debate}
            onJoinDebate={canJoin ? handleJoinDebate : undefined}
            canJoin={canJoin || false}
            isJoining={false}
          />
        </div>
      </div>
    </div>
  );
}
