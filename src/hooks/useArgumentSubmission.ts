import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SubmitArgumentParams {
  debateId: string;
  content: string;
  userId: string;
  roundNumber: number;
  sources?: string[];
}

export function useArgumentSubmission() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: SubmitArgumentParams) => {
      const response = await fetch(`/api/debates/${params.debateId}/arguments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: params.content,
          userId: params.userId,
          roundNumber: params.roundNumber,
          sources: params.sources,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit argument");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate arguments query to refetch
      queryClient.invalidateQueries({
        queryKey: ["arguments", variables.debateId],
      });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    submitArgument: mutation.mutate,
    isSubmitting: mutation.isPending,
    error,
    clearError: () => setError(null),
  };
}
