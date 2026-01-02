import { Address } from "viem";

/**
 * User and Identity Types
 */
export interface User {
  id: string;
  basename: string;
  walletAddress: Address;
  createdAt: Date;
  debaterReputation: number;
  voterReputation: number;
  totalDebates: number;
  totalVotes: number;
  winRate: number;
}

/**
 * Debate Types
 */
export type DebateStatus = "pending" | "active" | "voting" | "completed" | "cancelled";
export type DebateFormat = "async" | "timed";
export type DebateCategory = "crypto" | "tech" | "policy" | "economics" | "social" | "entertainment" | "dao" | "custom";

export interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: DebateCategory;
  format: DebateFormat;
  stakeAmount: number; // in USDC
  creatorId: string;
  creator: User;
  challengerId?: string;
  challenger?: User;
  status: DebateStatus;
  startTime?: Date;
  endTime?: Date;
  contractAddress?: Address;
  prizePool: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Argument Types
 */
export interface Argument {
  id: string;
  debateId: string;
  userId: string;
  user: User;
  roundNumber: number;
  content: string;
  contentIpfsHash?: string;
  postedAt: Date;
  wordCount: number;
  citations?: string[];
}

/**
 * Voting Types
 */
export interface VotingCriteria {
  argumentQuality: number; // 1-10
  rebuttalStrength: number; // 1-10
  clarity: number; // 1-10
  evidence: number; // 1-10
  persuasiveness: number; // 1-10
}

export interface Vote {
  id: string;
  debateId: string;
  voterId: string;
  voter: User;
  winnerId: string;
  scores: VotingCriteria;
  feedback?: string;
  weight: number;
  submittedAt: Date;
}

export interface VoteResults {
  debateId: string;
  winnerId: string;
  winner: User;
  totalVotes: number;
  winnerScore: number;
  loserScore: number;
  breakdown: VotingCriteria;
  finalizedAt: Date;
}

/**
 * Reputation Types
 */
export interface ReputationEvent {
  id: string;
  userId: string;
  eventType: "debate_win" | "debate_loss" | "vote_cast" | "badge_earned";
  delta: number;
  debateId?: string;
  timestamp: Date;
  reason?: string;
}

/**
 * Badge Types
 */
export type BadgeType =
  | "first_win"
  | "win_streak_10"
  | "giant_slayer"
  | "specialist"
  | "undefeated"
  | "votes_100"
  | "consensus_builder"
  | "early_adopter"
  | "category_expert"
  | "tournament_winner"
  | "pioneer"
  | "community_favorite";

export interface Badge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  tokenId: number;
  metadataUri: string;
  earnedAt: Date;
}

/**
 * Leaderboard Types
 */
export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  wins?: number;
  losses?: number;
  totalVotes?: number;
  accuracy?: number;
}

/**
 * Transaction Types
 */
export interface Transaction {
  hash: Address;
  type: "stake" | "vote" | "claim" | "create_debate";
  status: "pending" | "success" | "failed";
  timestamp: Date;
  userId: string;
  debateId?: string;
}

/**
 * AI Types
 */
export interface AIJudgment {
  debateId: string;
  scores: VotingCriteria;
  reasoning: string;
  confidence: number; // 0-1
  factChecks: {
    claim: string;
    verdict: "true" | "false" | "unverified";
    sources: string[];
  }[];
}

/**
 * Form Types
 */
export interface CreateDebateFormData {
  topic: string;
  resolution: string;
  category: DebateCategory;
  format: DebateFormat;
  stakeAmount: number;
  duration: number; // in hours
  challengerId?: string; // Optional specific challenger
}

export interface VoteFormData {
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  winnerId: string;
  feedback?: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
