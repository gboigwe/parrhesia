"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { USDCABI } from "@/lib/contracts/abis/USDCABI";
import { USDC_ADDRESSES } from "@/lib/constants";
import { baseSepolia, base } from "wagmi/chains";

// DebatePool ABI for joining
const DebatePoolJoinABI = [
  {
    inputs: [],
    name: "joinDebate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeAmount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface JoinDebateParams {
  debatePoolAddress: string;
  stakeAmount: number;
  debateId: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function useJoinDebate() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const [currentStep, setCurrentStep] = useState<"idle" | "approving" | "joining">("idle");

  const usdcAddress =
    chainId === baseSepolia.id ? USDC_ADDRESSES.BASE_SEPOLIA : USDC_ADDRESSES.BASE_MAINNET;

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Approve USDC spending for the DebatePool contract
   */
  const approveUSDC = async (debatePoolAddress: string, stakeAmount: number) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    setCurrentStep("approving");

    // Convert stake amount to USDC units (6 decimals)
    const amount = parseUnits(stakeAmount.toString(), 6);

    return writeContract({
      address: usdcAddress as `0x${string}`,
      abi: USDCABI,
      functionName: "approve",
      args: [debatePoolAddress as `0x${string}`, amount],
    });
  };

  /**
   * Join debate on-chain
   */
  const joinDebate = async ({
    debatePoolAddress,
    stakeAmount,
    debateId,
    onSuccess,
    onError,
  }: JoinDebateParams) => {
    if (!address) {
      const error = new Error("Wallet not connected");
      onError?.(error);
      throw error;
    }

    try {
      setCurrentStep("joining");

      writeContract(
        {
          address: debatePoolAddress as `0x${string}`,
          abi: DebatePoolJoinABI,
          functionName: "joinDebate",
        },
        {
          onSuccess: (txHash) => {
            onSuccess?.(txHash);
            setCurrentStep("idle");
          },
          onError: (error) => {
            onError?.(error as Error);
            setCurrentStep("idle");
          },
        }
      );
    } catch (error) {
      onError?.(error as Error);
      setCurrentStep("idle");
      throw error;
    }
  };

  return {
    joinDebate,
    approveUSDC,
    isApproving: currentStep === "approving" && isPending,
    isJoining: currentStep === "joining" && isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}
