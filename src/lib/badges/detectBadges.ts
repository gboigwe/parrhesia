/**
 * Badge Detection Service
 * Automatically detects when users earn new badges
 */

import { BADGE_TYPES } from "./constants";

interface UserStats {
  // Debater stats
  wins: number;
  losses: number;
  totalDebates: number;
  consecutiveWins: number;
  highestScore: number;
  categoriesDebated: string[];
  categoryWins: Record<string, number>;
  opponentsDefeated: Array<{ rank: number; userRank: number }>;

  // Voter stats
  totalVotes: number;
  correctVotes: number;
  votingStreak: number;

  // General
  reputation: number;
  leaderboardRank: number | null;
}

interface Badge {
  type: string;
  earnedAt: Date;
}

export function detectNewBadges(
  userStats: UserStats,
  currentBadges: Badge[]
): string[] {
  const newBadges: string[] = [];
  const currentBadgeTypes = new Set(currentBadges.map((b) => b.type));

  // Debater Badges
  if (userStats.wins >= 1 && !currentBadgeTypes.has(BADGE_TYPES.FIRST_WIN)) {
    newBadges.push(BADGE_TYPES.FIRST_WIN);
  }

  if (
    userStats.consecutiveWins >= 5 &&
    !currentBadgeTypes.has(BADGE_TYPES.WIN_STREAK_5)
  ) {
    newBadges.push(BADGE_TYPES.WIN_STREAK_5);
  }

  if (
    userStats.consecutiveWins >= 10 &&
    !currentBadgeTypes.has(BADGE_TYPES.WIN_STREAK_10)
  ) {
    newBadges.push(BADGE_TYPES.WIN_STREAK_10);
  }

  if (
    userStats.highestScore >= 10 &&
    !currentBadgeTypes.has(BADGE_TYPES.PERFECT_SCORE)
  ) {
    newBadges.push(BADGE_TYPES.PERFECT_SCORE);
  }

  const hasGiantSlayerVictory = userStats.opponentsDefeated.some(
    (opp) => opp.userRank - opp.rank >= 20
  );
  if (
    hasGiantSlayerVictory &&
    !currentBadgeTypes.has(BADGE_TYPES.GIANT_SLAYER)
  ) {
    newBadges.push(BADGE_TYPES.GIANT_SLAYER);
  }

  const maxCategoryWins = Math.max(...Object.values(userStats.categoryWins), 0);
  if (
    maxCategoryWins >= 10 &&
    !currentBadgeTypes.has(BADGE_TYPES.SPECIALIST)
  ) {
    newBadges.push(BADGE_TYPES.SPECIALIST);
  }

  if (
    userStats.categoriesDebated.length >= 5 &&
    !currentBadgeTypes.has(BADGE_TYPES.VERSATILE)
  ) {
    newBadges.push(BADGE_TYPES.VERSATILE);
  }

  if (
    userStats.totalDebates >= 50 &&
    !currentBadgeTypes.has(BADGE_TYPES.DEBATE_VETERAN)
  ) {
    newBadges.push(BADGE_TYPES.DEBATE_VETERAN);
  }

  // Voter Badges
  if (
    userStats.totalVotes >= 1 &&
    !currentBadgeTypes.has(BADGE_TYPES.FIRST_VOTE)
  ) {
    newBadges.push(BADGE_TYPES.FIRST_VOTE);
  }

  const accuracy =
    userStats.totalVotes > 0
      ? (userStats.correctVotes / userStats.totalVotes) * 100
      : 0;

  if (
    accuracy >= 80 &&
    userStats.totalVotes >= 20 &&
    !currentBadgeTypes.has(BADGE_TYPES.ACCURATE_VOTER)
  ) {
    newBadges.push(BADGE_TYPES.ACCURATE_VOTER);
  }

  if (
    userStats.votingStreak >= 7 &&
    !currentBadgeTypes.has(BADGE_TYPES.VOTE_STREAK)
  ) {
    newBadges.push(BADGE_TYPES.VOTE_STREAK);
  }

  if (
    userStats.totalVotes >= 100 &&
    !currentBadgeTypes.has(BADGE_TYPES.SUPER_VOTER)
  ) {
    newBadges.push(BADGE_TYPES.SUPER_VOTER);
  }

  if (
    accuracy >= 95 &&
    userStats.totalVotes >= 50 &&
    !currentBadgeTypes.has(BADGE_TYPES.ORACLE)
  ) {
    newBadges.push(BADGE_TYPES.ORACLE);
  }

  // Special Badges
  if (
    userStats.reputation >= 90 &&
    !currentBadgeTypes.has(BADGE_TYPES.LEGENDARY_DEBATER)
  ) {
    newBadges.push(BADGE_TYPES.LEGENDARY_DEBATER);
  }

  if (
    userStats.leaderboardRank !== null &&
    userStats.leaderboardRank <= 10 &&
    !currentBadgeTypes.has(BADGE_TYPES.TOP_CONTRIBUTOR)
  ) {
    newBadges.push(BADGE_TYPES.TOP_CONTRIBUTOR);
  }

  return newBadges;
}

export function checkBadgeProgress(
  badgeType: string,
  userStats: UserStats
): { current: number; required: number; percentage: number } {
  let current = 0;
  let required = 1;

  switch (badgeType) {
    case BADGE_TYPES.FIRST_WIN:
      current = userStats.wins;
      required = 1;
      break;
    case BADGE_TYPES.WIN_STREAK_5:
      current = userStats.consecutiveWins;
      required = 5;
      break;
    case BADGE_TYPES.WIN_STREAK_10:
      current = userStats.consecutiveWins;
      required = 10;
      break;
    case BADGE_TYPES.VERSATILE:
      current = userStats.categoriesDebated.length;
      required = 5;
      break;
    case BADGE_TYPES.SPECIALIST:
      current = Math.max(...Object.values(userStats.categoryWins), 0);
      required = 10;
      break;
    case BADGE_TYPES.DEBATE_VETERAN:
      current = userStats.totalDebates;
      required = 50;
      break;
    case BADGE_TYPES.SUPER_VOTER:
      current = userStats.totalVotes;
      required = 100;
      break;
    case BADGE_TYPES.ORACLE:
      current = userStats.correctVotes;
      required = 50;
      break;
    case BADGE_TYPES.LEGENDARY_DEBATER:
      current = userStats.reputation;
      required = 90;
      break;
  }

  const percentage = Math.min(100, (current / required) * 100);

  return { current, required, percentage };
}
