"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { DebateFactoryABI } from "@/lib/contracts/abis/DebateFactoryABI";
import { USDCABI } from "@/lib/contracts/abis/USDCABI";
import { USDC_ADDRESSES } from "@/lib/constants";
import { baseSepolia, base } from "wagmi/chains";

// Contract addresses - will be updated after deployment
const DEBATE_FACTORY_ADDRESSES = {
  BASE_MAINNET: process.env.NEXT_PUBLIC_DEBATE_FACTORY_MAINNET || "",
  BASE_SEPOLIA: process.env.NEXT_PUBLIC_DEBATE_FACTORY_SEPOLIA || "",
};

interface CreateDebateParams {
  stakeAmount: number;
  onSuccess?: (debatePoolAddress: string, txHash: string) => void;
  onError?: (error: Error) => void;
}

export function useCreateDebate() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const [currentStep, setCurrentStep] = useState<"idle" | "approving" | "creating">("idle");

  const usdcAddress =
    chainId === baseSepolia.id ? USDC_ADDRESSES.BASE_SEPOLIA : USDC_ADDRESSES.BASE_MAINNET;

  const factoryAddress =
    chainId === baseSepolia.id
      ? DEBATE_FACTORY_ADDRESSES.BASE_SEPOLIA
      : DEBATE_FACTORY_ADDRESSES.BASE_MAINNET;

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Approve USDC spending for the DebateFactory contract
   */
  const approveUSDC = async (stakeAmount: number) => {
    if (!address || !factoryAddress) {
      throw new Error("Wallet not connected or factory not deployed");
    }

    setCurrentStep("approving");

    // Convert stake amount to USDC units (6 decimals)
    const amount = parseUnits(stakeAmount.toString(), 6);

    return writeContract({
      address: usdcAddress as `0x${string}`,
      abi: USDCABI,
      functionName: "approve",
      args: [factoryAddress as `0x${string}`, amount],
    });
  };

  /**
   * Create debate on-chain
   */
  const createDebate = async ({ stakeAmount, onSuccess, onError }: CreateDebateParams) => {
    if (!address || !factoryAddress) {
      const error = new Error("Wallet not connected or factory not deployed");
      onError?.(error);
      throw error;
    }

    try {
      setCurrentStep("creating");

      // Convert stake amount to USDC units (6 decimals)
      const amount = parseUnits(stakeAmount.toString(), 6);

      writeContract(
        {
          address: factoryAddress as `0x${string}`,
          abi: DebateFactoryABI,
          functionName: "createDebate",
          args: [amount],
        },
        {
          onSuccess: (txHash) => {
            // Note: We don't have the debate pool address here immediately
            // It will be emitted in the DebateCreated event
            onSuccess?.("", txHash);
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
    createDebate,
    approveUSDC,
    isApproving: currentStep === "approving" && isPending,
    isCreating: currentStep === "creating" && isPending,
    isConfirming,
    isSuccess,
    hash,
    factoryAddress,
  };
}
