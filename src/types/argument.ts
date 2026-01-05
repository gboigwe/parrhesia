/**
 * Argument type definitions
 */

export interface Argument {
  id: string;
  debateId: string;
  userId: string;
  content: string;
  contentIpfsHash?: string | null;
  wordCount: number;
  citations?: string[] | null;
  roundNumber: number;
  postedAt: Date;
  updatedAt: Date;
  transactionHash?: string | null;
}

export interface ArgumentWithUser extends Argument {
  user: {
    id: string;
    basename: string;
    debaterReputation: string;
  };
}

export interface CreateArgumentInput {
  debateId: string;
  userId: string;
  content: string;
  roundNumber: number;
  citations?: string[];
  transactionHash?: string;
}

export interface ArgumentDraft {
  debateId: string;
  content: string;
  lastSaved: Date;
}
