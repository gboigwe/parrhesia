/**
 * Results System Type Definitions
 */

export interface DebateResultSummary {
  winnerId: string | null;
  isTie: boolean;
  creatorVotes: number;
  challengerVotes: number;
  totalVotes: number;
  creatorPercentage: number;
  challengerPercentage: number;
  creatorAvgScore: number;
  challengerAvgScore: number;
}

export interface PrizeDistributionDetails {
  totalPool: number;
  winnerPrize: number;
  voterRewardPool: number;
  platformFee: number;
  perVoterReward: number;
  winnerPercentage: number;
  voterPercentage: number;
  platformPercentage: number;
}

export interface ClaimStatus {
  prizeClaimed: boolean;
  rewardClaimed: boolean;
  claimTransactionHash?: string;
  claimedAt?: Date;
}

export interface ResultsPageData {
  debate: {
    id: string;
    topic: string;
    resolution: string;
    status: string;
    prizePool: string;
    creator: {
      id: string;
      basename: string;
      address: string;
    };
    challenger: {
      id: string;
      basename: string;
      address: string;
    };
    prizeClaimed: boolean;
  };
  votes: Array<{
    id: string;
    userId: string;
    winnerId: string;
    totalScore: string;
    argumentQuality: number;
    rebuttalStrength: number;
    clarity: number;
    evidence: number;
    persuasiveness: number;
    rewardClaimed: boolean;
  }>;
  winner: DebateResultSummary;
  currentUser?: {
    id: string;
    basename: string;
  };
}

export interface CriterionScore {
  key: string;
  name: string;
  weight: number;
  creatorAvg: number;
  challengerAvg: number;
}
