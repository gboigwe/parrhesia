/**
 * Voting Type Definitions
 * Centralized TypeScript types for voting system
 */

/**
 * Voting criterion configuration
 */
export interface VotingCriterion {
  key: string;
  name: string;
  weight: number;
  description: string;
  tips: string;
}

/**
 * Vote scores for all criteria
 */
export interface VoteScores {
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
}

/**
 * Vote data submitted by user
 */
export interface VoteData {
  debateId: string;
  userId: string;
  winner: "creator" | "challenger";
  scores: VoteScores;
  feedback?: string;
}

/**
 * Vote record from database
 */
export interface Vote {
  id: string;
  debateId: string;
  userId: string;
  winnerId: string;
  totalScore: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  feedback?: string;
  transactionHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Voting eligibility check result
 */
export interface VotingEligibility {
  eligible: boolean;
  reason?: string;
}

/**
 * Vote statistics for a debate
 */
export interface VoteStats {
  totalVotes: number;
  creatorVotes: number;
  challengerVotes: number;
  creatorAvgScore: number;
  challengerAvgScore: number;
  creatorPercentage: number;
  challengerPercentage: number;
}

/**
 * Winner determination result
 */
export interface WinnerResult {
  winnerId: string | null;
  isTie: boolean;
  creatorVotes: number;
  challengerVotes: number;
}

/**
 * Prize distribution breakdown
 */
export interface PrizeDistribution {
  winnerPrize: number;
  platformFee: number;
  voterRewardPool: number;
  perVoterReward: number;
}

/**
 * Score label type for UI feedback
 */
export type ScoreLabel = "Poor" | "Fair" | "Good" | "Very Good" | "Excellent";

/**
 * Vote submission response
 */
export interface VoteSubmissionResponse {
  message: string;
  vote: Vote;
}
