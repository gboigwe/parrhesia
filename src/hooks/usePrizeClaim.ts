import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { useAccount } from "wagmi";
import { claimPrizeWithConfirmation } from "@/lib/prizes/transaction";
import { verifyClaimEligibility } from "@/lib/prizes/verification";
import { parseContractError } from "@/lib/prizes/errors";

interface ClaimPrizeParams {
  debateId: string;
  contractAddress: string;
}

interface ClaimPrizeResponse {
  success: boolean;
  transactionHash: string;
  blockNumber: number;
  amount: string;
}

export function usePrizeClaim() {
  const queryClient = useQueryClient();
  const config = useConfig();
  const { address } = useAccount();

  const mutation = useMutation({
    mutationFn: async (params: ClaimPrizeParams): Promise<ClaimPrizeResponse> => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      const eligibility = await verifyClaimEligibility(
        params.contractAddress,
        address,
        config
      );

      if (!eligibility.isEligible) {
        throw new Error(eligibility.reason || "Not eligible to claim prize");
      }

      try {
        const result = await claimPrizeWithConfirmation(
          params.contractAddress,
          config
        );

        const apiResponse = await fetch(
          `/api/debates/${params.debateId}/claim`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              winnerAddress: address,
              contractAddress: params.contractAddress,
              transactionHash: result.transactionHash,
              blockNumber: result.blockNumber,
              amount: eligibility.amount,
            }),
          }
        );

        if (!apiResponse.ok) {
          console.error("Failed to record claim in database");
        }

        return {
          success: true,
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          amount: eligibility.amount || "0",
        };
      } catch (error) {
        throw parseContractError(error);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debate", variables.debateId] });
      queryClient.invalidateQueries({ queryKey: ["user", address] });
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
