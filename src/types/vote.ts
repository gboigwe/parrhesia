/**
 * Vote type definitions
 */

export interface Vote {
  id: string;
  debateId: string;
  voterId: string;
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  totalScore: string;
  weight: string;
  feedback?: string | null;
  submittedAt: Date;
  transactionHash?: string | null;
  rewardAmount?: string | null;
  rewardClaimed?: Date | null;
}

export interface VoteWithRelations extends Vote {
  voter: {
    id: string;
    basename: string;
    voterReputation: string;
  };
  winner: {
    id: string;
    basename: string;
  };
}

export interface CreateVoteInput {
  debateId: string;
  voterId: string;
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  feedback?: string;
  transactionHash?: string;
}

export interface VoteStats {
  totalVotes: number;
  creatorVotes: number;
  challengerVotes: number;
  creatorAvgScore: number;
  challengerAvgScore: number;
  creatorPercentage: number;
  challengerPercentage: number;
}

export interface WinnerResult {
  winnerId: string | null;
  isTie: boolean;
  creatorVotes: number;
  challengerVotes: number;
}
