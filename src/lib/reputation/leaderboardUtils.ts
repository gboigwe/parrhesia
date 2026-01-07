/**
 * Leaderboard utility functions
 */

import type { LeaderboardEntry } from "./types";

/**
 * Sort leaderboard entries by reputation (descending)
 */
export function sortByReputation(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.reputation - a.reputation);
}

/**
 * Add rank to leaderboard entries
 */
export function addRanks(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const sorted = sortByReputation(entries);
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

/**
 * Filter leaderboard by category
 */
export function filterByCategory(
  entries: LeaderboardEntry[],
  category: string
): LeaderboardEntry[] {
  // This would need category data in entries
  // For now, return all entries
  return entries;
}

/**
 * Get top N entries
 */
export function getTopN(entries: LeaderboardEntry[], n: number): LeaderboardEntry[] {
  return addRanks(entries).slice(0, n);
}

/**
 * Calculate average reputation
 */
export function calculateAverageReputation(entries: LeaderboardEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, entry) => acc + entry.reputation, 0);
  return sum / entries.length;
}

/**
 * Get user rank
 */
export function getUserRank(
  entries: LeaderboardEntry[],
  userId: string
): number | null {
  const ranked = addRanks(entries);
  const userEntry = ranked.find((entry) => entry.userId === userId);
  return userEntry?.rank || null;
}

/**
 * Format rank for display
 */
export function formatRank(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

/**
 * Get rank change icon
 */
export function getRankChangeIcon(change: number): "up" | "down" | "stable" {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "stable";
}

/**
 * Calculate percentile
 */
export function calculatePercentile(
  entries: LeaderboardEntry[],
  userId: string
): number {
  const rank = getUserRank(entries, userId);
  if (!rank) return 0;
  return ((entries.length - rank + 1) / entries.length) * 100;
}
