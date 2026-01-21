/**
 * Gasless Debate Hook
 * Wrapper around debate hooks with paymaster integration
 * Enables gasless transactions for all debate operations
 */

"use client";

import { useAccount, useChainId, usePublicClient } from "wagmi";
import { type Hash } from "viem";
import {
  SponsorshipType,
  checkPaymasterAvailability,
  trackSponsoredTransaction,
  createSponsorshipData,
} from "@/lib/paymaster";

/**
 * Hook for gasless debate creation
 * Wraps useCreateDebate with paymaster support
 */
export function useGaslessCreate() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const paymasterStatus = checkPaymasterAvailability(chainId);

  /**
   * Track a sponsored transaction after it completes
   */
  const trackTransaction = async (
    txHash: Hash,
    userId: string,
    debateId?: string
  ) => {
    if (!paymasterStatus.available || !publicClient) return;

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      const sponsorshipData = createSponsorshipData(
        receipt,
        userId,
        SponsorshipType.DEBATE_CREATION,
        { debateId }
      );

      await trackSponsoredTransaction(sponsorshipData);
    } catch (error) {
      console.error("Failed to track sponsored transaction:", error);
    }
  };

  return {
    isPaymasterAvailable: paymasterStatus.available,
    paymasterUrl: paymasterStatus.url,
    trackTransaction,
    isGasless: paymasterStatus.available,
  };
}

/**
 * Hook for gasless debate joining
 */
export function useGaslessJoin() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const paymasterStatus = checkPaymasterAvailability(chainId);

  const trackTransaction = async (
    txHash: Hash,
    userId: string,
    debateId: string
  ) => {
    if (!paymasterStatus.available || !publicClient) return;

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      const sponsorshipData = createSponsorshipData(
        receipt,
        userId,
        SponsorshipType.DEBATE_JOIN,
        { debateId }
      );

      await trackSponsoredTransaction(sponsorshipData);
    } catch (error) {
      console.error("Failed to track sponsored transaction:", error);
    }
  };

  return {
    isPaymasterAvailable: paymasterStatus.available,
    trackTransaction,
    isGasless: paymasterStatus.available,
  };
}

/**
 * Hook for gasless argument submission
 */
export function useGaslessArgument() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const paymasterStatus = checkPaymasterAvailability(chainId);

  const trackTransaction = async (
    txHash: Hash,
    userId: string,
    debateId: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!paymasterStatus.available || !publicClient) return;

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      const sponsorshipData = createSponsorshipData(
        receipt,
        userId,
        SponsorshipType.ARGUMENT_SUBMISSION,
        { debateId, metadata }
      );

      await trackSponsoredTransaction(sponsorshipData);
    } catch (error) {
      console.error("Failed to track sponsored transaction:", error);
    }
  };

  return {
    isPaymasterAvailable: paymasterStatus.available,
    trackTransaction,
    isGasless: paymasterStatus.available,
  };
}

/**
 * Hook for gasless voting
 */
export function useGaslessVote() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const paymasterStatus = checkPaymasterAvailability(chainId);

  const trackTransaction = async (
    txHash: Hash,
    userId: string,
    debateId: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!paymasterStatus.available || !publicClient) return;

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      const sponsorshipData = createSponsorshipData(
        receipt,
        userId,
        SponsorshipType.VOTE_SUBMISSION,
        { debateId, metadata }
      );

      await trackSponsoredTransaction(sponsorshipData);
    } catch (error) {
      console.error("Failed to track sponsored transaction:", error);
    }
  };

  return {
    isPaymasterAvailable: paymasterStatus.available,
    trackTransaction,
    isGasless: paymasterStatus.available,
  };
}

/**
 * Hook for general gasless operations
 * Returns paymaster status for current chain
 */
export function usePaymasterStatus() {
  const chainId = useChainId();
  const status = checkPaymasterAvailability(chainId);

  return {
    isAvailable: status.available,
    url: status.url,
    reason: status.reason,
    isGasless: status.available,
  };
}
