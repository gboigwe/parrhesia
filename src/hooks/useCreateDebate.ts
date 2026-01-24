"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { DebateFactoryABI } from "@/lib/contracts/abis/DebateFactoryABI";
import { USDCABI } from "@/lib/contracts/abis/USDCABI";
import { waitForConfirmation, extractDebateIdFromLogs } from "@/lib/blockchain/transactions";
import { BLOCKCHAIN_CONFIG } from "@/lib/blockchain/constants";

/**
 * Status of the debate creation process
 * - idle: Not started
 * - preparing: Preparing transaction
 * - signing: User signing in wallet
 * - confirming: Waiting for blockchain confirmations
 * - syncing: Updating database after confirmation
 * - success: Everything complete
 * - error: Something failed
 */
type CreateDebateStatus = "idle" | "preparing" | "signing" | "confirming" | "syncing" | "success" | "error";

interface CreateDebateParams {
  topic: string;
  stakeAmount: number;
  duration: number; // Duration in seconds
  onSuccess?: (debateId: string, txHash: string) => void;
  onError?: (error: Error) => void;
}

export function useCreateDebate() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  // State management
  const [status, setStatus] = useState<CreateDebateStatus>("idle");
  const [debateId, setDebateId] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Approve USDC spending for the DebateFactory contract
   */
  const approveUSDC = async (stakeAmount: number) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    if (!BLOCKCHAIN_CONFIG.usdcAddress) {
      throw new Error("USDC address not configured");
    }

    if (!BLOCKCHAIN_CONFIG.debateFactoryAddress) {
      throw new Error("Debate Factory address not configured");
    }

    console.log("💰 Approving USDC spend...");
    console.log(`   Amount: ${stakeAmount} USDC`);
    console.log(`   Spender: ${BLOCKCHAIN_CONFIG.debateFactoryAddress}`);

    // Convert stake amount to USDC units (6 decimals)
    const amount = parseUnits(stakeAmount.toString(), 6);

    const hash = await writeContractAsync({
      address: BLOCKCHAIN_CONFIG.usdcAddress,
      abi: USDCABI,
      functionName: "approve",
      args: [BLOCKCHAIN_CONFIG.debateFactoryAddress, amount],
      chainId: BLOCKCHAIN_CONFIG.chainId,
    });

    console.log("✅ USDC approval submitted:", hash);
    
    // Wait for approval confirmation
    const confirmation = await waitForConfirmation(hash);
    
    if (!confirmation.success) {
      throw new Error("USDC approval failed");
    }

    console.log("✅ USDC approval confirmed");
    return hash;
  };

  /**
   * Create debate on-chain with proper confirmation flow
   */
  const createDebate = async ({ topic, stakeAmount, duration, onSuccess, onError }: CreateDebateParams) => {
    if (!address) {
      const error = new Error("Wallet not connected");
      setError(error);
      setStatus("error");
      onError?.(error);
      throw error;
    }

    if (!BLOCKCHAIN_CONFIG.debateFactoryAddress) {
      const error = new Error("Debate Factory address not configured. Please set NEXT_PUBLIC_DEBATE_FACTORY_ADDRESS in .env");
      setError(error);
      setStatus("error");
      onError?.(error);
      throw error;
    }

    try {
      // Reset state
      setError(null);
      setDebateId(null);
      setTransactionHash(null);

      // Step 1: Preparing
      console.log("🎯 Creating debate...");
      console.log(`   Topic: ${topic}`);
      console.log(`   Stake: ${stakeAmount} USDC`);
      console.log(`   Duration: ${duration}s`);
      setStatus("preparing");

      // Convert stake amount to USDC units (6 decimals)
      const amount = parseUnits(stakeAmount.toString(), 6);

      // Step 2: Signing
      console.log("✍️  Requesting wallet signature...");
      setStatus("signing");

      const hash = await writeContractAsync({
        address: BLOCKCHAIN_CONFIG.debateFactoryAddress,
        abi: DebateFactoryABI,
        functionName: "createDebate",
        args: [amount, topic, duration],
        chainId: BLOCKCHAIN_CONFIG.chainId,
      });

      setTransactionHash(hash);
      console.log("📝 Transaction submitted:", hash);
      console.log(`   View: ${BLOCKCHAIN_CONFIG.blockExplorerUrl}/tx/${hash}`);

      // Step 3: Confirming
      console.log("⏳ Waiting for blockchain confirmation...");
      console.log(`   Required confirmations: 2 blocks (~4 seconds on Base)`);
      setStatus("confirming");

      const confirmation = await waitForConfirmation(hash);

      if (!confirmation.success || !confirmation.receipt) {
        throw new Error(
          confirmation.error?.message || "Transaction failed on blockchain"
        );
      }

      console.log("✅ Blockchain confirmation received!");

      // Extract debate ID from logs
      const extractedDebateId = extractDebateIdFromLogs(
        confirmation.receipt,
        DebateFactoryABI
      );
      setDebateId(extractedDebateId);

      // Step 4: Syncing with database
      console.log("💾 Syncing with database...");
      setStatus("syncing");

      const dbResponse = await fetch("/api/debates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          debateId: extractedDebateId,
          topic,
          stakeAmount,
          duration,
          creatorAddress: address,
          transactionHash: hash,
          contractAddress: confirmation.receipt.contractAddress,
          blockNumber: Number(confirmation.blockNumber),
          chainId: BLOCKCHAIN_CONFIG.chainId,
          syncStatus: "confirmed",
        }),
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Database sync failed: ${dbResponse.status}`
        );
      }

      const dbData = await dbResponse.json();
      console.log("✅ Database synced successfully!");
      console.log(`   Database ID: ${dbData.id}`);

      // Step 5: Success!
      setStatus("success");
      console.log("🎉 Debate created successfully!");
      console.log(`   Debate ID: ${extractedDebateId}`);
      console.log(`   Transaction: ${hash}`);

      onSuccess?.(extractedDebateId, hash);

      return {
        debateId: extractedDebateId,
        transactionHash: hash,
        blockNumber: confirmation.blockNumber,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error creating debate");
      console.error("❌ Debate creation failed:", error);
      
      setError(error);
      setStatus("error");
      onError?.(error);
      
      throw error;
    }
  };

  /**
   * Reset the hook state
   */
  const reset = () => {
    setStatus("idle");
    setDebateId(null);
    setTransactionHash(null);
    setError(null);
  };

  // Helper booleans
  const isLoading = ["preparing", "signing", "confirming", "syncing"].includes(status);
  const isSuccess = status === "success";
  const isError = status === "error";

  return {
    // Main functions
    createDebate,
    approveUSDC,
    reset,
    
    // State
    status,
    debateId,
    transactionHash,
    error,
    
    // Helper booleans
    isLoading,
    isSuccess,
    isError,
    
    // Granular status checks
    isPreparing: status === "preparing",
    isSigning: status === "signing",
    isConfirming: status === "confirming",
    isSyncing: status === "syncing",
    
    // Config (for UI to display)
    factoryAddress: BLOCKCHAIN_CONFIG.debateFactoryAddress,
    chainId: BLOCKCHAIN_CONFIG.chainId,
    chainName: BLOCKCHAIN_CONFIG.chainName,
  };
}
