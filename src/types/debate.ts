/**
 * Debate type definitions
 */

export type DebateStatus = "pending" | "active" | "voting" | "completed" | "cancelled";
export type DebateFormat = "timed" | "async";
export type DebateCategory =
  | "crypto"
  | "tech"
  | "policy"
  | "economics"
  | "social"
  | "entertainment"
  | "dao"
  | "custom";

export interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: DebateCategory;
  format: DebateFormat;
  status: DebateStatus;
  stakeAmount: string;
  prizePool: string;
  createdAt: Date;
  updatedAt: Date;
  startTime?: Date | null;
  endTime?: Date | null;
  votingEndsAt?: Date | null;
  contractAddress?: string | null;
  transactionHash?: string | null;
  creatorId: string;
  challengerId?: string | null;
  winnerId?: string | null;
}

export interface DebateWithParticipants extends Debate {
  creator: {
    id: string;
    basename: string;
    debaterReputation: string;
  };
  challenger?: {
    id: string;
    basename: string;
    debaterReputation: string;
  } | null;
  winner?: {
    id: string;
    basename: string;
  } | null;
}

export interface CreateDebateInput {
  title: string;
  description: string;
  category: DebateCategory;
  format: "live" | "async";
  stakeAmount: number;
  creatorId: string;
  contractAddress?: string;
  transactionHash?: string;
}

export interface JoinDebateInput {
  debateId: string;
  challengerId: string;
  transactionHash?: string;
}
