import { useMutation, useQueryClient } from "@tanstack/react-query";

interface MintBadgeParams {
  userId: string;
  badgeType: string;
  debateId?: string;
}

interface MintBadgeResponse {
  message: string;
  tokenId: number;
  transactionHash: string;
  metadataUri: string;
}

export function useBadgeMinting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: MintBadgeParams): Promise<MintBadgeResponse> => {
      const response = await fetch("/api/badges/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to mint badge");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["badges", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });

  return {
    mintBadge: mutation.mutate,
    mintBadgeAsync: mutation.mutateAsync,
    isMinting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
