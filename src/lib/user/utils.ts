/**
 * User utility functions for Parrhesia
 */

import type { ReputationTier, UserStats } from "@/types/user";

/**
 * Calculate win rate from stats
 */
export function calculateWinRate(wins: number, totalDebates: number): number {
  if (totalDebates === 0) return 0;
  return (wins / totalDebates) * 100;
}

/**
 * Get reputation tier based on reputation points
 */
export function getReputationTier(reputation: number): ReputationTier {
  if (reputation >= 5000) return "Legendary";
  if (reputation >= 2500) return "Master";
  if (reputation >= 1000) return "Expert";
  if (reputation >= 500) return "Advanced";
  if (reputation >= 100) return "Intermediate";
  return "Beginner";
}

/**
 * Get next reputation tier threshold
 */
export function getNextTierThreshold(reputation: number): number {
  if (reputation < 100) return 100;
  if (reputation < 500) return 500;
  if (reputation < 1000) return 1000;
  if (reputation < 2500) return 2500;
  if (reputation < 5000) return 5000;
  return 5000; // Max tier
}

/**
 * Calculate progress to next tier (0-100)
 */
export function calculateTierProgress(reputation: number): number {
  const nextTier = getNextTierThreshold(reputation);
  if (reputation >= 5000) return 100; // Max tier reached

  const previousTier = reputation < 100 ? 0 : reputation < 500 ? 100 : reputation < 1000 ? 500 : reputation < 2500 ? 1000 : 2500;
  const progress = ((reputation - previousTier) / (nextTier - previousTier)) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Format username with @ prefix
 */
export function formatUsername(basename: string): string {
  return basename.startsWith("@") ? basename : `@${basename}`;
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(basename: string): string {
  const cleaned = basename.replace("@", "");
  if (cleaned.length === 0) return "?";
  if (cleaned.length === 1) return cleaned.toUpperCase();

  const parts = cleaned.split(/[\s_-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}

/**
 * Calculate user percentile rank
 */
export function calculatePercentile(
  userRank: number,
  totalUsers: number
): number {
  if (totalUsers === 0) return 0;
  return ((totalUsers - userRank + 1) / totalUsers) * 100;
}

/**
 * Get user level from reputation (1-100)
 */
export function getUserLevel(reputation: number): number {
  return Math.min(100, Math.floor(reputation / 50) + 1);
}

/**
 * Format large numbers (1000 -> 1K, 1000000 -> 1M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Check if user can create debate (minimum reputation)
 */
export function canCreateDebate(reputation: number, minReputation = 0): boolean {
  return reputation >= minReputation;
}

/**
 * Check if user can vote (minimum reputation)
 */
export function canVote(reputation: number, minReputation = 0): boolean {
  return reputation >= minReputation;
}

/**
 * Calculate user's total net earnings
 */
export function calculateNetEarnings(
  totalEarnings: number,
  totalStaked: number
): number {
  return totalEarnings - totalStaked;
}

/**
 * Get user badge for win streak
 */
export function getStreakBadge(streak: number): string {
  if (streak >= 10) return "=%=%=%";
  if (streak >= 5) return "=%=%";
  if (streak >= 3) return "=%";
  return "";
}

/**
 * Validate basename format
 */
export function isValidBasename(basename: string): boolean {
  const cleaned = basename.replace("@", "");
  return /^[a-zA-Z0-9_-]{3,20}$/.test(cleaned);
}

/**
 * Get user activity summary
 */
export function getUserActivitySummary(stats: UserStats): string {
  const { totalDebates, wins, winRate } = stats;

  if (totalDebates === 0) {
    return "No debates yet";
  }

  if (winRate >= 75) {
    return `${wins} wins with ${winRate.toFixed(0)}% win rate`;
  }

  if (winRate >= 50) {
    return `${totalDebates} debates, ${winRate.toFixed(0)}% win rate`;
  }

  return `${totalDebates} debates completed`;
}
