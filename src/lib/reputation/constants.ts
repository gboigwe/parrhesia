/**
 * Reputation and Leaderboard Constants
 */

/**
 * Reputation formula weights for debaters
 */
export const DEBATER_WEIGHTS = {
  WIN_RATE: 25,
  AVERAGE_SCORE: 30,
  PARTICIPATION: 10,
  TOPIC_COMPLEXITY: 10,
  CONSISTENCY: 15,
  ENGAGEMENT: 10,
} as const;

/**
 * Reputation formula weights for voters
 */
export const VOTER_WEIGHTS = {
  ACCURACY: 40,
  PARTICIPATION: 25,
  VOTE_QUALITY: 20,
  CONSISTENCY: 15,
} as const;

/**
 * Reputation tier thresholds
 */
export const REPUTATION_TIERS = {
  LEGENDARY: { min: 90, max: 100, color: "purple" },
  MASTER: { min: 75, max: 89, color: "blue" },
  EXPERT: { min: 60, max: 74, color: "green" },
  INTERMEDIATE: { min: 40, max: 59, color: "yellow" },
  BEGINNER: { min: 20, max: 39, color: "orange" },
  NOVICE: { min: 0, max: 19, color: "gray" },
} as const;

/**
 * Leaderboard display settings
 */
export const LEADERBOARD_SETTINGS = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  TOP_RANKS_HIGHLIGHT: 3, // Gold, silver, bronze
  UPDATE_INTERVAL_MS: 60000, // 1 minute
  CACHE_TTL_MS: 300000, // 5 minutes
} as const;

/**
 * Reputation update triggers
 */
export const REPUTATION_EVENTS = {
  DEBATE_WIN: "debate_win",
  DEBATE_LOSS: "debate_loss",
  DEBATE_TIE: "debate_tie",
  VOTE_CAST: "vote_cast",
  CORRECT_VOTE: "correct_vote",
  ARGUMENT_SUBMITTED: "argument_submitted",
  PRIZE_CLAIMED: "prize_claimed",
  STREAK_MILESTONE: "streak_milestone",
  RANK_MILESTONE: "rank_milestone",
} as const;

/**
 * Minimum requirements for leaderboard inclusion
 */
export const LEADERBOARD_REQUIREMENTS = {
  MIN_DEBATES_DEBATER: 3,
  MIN_VOTES_VOTER: 5,
  MIN_ACTIVITY_DAYS: 7,
} as const;

/**
 * Reputation change thresholds
 */
export const REPUTATION_CHANGES = {
  SIGNIFICANT_INCREASE: 5,
  SIGNIFICANT_DECREASE: -5,
  DISPLAY_THRESHOLD: 0.1,
} as const;
