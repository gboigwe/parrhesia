/**
 * Results utility functions
 */

import { PRIZE_DISTRIBUTION } from "@/lib/voting/constants";
import type { PrizeDistributionDetails } from "./types";

/**
 * Calculate detailed prize distribution
 */
export function calculatePrizeDistribution(
  prizePool: string | number,
  totalVotes: number
): PrizeDistributionDetails {
  const pool = typeof prizePool === "string" ? parseFloat(prizePool) : prizePool;

  const winnerPercentage = PRIZE_DISTRIBUTION.WINNER_PERCENT;
  const voterPercentage = PRIZE_DISTRIBUTION.VOTER_REWARD_PERCENT;
  const platformPercentage = PRIZE_DISTRIBUTION.PLATFORM_FEE_PERCENT;

  const winnerPrize = (pool * winnerPercentage) / 100;
  const voterRewardPool = (pool * voterPercentage) / 100;
  const platformFee = (pool * platformPercentage) / 100;
  const perVoterReward = totalVotes > 0 ? voterRewardPool / totalVotes : 0;

  return {
    totalPool: pool,
    winnerPrize,
    voterRewardPool,
    platformFee,
    perVoterReward,
    winnerPercentage,
    voterPercentage,
    platformPercentage,
  };
}

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${value.toFixed(2)} USDC`;
}

/**
 * Calculate vote percentage
 */
export function calculateVotePercentage(votes: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return (votes / totalVotes) * 100;
}

/**
 * Determine if user can claim prize
 */
export function canClaimPrize(
  userId: string,
  winnerId: string | null,
  prizeClaimed: boolean
): boolean {
  if (!winnerId || !userId) return false;
  if (prizeClaimed) return false;
  return userId === winnerId;
}

/**
 * Determine if user can claim voter reward
 */
export function canClaimVoterReward(
  userVote: { userId: string; rewardClaimed?: boolean } | null
): boolean {
  if (!userVote) return false;
  return !userVote.rewardClaimed;
}

/**
 * Calculate average score from votes
 */
export function calculateAverageScore(
  votes: Array<{ totalScore: string | number }>
): number {
  if (votes.length === 0) return 0;

  const sum = votes.reduce((acc, vote) => {
    const score =
      typeof vote.totalScore === "string"
        ? parseFloat(vote.totalScore)
        : vote.totalScore;
    return acc + score;
  }, 0);

  return sum / votes.length;
}

/**
 * Get color class based on score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 8) return "text-green-600 dark:text-green-400";
  if (score >= 6) return "text-blue-600 dark:text-blue-400";
  if (score >= 4) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * Get bar color class based on score
 */
export function getBarColorClass(score: number): string {
  if (score >= 8) return "bg-green-500";
  if (score >= 6) return "bg-blue-500";
  if (score >= 4) return "bg-yellow-500";
  return "bg-red-500";
}
