import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ClaimPrizeParams {
  debateId: string;
  userId: string;
  type: "winner" | "voter";
}

interface ClaimPrizeResponse {
  message: string;
  transactionHash?: string;
  amountClaimed: string;
  reputationEarned: number;
}

export function usePrizeClaim() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: ClaimPrizeParams): Promise<ClaimPrizeResponse> => {
      const response = await fetch(
        `/api/debates/${params.debateId}/claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: params.userId,
            type: params.type,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to claim prize");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["debate", variables.debateId] });
      queryClient.invalidateQueries({ queryKey: ["results", variables.debateId] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });

  return {
    claimPrize: mutation.mutate,
    claimPrizeAsync: mutation.mutateAsync,
    isClaiming: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
