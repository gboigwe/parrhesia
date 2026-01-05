/**
 * Debate system constants and configurations
 */

/**
 * Debate timing configurations
 */
export const DEBATE_TIMING = {
  MIN_STAKE_AMOUNT: 5, // USDC
  MAX_STAKE_AMOUNT: 1000, // USDC
  DEFAULT_VOTING_DURATION: 72, // hours
  DEFAULT_ARGUMENT_TIMEOUT: 48, // hours
  LIVE_DEBATE_MIN_DURATION: 15, // minutes
  LIVE_DEBATE_MAX_DURATION: 120, // minutes
  ASYNC_ROUND_DURATION: 24, // hours
} as const;

/**
 * Debate format configurations
 */
export const DEBATE_FORMATS = {
  TIMED: {
    id: "timed",
    label: "Live Debate",
    description: "Real-time synchronous debate",
    emoji: "¡",
    minDuration: 15,
    maxDuration: 120,
  },
  ASYNC: {
    id: "async",
    label: "Async Debate",
    description: "Extended debate with 24-48hr response windows",
    emoji: "=Ý",
    roundDuration: 24,
    maxRounds: 10,
  },
} as const;

/**
 * Platform fees and rewards
 */
export const PLATFORM_ECONOMICS = {
  PLATFORM_FEE_PERCENT: 5,
  VOTER_REWARD_POOL_PERCENT: 10,
  CREATOR_REPUTATION_REWARD: 50,
  CHALLENGER_REPUTATION_REWARD: 50,
  VOTER_REPUTATION_REWARD: 2,
  LOSER_REPUTATION_PENALTY: 0, // No penalty for losing
} as const;

/**
 * Voting configurations
 */
export const VOTING_CONFIG = {
  MIN_VOTES_FOR_CONCLUSION: 3,
  MAX_VOTES_PER_USER: 1,
  VOTING_CRITERIA: [
    {
      id: "argumentQuality",
      name: "Argument Quality",
      weight: 30,
      description: "Strength and coherence of main arguments",
    },
    {
      id: "rebuttalStrength",
      name: "Rebuttal Strength",
      weight: 25,
      description: "Effectiveness in countering opponent's arguments",
    },
    {
      id: "clarity",
      name: "Clarity",
      weight: 20,
      description: "How clearly arguments were communicated",
    },
    {
      id: "evidence",
      name: "Evidence",
      weight: 15,
      description: "Quality and relevance of supporting evidence",
    },
    {
      id: "persuasiveness",
      name: "Persuasiveness",
      weight: 10,
      description: "Overall ability to convince and influence",
    },
  ],
} as const;

/**
 * Status configurations
 */
export const STATUS_CONFIG = {
  PENDING: {
    id: "pending",
    label: "Waiting for Challenger",
    color: "yellow",
    description: "Debate created, waiting for opponent",
  },
  ACTIVE: {
    id: "active",
    label: "In Progress",
    color: "blue",
    description: "Debate is currently ongoing",
  },
  VOTING: {
    id: "voting",
    label: "Voting Open",
    color: "purple",
    description: "Arguments submitted, community voting",
  },
  COMPLETED: {
    id: "completed",
    label: "Completed",
    color: "green",
    description: "Debate finished with winner determined",
  },
  CANCELLED: {
    id: "cancelled",
    label: "Cancelled",
    color: "red",
    description: "Debate was cancelled",
  },
} as const;

/**
 * Argument configurations
 */
export const ARGUMENT_CONFIG = {
  MIN_LENGTH: 50, // characters
  MAX_LENGTH: 5000, // characters
  MAX_ARGUMENTS_PER_ROUND: 1,
  ALLOW_MARKDOWN: true,
  ALLOW_LINKS: true,
} as const;

/**
 * Moderation rules
 */
export const MODERATION_RULES = {
  BANNED_WORDS: [], // Add banned words list
  MAX_REPORTS_BEFORE_REVIEW: 3,
  AUTO_BAN_THRESHOLD: 5,
  MINIMUM_REPUTATION_TO_CREATE: 0,
  MINIMUM_REPUTATION_TO_VOTE: 0,
} as const;

/**
 * Smart contract addresses (placeholder - update with actual addresses)
 */
export const CONTRACT_ADDRESSES = {
  DEBATE_FACTORY: process.env.NEXT_PUBLIC_DEBATE_FACTORY_ADDRESS || "",
  DEBATE_POOL: process.env.NEXT_PUBLIC_DEBATE_POOL_ADDRESS || "",
  VOTING: process.env.NEXT_PUBLIC_VOTING_ADDRESS || "",
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base Mainnet USDC
} as const;

/**
 * Network configurations
 */
export const NETWORK_CONFIG = {
  CHAIN_ID: 8453, // Base Mainnet
  CHAIN_NAME: "Base",
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org",
  BLOCK_EXPLORER: "https://basescan.org",
} as const;
