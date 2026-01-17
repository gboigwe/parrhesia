/**
 * Badge System Constants
 * Achievement badges for debaters and voters
 */

export const BADGE_TYPES = {
  // Debater Badges
  FIRST_WIN: "first_win",
  WIN_STREAK_5: "win_streak_5",
  WIN_STREAK_10: "win_streak_10",
  GIANT_SLAYER: "giant_slayer",
  PERFECT_SCORE: "perfect_score",
  SPECIALIST: "specialist",
  VERSATILE: "versatile",
  DEBATE_VETERAN: "debate_veteran",

  // Voter Badges
  FIRST_VOTE: "first_vote",
  ACCURATE_VOTER: "accurate_voter",
  VOTE_STREAK: "vote_streak",
  SUPER_VOTER: "super_voter",
  ORACLE: "oracle",

  // Special Badges
  LEGENDARY_DEBATER: "legendary_debater",
  TOP_CONTRIBUTOR: "top_contributor",
  COMMUNITY_CHAMPION: "community_champion",
} as const;

export const BADGE_METADATA = {
  [BADGE_TYPES.FIRST_WIN]: {
    name: "First Victory",
    description: "Win your first debate",
    requirement: "Win 1 debate",
    icon: "trophy",
    color: "gold",
    rarity: "common",
  },
  [BADGE_TYPES.WIN_STREAK_5]: {
    name: "On Fire",
    description: "Win 5 debates in a row",
    requirement: "5 consecutive wins",
    icon: "flame",
    color: "orange",
    rarity: "rare",
  },
  [BADGE_TYPES.WIN_STREAK_10]: {
    name: "Unstoppable",
    description: "Win 10 debates in a row",
    requirement: "10 consecutive wins",
    icon: "zap",
    color: "purple",
    rarity: "epic",
  },
  [BADGE_TYPES.GIANT_SLAYER]: {
    name: "Giant Slayer",
    description: "Defeat a higher-ranked opponent",
    requirement: "Beat opponent 20+ ranks above",
    icon: "target",
    color: "red",
    rarity: "rare",
  },
  [BADGE_TYPES.PERFECT_SCORE]: {
    name: "Flawless",
    description: "Receive a perfect 10/10 score",
    requirement: "Get 10/10 weighted score",
    icon: "star",
    color: "yellow",
    rarity: "epic",
  },
  [BADGE_TYPES.SPECIALIST]: {
    name: "Category Specialist",
    description: "Win 10 debates in same category",
    requirement: "10 wins in one category",
    icon: "award",
    color: "blue",
    rarity: "rare",
  },
  [BADGE_TYPES.VERSATILE]: {
    name: "Jack of All Trades",
    description: "Debate in 5 different categories",
    requirement: "Participate in 5 categories",
    icon: "layers",
    color: "green",
    rarity: "uncommon",
  },
  [BADGE_TYPES.DEBATE_VETERAN]: {
    name: "Veteran Debater",
    description: "Complete 50 debates",
    requirement: "50 total debates",
    icon: "shield",
    color: "silver",
    rarity: "rare",
  },
  [BADGE_TYPES.FIRST_VOTE]: {
    name: "First Vote",
    description: "Cast your first vote",
    requirement: "Vote in 1 debate",
    icon: "check",
    color: "blue",
    rarity: "common",
  },
  [BADGE_TYPES.ACCURATE_VOTER]: {
    name: "Sharp Eye",
    description: "80% voting accuracy",
    requirement: "80% correct predictions",
    icon: "eye",
    color: "cyan",
    rarity: "rare",
  },
  [BADGE_TYPES.VOTE_STREAK]: {
    name: "Consistent Voter",
    description: "Vote 7 days in a row",
    requirement: "7 day voting streak",
    icon: "calendar",
    color: "purple",
    rarity: "uncommon",
  },
  [BADGE_TYPES.SUPER_VOTER]: {
    name: "Super Voter",
    description: "Cast 100 votes",
    requirement: "100 total votes",
    icon: "thumbs-up",
    color: "indigo",
    rarity: "rare",
  },
  [BADGE_TYPES.ORACLE]: {
    name: "Oracle",
    description: "95% voting accuracy over 50 votes",
    requirement: "95% accuracy, 50+ votes",
    icon: "sparkles",
    color: "gold",
    rarity: "legendary",
  },
  [BADGE_TYPES.LEGENDARY_DEBATER]: {
    name: "Legend",
    description: "Reach Legendary tier reputation",
    requirement: "Reputation 90+",
    icon: "crown",
    color: "purple",
    rarity: "legendary",
  },
  [BADGE_TYPES.TOP_CONTRIBUTOR]: {
    name: "Top Contributor",
    description: "Rank in top 10",
    requirement: "Top 10 on leaderboard",
    icon: "trending-up",
    color: "orange",
    rarity: "epic",
  },
  [BADGE_TYPES.COMMUNITY_CHAMPION]: {
    name: "Community Champion",
    description: "Help moderate the platform",
    requirement: "Moderator role",
    icon: "heart",
    color: "pink",
    rarity: "legendary",
  },
} as const;

export const BADGE_RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
} as const;

export const RARITY_COLORS = {
  common: "gray",
  uncommon: "green",
  rare: "blue",
  epic: "purple",
  legendary: "gold",
} as const;
