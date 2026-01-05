/**
 * Voting system constants and configuration
 */

export const VOTING_WEIGHTS = {
  ARGUMENT_QUALITY: 30, // 30%
  REBUTTAL_STRENGTH: 25, // 25%
  CLARITY: 20, // 20%
  EVIDENCE: 15, // 15%
  PERSUASIVENESS: 10, // 10%
} as const;

export const VOTING_CONSTRAINTS = {
  MIN_SCORE: 1,
  MAX_SCORE: 10,
  MIN_VOTES_FOR_CONCLUSION: 3,
  MAX_FEEDBACK_LENGTH: 500,
  VOTING_DURATION_HOURS: 72, // 3 days
} as const;

export const PRIZE_DISTRIBUTION = {
  PLATFORM_FEE_PERCENT: 5,
  VOTER_REWARD_PERCENT: 10,
} as const;

export const VOTING_MESSAGES = {
  NOT_LOGGED_IN: "You must be logged in to vote",
  NOT_IN_VOTING_PHASE: "Debate is not in voting phase",
  PARTICIPANT_CANNOT_VOTE: "Debate participants cannot vote",
  ALREADY_VOTED: "You have already voted on this debate",
  INVALID_WINNER: "Invalid winner selected",
  INVALID_SCORES: "All scores must be between 1 and 10",
  SCORE_OUT_OF_RANGE: "must be between 1 and 10",
  SCORE_NOT_NUMBER: "must be a number",
  SCORE_NOT_INTEGER: "must be a whole number",
  FEEDBACK_TOO_LONG: `Feedback must be less than ${VOTING_CONSTRAINTS.MAX_FEEDBACK_LENGTH} characters`,
  VOTE_SUBMITTED: "Vote submitted successfully",
  VOTE_FAILED: "Failed to submit vote",
  INSUFFICIENT_VOTES: "Not enough votes to determine winner",
} as const;

export const VOTING_CRITERIA = [
  {
    key: "argumentQuality" as const,
    name: "Argument Quality",
    weight: VOTING_WEIGHTS.ARGUMENT_QUALITY,
    description: "Strength and coherence of main arguments presented",
    tips: "Consider logical structure, relevance, and depth of reasoning",
  },
  {
    key: "rebuttalStrength" as const,
    name: "Rebuttal Strength",
    weight: VOTING_WEIGHTS.REBUTTAL_STRENGTH,
    description: "Effectiveness in countering opponent's arguments",
    tips: "Evaluate how well they addressed and refuted opposing points",
  },
  {
    key: "clarity" as const,
    name: "Clarity",
    weight: VOTING_WEIGHTS.CLARITY,
    description: "How clearly and understandably arguments were communicated",
    tips: "Consider organization, language use, and ease of understanding",
  },
  {
    key: "evidence" as const,
    name: "Evidence",
    weight: VOTING_WEIGHTS.EVIDENCE,
    description: "Quality and relevance of supporting evidence",
    tips: "Look for credible sources, data, and factual backing",
  },
  {
    key: "persuasiveness" as const,
    name: "Persuasiveness",
    weight: VOTING_WEIGHTS.PERSUASIVENESS,
    description: "Overall ability to convince and influence",
    tips: "Consider emotional appeal, rhetoric, and overall impact",
  },
] as const;

export const REPUTATION_REWARDS = {
  VOTE_CAST: 2,
  WINNER_PARTICIPANT: 50,
  LOSER_PARTICIPANT: 10,
  VOTER_CORRECT_PREDICTION: 5,
} as const;
