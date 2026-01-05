/**
 * User system constants and configurations
 */

import type { ReputationTierConfig } from "@/types/user";

/**
 * Reputation tier configurations
 */
export const REPUTATION_TIERS: ReputationTierConfig[] = [
  {
    name: "Beginner",
    minReputation: 0,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-950",
  },
  {
    name: "Intermediate",
    minReputation: 100,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
  },
  {
    name: "Advanced",
    minReputation: 500,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950",
  },
  {
    name: "Expert",
    minReputation: 1000,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
  },
  {
    name: "Master",
    minReputation: 2500,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    name: "Legendary",
    minReputation: 5000,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
] as const;

/**
 * Reputation earning/losing actions
 */
export const REPUTATION_ACTIONS = {
  DEBATE_WIN: 50,
  DEBATE_LOSS: 10,
  DEBATE_DRAW: 25,
  DEBATE_CREATE: 5,
  VOTE_CAST: 2,
  ARGUMENT_SUBMIT: 3,
  PROFILE_COMPLETE: 10,
  VERIFY_EMAIL: 5,
  FIRST_DEBATE: 20,
  BADGE_EARNED: 15,
  STREAK_3: 10,
  STREAK_5: 25,
  STREAK_10: 50,
  MODERATION_VIOLATION: -20,
  SPAM_REPORT: -10,
} as const;

/**
 * Badge definitions
 */
export const BADGE_DEFINITIONS = {
  FIRST_DEBATE: {
    id: "first_debate",
    name: "First Steps",
    description: "Completed your first debate",
    icon: "<¯",
    rarity: "common" as const,
  },
  FIRST_WIN: {
    id: "first_win",
    name: "First Victory",
    description: "Won your first debate",
    icon: "<Æ",
    rarity: "common" as const,
  },
  WIN_STREAK_3: {
    id: "win_streak_3",
    name: "On Fire",
    description: "Won 3 debates in a row",
    icon: "=%",
    rarity: "rare" as const,
  },
  WIN_STREAK_5: {
    id: "win_streak_5",
    name: "Unstoppable",
    description: "Won 5 debates in a row",
    icon: "¡",
    rarity: "epic" as const,
  },
  WIN_STREAK_10: {
    id: "win_streak_10",
    name: "Legend",
    description: "Won 10 debates in a row",
    icon: "=Q",
    rarity: "legendary" as const,
  },
  DEBATES_10: {
    id: "debates_10",
    name: "Debater",
    description: "Participated in 10 debates",
    icon: "=¬",
    rarity: "common" as const,
  },
  DEBATES_50: {
    id: "debates_50",
    name: "Veteran",
    description: "Participated in 50 debates",
    icon: "<–",
    rarity: "rare" as const,
  },
  DEBATES_100: {
    id: "debates_100",
    name: "Master Debater",
    description: "Participated in 100 debates",
    icon: ">G",
    rarity: "epic" as const,
  },
  HIGH_EARNINGS: {
    id: "high_earnings",
    name: "Money Maker",
    description: "Earned over $1000 total",
    icon: "=°",
    rarity: "epic" as const,
  },
  PERFECT_SCORE: {
    id: "perfect_score",
    name: "Flawless",
    description: "Received a perfect 10/10 score",
    icon: "(",
    rarity: "legendary" as const,
  },
  VOTER_ACTIVE: {
    id: "voter_active",
    name: "Active Voter",
    description: "Cast 50 votes",
    icon: "=ó",
    rarity: "rare" as const,
  },
  EARLY_ADOPTER: {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Joined during beta",
    icon: "=€",
    rarity: "legendary" as const,
  },
} as const;

/**
 * User validation rules
 */
export const USER_VALIDATION = {
  BASENAME_MIN_LENGTH: 3,
  BASENAME_MAX_LENGTH: 20,
  BIO_MAX_LENGTH: 500,
  MIN_REPUTATION_TO_CREATE: 0,
  MIN_REPUTATION_TO_VOTE: 0,
  MIN_REPUTATION_TO_CHALLENGE: 0,
} as const;

/**
 * User profile settings
 */
export const PROFILE_SETTINGS = {
  DEFAULT_AVATAR_SIZE: "default" as const,
  MAX_FOLLOWERS_DISPLAY: 100,
  MAX_FOLLOWING_DISPLAY: 100,
  ACTIVITY_TIMELINE_LIMIT: 20,
  DEBATE_HISTORY_LIMIT: 10,
} as const;

/**
 * Social link prefixes
 */
export const SOCIAL_LINKS = {
  TWITTER: "https://twitter.com/",
  GITHUB: "https://github.com/",
  DISCORD: "https://discord.com/users/",
} as const;
