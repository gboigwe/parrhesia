/**
 * Prize Claim Verification Utilities
 */

import { readContract } from "wagmi/actions";
import { DEBATE_POOL_ABI } from "../contracts/debatePoolABI";
import { CLAIM_ERRORS } from "./constants";
import type { PrizeEligibility, PrizePoolState } from "./types";

export async function verifyClaimEligibility(
  contractAddress: string,
  userAddress: string,
  config: any
): Promise<PrizeEligibility> {
  try {
    const poolState = (await readContract(config, {
      address: contractAddress as `0x${string}`,
      abi: DEBATE_POOL_ABI,
      functionName: "getPoolState",
    })) as [string, string, bigint, bigint, string, boolean, boolean];

    const [
      creator,
      challenger,
      creatorStake,
      challengerStake,
      winner,
      isFinalized,
      prizeClaimed,
    ] = poolState;

    if (!isFinalized) {
      return {
        isEligible: false,
        reason: CLAIM_ERRORS.DEBATE_NOT_FINALIZED,
      };
    }

    if (prizeClaimed) {
      return {
        isEligible: false,
        reason: CLAIM_ERRORS.ALREADY_CLAIMED,
        alreadyClaimed: true,
      };
    }

    const normalizedUser = userAddress.toLowerCase();
    const normalizedWinner = winner.toLowerCase();

    if (normalizedUser !== normalizedWinner) {
      return {
        isEligible: false,
        reason: CLAIM_ERRORS.NOT_WINNER,
        winner,
      };
    }

    const prizeAmount = (await readContract(config, {
      address: contractAddress as `0x${string}`,
      abi: DEBATE_POOL_ABI,
      functionName: "getPrizeAmount",
      args: [userAddress as `0x${string}`],
    })) as bigint;

    const totalPool = (await readContract(config, {
      address: contractAddress as `0x${string}`,
      abi: DEBATE_POOL_ABI,
      functionName: "getTotalPool",
    })) as bigint;

    return {
      isEligible: true,
      winner,
      amount: prizeAmount.toString(),
      contractBalance: totalPool.toString(),
    };
  } catch (error) {
    console.error("Eligibility verification failed:", error);
    return {
      isEligible: false,
      reason: "Verification failed: " + (error as Error).message,
    };
  }
}

export async function getPoolState(
  contractAddress: string,
  config: any
): Promise<PrizePoolState> {
  const poolState = (await readContract(config, {
    address: contractAddress as `0x${string}`,
    abi: DEBATE_POOL_ABI,
    functionName: "getPoolState",
  })) as [string, string, bigint, bigint, string, boolean, boolean];

  const [
    creator,
    challenger,
    creatorStake,
    challengerStake,
    winner,
    isFinalized,
    prizeClaimed,
  ] = poolState;

  const totalStaked = creatorStake + challengerStake;
  const platformFee = (totalStaked * 5n) / 100n;

  return {
    totalStaked: totalStaked.toString(),
    creatorStake: creatorStake.toString(),
    challengerStake: challengerStake.toString(),
    platformFee: platformFee.toString(),
    isFinalized,
    winner: winner !== "0x0000000000000000000000000000000000000000" ? winner : undefined,
    prizeClaimed,
  };
}

export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateDebateId(debateId: string): boolean {
  return debateId.length > 0 && debateId.length <= 100;
}
