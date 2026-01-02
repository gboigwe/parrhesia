/**
 * Network and Chain Configuration
 */
export const CHAIN_CONFIG = {
  BASE_MAINNET: {
    id: 8453,
    name: "Base",
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: "Base Sepolia",
    rpcUrl:
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    blockExplorer: "https://sepolia.basescan.org",
  },
} as const;

/**
 * USDC Token Addresses
 */
export const USDC_ADDRESSES = {
  BASE_MAINNET: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  BASE_SEPOLIA: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
} as const;

/**
 * Debate Configuration
 */
export const DEBATE_CONFIG = {
  MIN_STAKE_USDC: 5, // Minimum stake amount in USDC
  MAX_STAKE_USDC: 1000, // Maximum stake amount in USDC
  PLATFORM_FEE_PERCENT: 5, // Platform fee percentage
  VOTER_REWARD_PERCENT: 10, // Voter rewards percentage
  MIN_ARGUMENT_LENGTH: 200, // Minimum words per argument
  MAX_ARGUMENT_LENGTH: 1000, // Maximum words per argument
  VOTING_DURATION_HOURS: 48, // Default voting duration
  ARGUMENT_RESPONSE_HOURS: 24, // Time to respond in async debates
} as const;

/**
 * Voting Criteria Weights
 */
export const VOTING_WEIGHTS = {
  ARGUMENT_QUALITY: 30, // 30%
  REBUTTAL_STRENGTH: 25, // 25%
  CLARITY: 20, // 20%
  EVIDENCE: 15, // 15%
  PERSUASIVENESS: 10, // 10%
} as const;

/**
 * Reputation Calculation Weights
 */
export const REPUTATION_WEIGHTS = {
  DEBATER: {
    WIN_RATE: 25,
    AVG_SCORES: 30,
    PARTICIPATION: 10,
    TOPIC_COMPLEXITY: 10,
    CONSISTENCY: 15,
    ENDORSEMENTS: 10,
  },
  VOTER: {
    ACCURACY: 35,
    TOTAL_VOTES: 15,
    EXPLANATION_QUALITY: 20,
    DOMAIN_EXPERTISE: 15,
    CONSISTENCY: 15,
  },
} as const;

/**
 * Debate Categories
 */
export const DEBATE_CATEGORIES = [
  { id: "crypto", label: "Crypto/Web3", emoji: "₿" },
  { id: "tech", label: "Technology & AI", emoji: "🤖" },
  { id: "policy", label: "Policy & Governance", emoji: "🏛️" },
  { id: "economics", label: "Economics & Finance", emoji: "💰" },
  { id: "social", label: "Social Issues", emoji: "🌍" },
  { id: "entertainment", label: "Entertainment & Culture", emoji: "🎭" },
  { id: "dao", label: "DAOs & Protocol Governance", emoji: "🗳️" },
  { id: "custom", label: "Custom", emoji: "✨" },
] as const;

/**
 * Debate Status
 */
export const DEBATE_STATUS = {
  PENDING: "pending", // Waiting for opponent
  ACTIVE: "active", // Debate in progress
  VOTING: "voting", // Voting period
  COMPLETED: "completed", // Results finalized
  CANCELLED: "cancelled", // Debate cancelled
} as const;

/**
 * Badge Types
 */
export const BADGE_TYPES = {
  // Debater Badges
  FIRST_WIN: "first_win",
  WIN_STREAK_10: "win_streak_10",
  GIANT_SLAYER: "giant_slayer",
  SPECIALIST: "specialist",
  UNDEFEATED: "undefeated",

  // Voter Badges
  VOTES_100: "votes_100",
  CONSENSUS_BUILDER: "consensus_builder",
  EARLY_ADOPTER: "early_adopter",
  CATEGORY_EXPERT: "category_expert",

  // Special Badges
  TOURNAMENT_WINNER: "tournament_winner",
  PIONEER: "pioneer",
  COMMUNITY_FAVORITE: "community_favorite",
} as const;

/**
 * Transaction Types for Paymaster
 */
export const SPONSORED_ACTIONS = {
  VOTE: "vote",
  CREATE_DEBATE: "create_debate",
  CLAIM_PRIZE: "claim_prize",
  UPDATE_PROFILE: "update_profile",
} as const;

/**
 * API Endpoints
 */
export const API_ROUTES = {
  DEBATES: "/api/debates",
  USERS: "/api/users",
  VOTES: "/api/votes",
  LEADERBOARD: "/api/leaderboard",
  AI_JUDGE: "/api/ai/judge",
  AI_COACH: "/api/ai/coach",
  AI_MODERATE: "/api/ai/moderate",
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  THEME: "parrhesia_theme",
  RECENT_DEBATES: "parrhesia_recent_debates",
  USER_PREFERENCES: "parrhesia_user_prefs",
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Please connect your wallet",
  INSUFFICIENT_BALANCE: "Insufficient USDC balance",
  BASENAME_REQUIRED: "Basename required to participate",
  INVALID_STAKE: "Invalid stake amount",
  TRANSACTION_FAILED: "Transaction failed",
  NETWORK_ERROR: "Network error. Please try again",
} as const;
