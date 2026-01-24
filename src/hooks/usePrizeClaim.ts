"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { verifyPrizeClaimEligibility } from "@/lib/blockchain/verification";
import { waitForConfirmation } from "@/lib/blockchain/transactions";

/**
 * Status of the prize claim process
 * - idle: Not started
 * - verifying: Checking on-chain eligibility
 * - signing: User signing claim transaction
 * - confirming: Waiting for blockchain confirmation
 * - syncing: Updating database after confirmation
 * - success: Prize claimed successfully
 * - error: Something failed
 */
type ClaimPrizeStatus = "idle" | "verifying" | "signing" | "confirming" | "syncing" | "success" | "error";

interface ClaimPrizeParams {
  debateId: string;
  contractAddress: string;
  onSuccess?: (txHash: string, amount: bigint) => void;
  onError?: (error: Error) => void;
}

export function usePrizeClaim() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // State management
  const [status, setStatus] = useState<ClaimPrizeStatus>("idle");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [prizeAmount, setPrizeAmount] = useState<bigint | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [eligibilityReason, setEligibilityReason] = useState<string | null>(null);

  /**
   * Claim prize with on-chain verification and confirmation
   */
  const claimPrize = async ({ debateId, contractAddress, onSuccess, onError }: ClaimPrizeParams) => {
    if (!address) {
      const error = new Error("Wallet not connected");
      setError(error);
      setStatus("error");
      onError?.(error);
      throw error;
    }

    try {
      // Reset state
      setError(null);
      setTransactionHash(null);
      setPrizeAmount(null);
      setIsEligible(null);
      setEligibilityReason(null);

      // Step 1: Verify eligibility on-chain
      console.log(`[PrizeClaim] Verifying eligibility for debate ${debateId}...`);
      setStatus("verifying");

      const eligibility = await verifyPrizeClaimEligibility(debateId, address);

      setIsEligible(eligibility.eligible);
      setEligibilityReason(eligibility.reason);

      if (!eligibility.eligible) {
        const error = new Error(eligibility.reason);
        console.log(`[PrizeClaim] Not eligible: ${eligibility.reason}`);
        setError(error);
        setStatus("error");
        onError?.(error);
        throw error;
      }

      if (eligibility.alreadyClaimed) {
        const error = new Error("Prize already claimed on blockchain");
        console.log(`[PrizeClaim] Already claimed`);
        setError(error);
        setStatus("error");
        onError?.(error);
        throw error;
      }

      console.log(`[PrizeClaim] Eligibility verified`);
      console.log(`  Winner: ${eligibility.onChainWinner}`);
      console.log(`  Prize amount: ${eligibility.prizeAmount?.toString()}`);

      setPrizeAmount(eligibility.prizeAmount || BigInt(0));

      // Step 2: Sign transaction
      console.log(`[PrizeClaim] Requesting wallet signature...`);
      setStatus("signing");

      // Note: Adjust ABI and function name based on your actual contract
      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            name: "claimPrize",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [],
            outputs: [],
          },
        ],
        functionName: "claimPrize",
      });

      setTransactionHash(hash);
      console.log(`[PrizeClaim] Transaction submitted: ${hash}`);

      // Step 3: Wait for confirmation
      console.log(`[PrizeClaim] Waiting for blockchain confirmation...`);
      setStatus("confirming");

      const confirmation = await waitForConfirmation(hash);

      if (!confirmation.success || !confirmation.receipt) {
        throw new Error(
          confirmation.error?.message || "Transaction failed on blockchain"
        );
      }

      console.log(`[PrizeClaim] Transaction confirmed at block ${confirmation.blockNumber}`);

      // Step 4: Sync with database
      console.log(`[PrizeClaim] Syncing with database...`);
      setStatus("syncing");

      const dbResponse = await fetch(`/api/debates/${debateId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winnerAddress: address,
          contractAddress,
          transactionHash: hash,
          blockNumber: Number(confirmation.blockNumber),
          amount: eligibility.prizeAmount?.toString(),
          claimedAt: new Date().toISOString(),
        }),
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json().catch(() => ({}));
        console.error(`[PrizeClaim] Database sync failed:`, errorData);
        // Don't throw - prize is claimed on-chain, DB sync can be reconciled later
      } else {
        console.log(`[PrizeClaim] Database synced successfully`);
      }

      // Step 5: Success
      setStatus("success");
      console.log(`[PrizeClaim] Prize claimed successfully!`);
      console.log(`  Debate: ${debateId}`);
      console.log(`  Transaction: ${hash}`);
      console.log(`  Amount: ${eligibility.prizeAmount?.toString()}`);

      onSuccess?.(hash, eligibility.prizeAmount || BigInt(0));

      return {
        transactionHash: hash,
        blockNumber: confirmation.blockNumber,
        amount: eligibility.prizeAmount,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error claiming prize");
      console.error(`[PrizeClaim] Prize claim failed:`, error);

      setError(error);
      setStatus("error");
      onError?.(error);

      throw error;
    }
  };

  /**
   * Check eligibility without claiming
   */
  const checkEligibility = async (debateId: string): Promise<boolean> => {
    if (!address) {
      return false;
    }

    try {
      const eligibility = await verifyPrizeClaimEligibility(debateId, address);
      setIsEligible(eligibility.eligible);
      setEligibilityReason(eligibility.reason);
      setPrizeAmount(eligibility.prizeAmount || null);
      return eligibility.eligible;
    } catch (error) {
      console.error(`[PrizeClaim] Error checking eligibility:`, error);
      return false;
    }
  };

  /**
   * Reset the hook state
   */
  const reset = () => {
    setStatus("idle");
    setTransactionHash(null);
    setPrizeAmount(null);
    setError(null);
    setIsEligible(null);
    setEligibilityReason(null);
  };

  // Helper booleans
  const isLoading = ["verifying", "signing", "confirming", "syncing"].includes(status);
  const isSuccess = status === "success";
  const isError = status === "error";

  return {
    // Main functions
    claimPrize,
    checkEligibility,
    reset,

    // State
    status,
    transactionHash,
    prizeAmount,
    error,
    isEligible,
    reason: eligibilityReason,

    // Helper booleans
    isLoading,
    isSuccess,
    isError,

    // Granular status checks
    isVerifying: status === "verifying",
    isSigning: status === "signing",
    isConfirming: status === "confirming",
    isSyncing: status === "syncing",
  };
}
