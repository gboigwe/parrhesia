/**
 * Reputation System Type Definitions
 */

export interface ReputationScore {
  userId: string;
  totalReputation: number;
  debaterReputation: number;
  voterReputation: number;
  tier: string;
  rank: number | null;
  reputationChange: number;
  lastUpdated: Date;
}

export interface DebaterStats {
  userId: string;
  wins: number;
  losses: number;
  totalDebates: number;
  winRate: number;
  averageScore: number;
  consecutiveWins: number;
  categoryDebates: Record<string, number>;
  bestCategory: string | null;
}

export interface VoterStats {
  userId: string;
  totalVotes: number;
  correctVotes: number;
  accuracy: number;
  participationRate: number;
  averageVoteQuality: number;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  basename: string;
  address: string;
  reputation: number;
  reputationChange?: number;
  // Debater-specific
  wins?: number;
  losses?: number;
  totalDebates?: number;
  winRate?: number;
  // Voter-specific
  totalVotes?: number;
  correctVotes?: number;
  accuracy?: number;
}

export interface LeaderboardData {
  debaters: LeaderboardEntry[];
  voters: LeaderboardEntry[];
  stats: {
    totalDebaters: number;
    totalVoters: number;
    avgDebaterReputation: number;
    avgVoterReputation: number;
    topDebaterReputation: number;
    topVoterReputation: number;
  };
}

export interface ReputationTier {
  tier: string;
  color: string;
  minScore: number;
  maxScore: number;
}

export interface ReputationBreakdown {
  winRate: number;
  averageScore: number;
  participation: number;
  topicComplexity: number;
  consistency: number;
  engagement: number;
}

export interface ReputationHistory {
  userId: string;
  date: Date;
  reputation: number;
  change: number;
  event: string;
  eventId: string;
}
