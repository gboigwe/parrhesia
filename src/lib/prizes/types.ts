/**
 * Prize Distribution Type Definitions
 */

export interface PrizeClaimRequest {
  debateId: string;
  winnerAddress: string;
  claimedBy: string;
  contractAddress: string;
}

export interface PrizeClaimResponse {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  amount?: string;
  error?: string;
}

export interface PrizeEligibility {
  isEligible: boolean;
  reason?: string;
  winner?: string;
  amount?: string;
  alreadyClaimed?: boolean;
  contractBalance?: string;
}

export interface PrizeClaimStatus {
  debateId: string;
  status: "unclaimed" | "pending" | "confirmed" | "failed";
  transactionHash?: string;
  claimedAt?: Date;
  amount?: string;
  blockNumber?: number;
  error?: string;
}

export interface PrizeDistribution {
  winner: string;
  loser: string;
  winnerAmount: string;
  platformFee: string;
  totalPool: string;
}

export interface ClaimTransaction {
  id: string;
  debateId: string;
  winnerAddress: string;
  amount: string;
  transactionHash: string;
  blockNumber: number;
  status: "pending" | "confirmed" | "failed";
  gasUsed?: string;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface PrizePoolState {
  totalStaked: string;
  creatorStake: string;
  challengerStake: string;
  platformFee: string;
  isFinalized: boolean;
  winner?: string;
  prizeClaimed: boolean;
}
