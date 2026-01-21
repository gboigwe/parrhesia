/**
 * Join Debate Button Component
 * Complete multi-step flow for joining a debate
 */

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { useJoinDebate } from "@/hooks/useJoinDebate";
import { useJoinDebateValidation } from "@/hooks/useJoinDebateValidation";
import { JoinProgress } from "./JoinProgress";

interface JoinDebateButtonProps {
  debateId: string;
  debatePoolAddress: string;
  stakeAmount: number;
  creatorId: string;
  status: string;
  userId?: string;
  onSuccess?: () => void;
}

export function JoinDebateButton({
  debateId,
  debatePoolAddress,
  stakeAmount,
  creatorId,
  status,
  userId,
  onSuccess,
}: JoinDebateButtonProps) {
  const { address } = useAccount();
  const {
    joinDebate,
    approveUSDC,
    isApproving,
    isJoining,
    isConfirming,
    isSuccess,
    hash,
  } = useJoinDebate();

  const [currentStep, setCurrentStep] = useState<
    "idle" | "approving" | "joining" | "confirming" | "complete" | "error"
  >("idle");
  const [error, setError] = useState<string>();
  const [showProgress, setShowProgress] = useState(false);

  const validation = useJoinDebateValidation(
    {
      id: debateId,
      status,
      creatorId,
      stakeAmount,
    },
    userId
  );

  const handleJoin = async () => {
    if (!address || !userId) {
      setError("Wallet not connected");
      return;
    }

    setShowProgress(true);
    setError(undefined);

    try {
      // Step 1: Approve USDC
      setCurrentStep("approving");
      await approveUSDC(debatePoolAddress, stakeAmount);

      // Wait for approval confirmation
      // In production, use waitForTransactionReceipt
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 2: Join debate
      setCurrentStep("joining");
      await joinDebate({
        debatePoolAddress,
        stakeAmount,
        debateId,
        onSuccess: async (txHash) => {
          setCurrentStep("confirming");

          // Step 3: Update database
          try {
            const response = await fetch(`/api/debates/${debateId}/join`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                challengerId: userId,
                challengerAddress: address,
                transactionHash: txHash,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update database");
            }

            setCurrentStep("complete");
            setTimeout(() => {
              onSuccess?.();
              setShowProgress(false);
              setCurrentStep("idle");
            }, 3000);
          } catch (dbError) {
            console.error("Database update error:", dbError);
            setError("Transaction succeeded but database update failed");
            setCurrentStep("error");
          }
        },
        onError: (err) => {
          setError(err.message || "Failed to join debate");
          setCurrentStep("error");
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to join debate");
      setCurrentStep("error");
    }
  };

  if (showProgress) {
    return <JoinProgress currentStep={currentStep} error={error} />;
  }

  if (!validation.canJoin) {
    return (
      <div className="space-y-2">
        <button
          disabled
          className="w-full bg-gray-300 text-gray-600 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
        >
          Cannot Join
        </button>
        <div className="text-sm text-gray-600 space-y-1">
          {validation.reasons.map((reason, i) => (
            <p key={i}>• {reason}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Join this Debate
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Stake {stakeAmount} USDC to join as the challenger
        </p>
        <ul className="text-xs text-blue-600 space-y-1 mb-4">
          <li>✓ Gasless transaction (sponsored)</li>
          <li>✓ Multi-step approval & join</li>
          <li>✓ Win 95% of prize pool</li>
        </ul>
        <button
          onClick={handleJoin}
          disabled={isApproving || isJoining || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApproving
            ? "Approving USDC..."
            : isJoining
            ? "Joining Debate..."
            : isConfirming
            ? "Confirming..."
            : "Join Debate"}
        </button>
      </div>
    </div>
  );
}
