/**
 * AI Judge Hook
 * React Query hook for AI-powered debate judging
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import type { DebateArgument, AIJudgeVerdict } from "@/lib/ai/judge/types";

interface RequestAIJudgeParams {
  debateId: string;
  creatorArguments: DebateArgument[];
  challengerArguments: DebateArgument[];
  debateTopic: string;
}

interface AIJudgeResponse {
  verdict: AIJudgeVerdict;
  creatorFallacies: Array<{
    type: string;
    description: string;
    location: string;
    severity: "low" | "medium" | "high";
  }>;
  challengerFallacies: Array<{
    type: string;
    description: string;
    location: string;
    severity: "low" | "medium" | "high";
  }>;
}

export function useAIJudge() {
  const mutation = useMutation({
    mutationFn: async (
      params: RequestAIJudgeParams
    ): Promise<AIJudgeResponse> => {
      const response = await fetch(`/api/debates/${params.debateId}/judge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorArguments: params.creatorArguments,
          challengerArguments: params.challengerArguments,
          debateTopic: params.debateTopic,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get AI judgment");
      }

      return response.json();
    },
  });

  return {
    requestJudgment: mutation.mutate,
    requestJudgmentAsync: mutation.mutateAsync,
    isJudging: mutation.isPending,
    judgment: mutation.data,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}

export function useAIJudgeVerdict(debateId: string, enabled = false) {
  const query = useQuery({
    queryKey: ["ai-judge-verdict", debateId],
    queryFn: async (): Promise<AIJudgeResponse | null> => {
      const response = await fetch(`/api/debates/${debateId}/judge/verdict`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch AI judgment");
      }

      return response.json();
    },
    enabled,
  });

  return {
    verdict: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
