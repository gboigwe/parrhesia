import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface VoteData {
  debateId: string;
  winner: "creator" | "challenger";
  scores: Record<string, number>;
  feedback?: string;
}

interface SubmitVoteParams extends VoteData {
  userId: string;
}

export function useVoteSubmission() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: SubmitVoteParams) => {
      const response = await fetch(`/api/debates/${params.debateId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: params.userId,
          winner: params.winner,
          scores: params.scores,
          feedback: params.feedback,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit vote");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate debate query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["debate", variables.debateId],
      });
      // Invalidate votes query if it exists
      queryClient.invalidateQueries({
        queryKey: ["votes", variables.debateId],
      });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    submitVote: mutation.mutate,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error,
    clearError: () => setError(null),
    data: mutation.data,
  };
}
