/**
 * Debate-Specific Batch Operations
 * Atomic multi-step debate interactions
 */

import { type Address } from "viem";
import { type BatchCall, prepareBatchCalls } from "./batch";
import { DebatePoolABI } from "@/lib/contracts/abis/DebatePoolABI";

/**
 * Join debate and submit first argument atomically
 */
export function createJoinAndSubmitBatch(
  debatePoolAddress: Address,
  stakeAmount: bigint,
  argumentText: string
): BatchCall[] {
  return [
    {
      address: debatePoolAddress,
      abi: DebatePoolABI,
      functionName: "stake",
      args: [],
    },
    {
      address: debatePoolAddress,
      abi: DebatePoolABI,
      functionName: "submitArgument",
      args: [argumentText],
    },
  ];
}

/**
 * Submit multiple votes in one transaction
 */
export function createBatchVoteBatch(
  debatePoolAddress: Address,
  argumentIds: string[],
  votes: boolean[] // true = upvote, false = downvote
): BatchCall[] {
  if (argumentIds.length !== votes.length) {
    throw new Error("argumentIds and votes arrays must have same length");
  }

  return argumentIds.map((argumentId, index) => ({
    address: debatePoolAddress,
    abi: DebatePoolABI,
    functionName: "vote",
    args: [argumentId, votes[index]],
  }));
}

/**
 * Approve USDC and create debate atomically
 */
export function createApproveAndCreateBatch(
  usdcAddress: Address,
  debateFactoryAddress: Address,
  stakeAmount: bigint,
  usdcABI: readonly unknown[],
  factoryABI: readonly unknown[]
): BatchCall[] {
  return [
    {
      address: usdcAddress,
      abi: usdcABI,
      functionName: "approve",
      args: [debateFactoryAddress, stakeAmount],
    },
    {
      address: debateFactoryAddress,
      abi: factoryABI,
      functionName: "createDebate",
      args: [stakeAmount],
    },
  ];
}

/**
 * Approve USDC and join debate atomically
 */
export function createApproveAndJoinBatch(
  usdcAddress: Address,
  debatePoolAddress: Address,
  stakeAmount: bigint,
  usdcABI: readonly unknown[]
): BatchCall[] {
  return [
    {
      address: usdcAddress,
      abi: usdcABI,
      functionName: "approve",
      args: [debatePoolAddress, stakeAmount],
    },
    {
      address: debatePoolAddress,
      abi: DebatePoolABI,
      functionName: "stake",
      args: [],
    },
  ];
}

/**
 * Full flow: Approve, join, and submit first argument
 */
export function createFullJoinBatch(
  usdcAddress: Address,
  debatePoolAddress: Address,
  stakeAmount: bigint,
  argumentText: string,
  usdcABI: readonly unknown[]
): BatchCall[] {
  return [
    {
      address: usdcAddress,
      abi: usdcABI,
      functionName: "approve",
      args: [debatePoolAddress, stakeAmount],
    },
    {
      address: debatePoolAddress,
      abi: DebatePoolABI,
      functionName: "stake",
      args: [],
    },
    {
      address: debatePoolAddress,
      abi: DebatePoolABI,
      functionName: "submitArgument",
      args: [argumentText],
    },
  ];
}

/**
 * Batch operations registry
 * Maps operation type to batch creation function
 */
export const BATCH_OPERATIONS = {
  JOIN_AND_SUBMIT: "join_and_submit",
  BATCH_VOTE: "batch_vote",
  APPROVE_AND_CREATE: "approve_and_create",
  APPROVE_AND_JOIN: "approve_and_join",
  FULL_JOIN: "full_join",
} as const;

export type BatchOperationType =
  (typeof BATCH_OPERATIONS)[keyof typeof BATCH_OPERATIONS];
