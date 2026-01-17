/**
 * Badge utility functions
 */

import { BADGE_METADATA, RARITY_COLORS } from "./constants";

export function getBadgeRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: "text-gray-600 dark:text-gray-400",
    uncommon: "text-green-600 dark:text-green-400",
    rare: "text-blue-600 dark:text-blue-400",
    epic: "text-purple-600 dark:text-purple-400",
    legendary: "text-yellow-600 dark:text-yellow-400",
  };
  return colors[rarity] || colors.common;
}

export function sortBadgesByRarity(badges: any[]): any[] {
  const rarityOrder = {
    legendary: 0,
    epic: 1,
    rare: 2,
    uncommon: 3,
    common: 4,
  };

  return [...badges].sort((a, b) => {
    const metaA = BADGE_METADATA[a.type as keyof typeof BADGE_METADATA];
    const metaB = BADGE_METADATA[b.type as keyof typeof BADGE_METADATA];

    const rarityA = rarityOrder[metaA?.rarity as keyof typeof rarityOrder] ?? 5;
    const rarityB = rarityOrder[metaB?.rarity as keyof typeof rarityOrder] ?? 5;

    return rarityA - rarityB;
  });
}

export function groupBadgesByRarity(badges: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {
    legendary: [],
    epic: [],
    rare: [],
    uncommon: [],
    common: [],
  };

  badges.forEach((badge) => {
    const metadata = BADGE_METADATA[badge.type as keyof typeof BADGE_METADATA];
    if (metadata && metadata.rarity in groups) {
      groups[metadata.rarity].push(badge);
    }
  });

  return groups;
}

export function calculateBadgeStats(badges: any[]): {
  total: number;
  byRarity: Record<string, number>;
  byCategory: Record<string, number>;
} {
  const stats = {
    total: badges.length,
    byRarity: {
      legendary: 0,
      epic: 0,
      rare: 0,
      uncommon: 0,
      common: 0,
    },
    byCategory: {
      debater: 0,
      voter: 0,
      special: 0,
    },
  };

  badges.forEach((badge) => {
    const metadata = BADGE_METADATA[badge.type as keyof typeof BADGE_METADATA];
    if (metadata) {
      stats.byRarity[metadata.rarity as keyof typeof stats.byRarity]++;

      if (isDebaterBadge(badge.type)) {
        stats.byCategory.debater++;
      } else if (isVoterBadge(badge.type)) {
        stats.byCategory.voter++;
      } else {
        stats.byCategory.special++;
      }
    }
  });

  return stats;
}

export function isDebaterBadge(badgeType: string): boolean {
  const debaterBadges = [
    "first_win",
    "win_streak_5",
    "win_streak_10",
    "giant_slayer",
    "perfect_score",
    "specialist",
    "versatile",
    "debate_veteran",
  ];
  return debaterBadges.includes(badgeType);
}

export function isVoterBadge(badgeType: string): boolean {
  const voterBadges = [
    "first_vote",
    "accurate_voter",
    "vote_streak",
    "super_voter",
    "oracle",
  ];
  return voterBadges.includes(badgeType);
}

export function getRarestBadge(badges: any[]): any | null {
  if (badges.length === 0) return null;

  const sorted = sortBadgesByRarity(badges);
  return sorted[0];
}
